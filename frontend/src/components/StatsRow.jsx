const StatsRow = ({ overview }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-3">
      {/* Total Units Sold */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-1">Total units sold</p>
        <h3 className="text-2xl font-bold text-gray-900">{overview?.totalQuantity?.toLocaleString() || 0}</h3>
      </div>

      {/* Total Amount */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-1">Total Amount</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(overview?.totalSales)}</h3>
          <span className="text-sm text-gray-500 font-medium">(19.8%)</span>
        </div>
      </div>

      {/* Total Discount */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm text-gray-500 font-medium mb-1">Total Discount</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-gray-900">{overview?.avgDiscount?.toFixed(1)}%</h3>
          <span className="text-sm text-gray-500 font-medium">(Avg)</span>
        </div>
      </div>
    </div>
  );
};

export default StatsRow;
