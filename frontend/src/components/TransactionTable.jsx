const TransactionTable = ({ transactions, currentPage, totalPages, onPageChange, loading }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="spinner mx-auto mb-4 border-gray-300 border-t-gray-900"></div>
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full h-full flex flex-col">
      
      <div className="overflow-x-auto w-full flex-1">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Customer Region</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Product Category</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
              <th className="px-6 py-5 text-sm font-medium text-gray-500 uppercase tracking-wider text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 text-base text-gray-500 font-mono">{tx.transactionId}</td>
                <td className="px-6 py-5 text-base text-gray-500">{formatDate(tx.date)}</td>
                <td className="px-6 py-5 text-base text-gray-500 font-mono">{tx.customerId}</td>
                <td className="px-6 py-5 text-base font-medium text-gray-900">{tx.customerName}</td>
                <td className="px-6 py-5 text-base text-gray-500">{tx.phoneNumber}</td>
                <td className="px-6 py-5 text-base text-gray-500">{tx.customerRegion}</td>
                <td className="px-6 py-5 text-base text-gray-500">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${
                    tx.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {tx.gender === 'Female' ? '♀' : '♂'} {tx.gender}
                  </span>
                </td>
                <td className="px-6 py-5 text-base text-gray-500">{tx.age}</td>
                <td className="px-6 py-5 text-base text-gray-500 font-mono">{tx.productId}</td>
                <td className="px-6 py-5 text-base text-gray-500">{tx.productCategory}</td>
                <td className="px-6 py-5 text-base text-gray-500 text-center">{String(tx.quantity).padStart(2, '0')}</td>
                <td className="px-6 py-5 text-base text-gray-500">{tx.employeeName || 'N/A'}</td>
                <td className="px-6 py-5 text-base font-medium text-gray-900 text-right">{formatCurrency(tx.finalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === pageNum
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
