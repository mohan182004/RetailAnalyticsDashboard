import { useState, useEffect } from 'react';
import CategorySalesChart from './CategorySalesChart';
import SalesTrendsChart from './SalesTrendsChart';
import TopProductsChart from './TopProductsChart';
import BrandSalesChart from './BrandSalesChart';
import RegionSalesChart from './RegionSalesChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import {
  getCategorySales,
  getSalesTrends,
  getTopProducts,
  getBrandSales,
  getRegionSales,
  getPaymentMethods,
  getOverview
} from '../services/api';

const DashboardView = ({ filters }) => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [categorySales, setCategorySales] = useState([]);
  const [salesTrends, setSalesTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [brandSales, setBrandSales] = useState([]);
  const [regionSales, setRegionSales] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          overviewData,
          categoryData,
          trendsData,
          productsData,
          brandData,
          regionData,
          paymentData
        ] = await Promise.all([
          getOverview(filters),
          getCategorySales(filters),
          getSalesTrends(filters),
          getTopProducts(filters, 10),
          getBrandSales(filters),
          getRegionSales(filters),
          getPaymentMethods(filters)
        ]);
        
        setOverview(overviewData);
        setCategorySales(categoryData);
        setSalesTrends(trendsData);
        setTopProducts(productsData);
        setBrandSales(brandData);
        setRegionSales(regionData);
        setPaymentMethods(paymentData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filters]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('en-IN').format(Math.round(value));
  };

  // KPI Cards
  const kpiCards = [
    {
      title: 'Total Sales',
      value: formatCurrency(overview?.totalSales),
      change: '+19.8%',
      positive: true
    },
    {
      title: 'Transactions',
      value: formatNumber(overview?.totalTransactions),
      change: '+12.5%',
      positive: true
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(overview?.avgOrderValue),
      change: '+5.7%',
      positive: true
    },
    {
      title: 'Total Quantity',
      value: formatNumber(overview?.totalQuantity),
      change: '+8.3%',
      positive: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">{card.title}</p>
            {loading ? (
              <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <span className={`text-sm font-medium ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySalesChart data={categorySales} loading={loading} />
        <SalesTrendsChart data={salesTrends} loading={loading} />
      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart data={topProducts} loading={loading} />
        <BrandSalesChart data={brandSales} loading={loading} />
      </div>

      {/* Charts Grid - Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegionSalesChart data={regionSales} loading={loading} />
        <PaymentMethodsChart data={paymentMethods} loading={loading} />
      </div>
    </div>
  );
};

export default DashboardView;
