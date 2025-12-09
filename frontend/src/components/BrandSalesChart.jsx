import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const BrandSalesChart = ({ data, loading }) => {
  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const chartData = data?.map((item, index) => ({
    name: item._id,
    sales: item.totalSales,
    count: item.count,
    fill: COLORS[index % COLORS.length]
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-cyan-600">
            Sales: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            Orders: {payload[0].payload.count.toLocaleString()}
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
          <h3 className="text-lg font-semibold text-gray-900">Brand-wise Sales</h3>
          <p className="text-sm text-gray-400">Sales performance by brand</p>
        </div>
        <div className="p-2 rounded-lg bg-cyan-500/20">
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={formatCurrency}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="sales" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Bar key={`bar-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BrandSalesChart;
