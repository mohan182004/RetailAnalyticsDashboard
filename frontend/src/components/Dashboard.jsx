import { useState, useEffect, useCallback } from 'react';
import OverviewCards from './OverviewCards';
import FilterPanel from './FilterPanel';
import CategorySalesChart from './CategorySalesChart';
import SalesTrendsChart from './SalesTrendsChart';
import TopProductsChart from './TopProductsChart';
import BrandSalesChart from './BrandSalesChart';
import RegionSalesChart from './RegionSalesChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import {
  getOverview,
  getCategorySales,
  getSalesTrends,
  getTopProducts,
  getBrandSales,
  getRegionSales,
  getPaymentMethods,
  getFilters
} from '../services/api';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    brand: '',
    category: '',
    region: '',
    status: ''
  });
  
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    regions: [],
    statuses: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [overview, setOverview] = useState(null);
  const [categorySales, setCategorySales] = useState([]);
  const [salesTrends, setSalesTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [brandSales, setBrandSales] = useState([]);
  const [regionSales, setRegionSales] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await getFilters();
        setFilterOptions(options);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
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
      setError('Failed to load dashboard data. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      brand: '',
      category: '',
      region: '',
      status: ''
    });
  };

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Connection Error</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Overview Cards */}
      <OverviewCards data={overview} loading={loading} />

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

export default Dashboard;
