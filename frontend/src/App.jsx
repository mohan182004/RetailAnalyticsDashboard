import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsRow from './components/StatsRow';
import FilterPanel from './components/FilterPanel';
import TransactionTable from './components/TransactionTable';
import DashboardView from './components/DashboardView';
import { getTransactions, getOverview, getFilters } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('Services'); // 'Dashboard' or 'Services'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [overview, setOverview] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    categories: []
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0
  });

  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
    tags: [],
    ageRange: {},
    dateRange: {},
    search: '',
    sort: 'customerName',
    page: 1,
    limit: 10
  });

  // Fetch filter options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await getFilters();
        setFilterOptions(options);
      } catch (err) {
        console.error('Error fetching options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (currentView === 'Services') {
      setLoading(true);
      try {
        const [txData, overviewData] = await Promise.all([
          getTransactions(filters),
          getOverview(filters)
        ]);
        
        setTransactions(txData.transactions);
        setPagination({
          currentPage: txData.currentPage,
          totalPages: txData.totalPages,
          totalTransactions: txData.totalTransactions
        });
        setOverview(overviewData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Dashboard view fetches its own data
      setLoading(false);
    }
  }, [filters, currentView]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleNavChange = (navItem) => {
    setCurrentView(navItem);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        onNavChange={handleNavChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarCollapsed ? '4rem' : '14rem' }}
      >
        <Header onSearch={handleSearch} />

        <main className="flex-1 p-3">
          {currentView === 'Dashboard' ? (
            <DashboardView filters={filters} />
          ) : (
            <div className="flex flex-col h-full space-y-3">
              {/* Filters */}
              <FilterPanel 
                filters={filters} 
                filterOptions={filterOptions} 
                onFilterChange={handleFilterChange} 
              />

              {/* KPI Stats */}
              <StatsRow overview={overview} />

              {/* Data Table - Full Width */}
              <div className="flex-1 min-h-0">
                <TransactionTable 
                  transactions={transactions}
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
