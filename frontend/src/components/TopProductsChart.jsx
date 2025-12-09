import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopProductsChart = ({ data, loading }) => {
  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const chartData = data?.map(item => ({
    name: item._id,
    sales: item.totalSales,
    quantity: item.totalQuantity
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          <p className="text-sm text-blue-600">
            Sales: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            Quantity: {payload[0].payload.quantity.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
          <p className="text-sm text-gray-400">Best performers by sales value</p>
        </div>
        <div className="p-2 rounded-lg bg-blue-500/20">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <defs>
              <linearGradient id="productGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
            <XAxis 
              type="number"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={formatCurrency}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              width={120}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="sales" 
              fill="url(#productGradient)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopProductsChart;
