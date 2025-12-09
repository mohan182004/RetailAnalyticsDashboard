const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Helper function to build filter query
const buildFilterQuery = (query) => {
  const filter = {};
  
  // Date Range from query (old style for backward compatibility)
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }
  
  // New Date Range (object format from frontend)
  if (query.dateRange) {
    const dateRange = typeof query.dateRange === 'string' ? JSON.parse(query.dateRange) : query.dateRange;
    if (dateRange.start || dateRange.end) {
      filter.date = {};
      if (dateRange.start) filter.date.$gte = new Date(dateRange.start);
      if (dateRange.end) filter.date.$lte = new Date(dateRange.end);
    }
  }
  
  // Multi-Select Filters (arrays)
  if (query.regions) {
    const regions = typeof query.regions === 'string' ? JSON.parse(query.regions) : query.regions;
    if (Array.isArray(regions) && regions.length > 0) {
      filter.customerRegion = { $in: regions };
    }
  }
  
  if (query.genders) {
    const genders = typeof query.genders === 'string' ? JSON.parse(query.genders) : query.genders;
    if (Array.isArray(genders) && genders.length > 0) {
      filter.gender = { $in: genders };
    }
  }
  
  if (query.categories) {
    const categories = typeof query.categories === 'string' ? JSON.parse(query.categories) : query.categories;
    if (Array.isArray(categories) && categories.length > 0) {
      filter.productCategory = { $in: categories };
    }
  }
  
  if (query.paymentMethods) {
    const paymentMethods = typeof query.paymentMethods === 'string' ? JSON.parse(query.paymentMethods) : query.paymentMethods;
    if (Array.isArray(paymentMethods) && paymentMethods.length > 0) {
      filter.paymentMethod = { $in: paymentMethods };
    }
  }
  
  // Age Range (object format)
  if (query.ageRange) {
    const ageRange = typeof query.ageRange === 'string' ? JSON.parse(query.ageRange) : query.ageRange;
    if (ageRange.min || ageRange.max) {
      filter.age = {};
      if (ageRange.min) filter.age.$gte = parseInt(ageRange.min);
      if (ageRange.max) filter.age.$lte = parseInt(ageRange.max);
    }
  }
  
  // Tags (multi-select array)
  if (query.tags) {
    const tags = typeof query.tags === 'string' ? JSON.parse(query.tags) : query.tags;
    if (Array.isArray(tags) && tags.length > 0) {
      filter.tags = { $in: tags };
    }
  }
  
  // Legacy single-value filters (for backward compatibility)
  if (query.brand) filter.brand = query.brand;
  if (query.category && !query.categories) filter.productCategory = query.category;
  if (query.region && !query.regions) filter.customerRegion = query.region;
  if (query.status) filter.orderStatus = query.status;
  if (query.gender && !query.genders) filter.gender = query.gender;
  if (query.paymentMethod && !query.paymentMethods) filter.paymentMethod = query.paymentMethod;
  
  return filter;
};

// GET /api/transactions - Paginated transaction list
router.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sort = req.query.sort || 'customerName';
    const order = req.query.order === 'desc' ? -1 : 1;

    let filter = buildFilterQuery(req.query);

    // Add search functionality
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Transaction.countDocuments(filter);
    
    const transactions = await Transaction.find(filter)
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit);

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/overview - KPI summary stats
router.get('/overview', async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    
    const stats = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$finalAmount' },
          totalTransactions: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          avgOrderValue: { $avg: '$finalAmount' },
          avgDiscount: { $avg: '$discountPercentage' }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalSales: 0,
      totalTransactions: 0,
      totalQuantity: 0,
      avgOrderValue: 0,
      avgDiscount: 0
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/category-sales - Category-wise sales
router.get('/category-sales', async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    
    const categorySales = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$productCategory',
          totalSales: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);
    
    res.json(categorySales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sales-trends - Sales trends over time
router.get('/sales-trends', async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    
    const trends = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalSales: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Format for chart
    const formattedTrends = trends.map(t => ({
      month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
      totalSales: t.totalSales,
      count: t.count
    }));
    
    res.json(formattedTrends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/top-products - Top selling products
router.get('/top-products', async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    const limit = parseInt(req.query.limit) || 10;
    
    const topProducts = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$productName',
          totalSales: { $sum: '$finalAmount' },
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: limit }
    ]);
    
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/brand-sales - Brand-wise sales
router.get('/brand-sales', async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    
    const brandSales = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$brand',
          totalSales: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);
    
    res.json(brandSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/region-sales - Region-wise sales
router.get('/region-sales', async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    
    const regionSales = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$customerRegion',
          totalSales: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);
    
    res.json(regionSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/filters - Available filter options
router.get('/filters', async (req, res) => {
  try {
    const [brands, categories, regions, statuses, tags] = await Promise.all([
      Transaction.distinct('brand'),
      Transaction.distinct('productCategory'),
      Transaction.distinct('customerRegion'),
      Transaction.distinct('orderStatus'),
      Transaction.distinct('tags')
    ]);
    
    // Flatten tags array since tags is an array field
    const allTags = [...new Set(tags.flat())].filter(Boolean).sort();
    
    res.json({ brands, categories, regions, statuses, tags: allTags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/payment-methods - Payment method distribution
router.get('/payment-methods', async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    
    const paymentMethods = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$paymentMethod',
          totalSales: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/order-status - Order status distribution
router.get('/order-status', async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    
    const orderStatus = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalSales: { $sum: '$finalAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json(orderStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
