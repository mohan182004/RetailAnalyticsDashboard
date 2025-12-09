import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const CategorySalesChart = ({ data, loading }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const chartData = data?.map((item, index) => ({
    name: item._id,
    value: item.totalSales,
    count: item.count,
    color: COLORS[index % COLORS.length]
  })) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-purple-600">Sales: {formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-600">Orders: {data.count.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Category-wise Sales</h3>
          <p className="text-sm text-gray-500">Sales distribution by product category</p>
        </div>
        <div className="p-2 rounded-lg bg-purple-100">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="spinner border-gray-300 border-t-gray-900"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value) => <span className="text-gray-700 text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategorySalesChart;
