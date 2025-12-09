import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const PaymentMethodsChart = ({ data, loading }) => {
  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const chartData = data?.map((item, index) => ({
    name: item._id,
    count: item.count,
    sales: item.totalSales,
    color: COLORS[index % COLORS.length]
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-purple-600">
            Orders: {payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Sales: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(payload[0].payload.sales)}
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
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <p className="text-sm text-gray-400">Distribution by payment type</p>
        </div>
        <div className="p-2 rounded-lg bg-purple-500/20">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PaymentMethodsChart;
