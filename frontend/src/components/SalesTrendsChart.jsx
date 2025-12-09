import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const SalesTrendsChart = ({ data, loading }) => {
  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-emerald-600">
            Sales: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            Transactions: {payload[0].payload.count.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Trends</h3>
          <p className="text-sm text-gray-500">Monthly sales performance over time</p>
        </div>
        <div className="p-2 rounded-lg bg-emerald-100">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={formatCurrency}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalSales"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesTrendsChart;
