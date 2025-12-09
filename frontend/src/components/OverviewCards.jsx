const OverviewCards = ({ data, loading }) => {
  const formatCurrency = (value) => {
    if (!value) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('en-IN').format(Math.round(value));
  };

  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(data?.totalSales),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/20 to-teal-600/20'
    },
    {
      title: 'Transactions',
      value: formatNumber(data?.totalTransactions),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-500/20 to-indigo-600/20'
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(data?.avgOrderValue),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/20 to-pink-600/20'
    },
    {
      title: 'Total Quantity',
      value: formatNumber(data?.totalQuantity),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/20 to-red-600/20'
    },
    {
      title: 'Avg Discount',
      value: `${formatNumber(data?.avgDiscount)}%`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/20 to-blue-600/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="stat-card group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} rounded-2xl`}></div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                {card.icon}
              </div>
            </div>
            
            {loading ? (
              <div className="space-y-2">
                <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse"></div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
                  {card.value}
                </h3>
                <p className="text-sm text-gray-400">{card.title}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
