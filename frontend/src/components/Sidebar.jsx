import { useState } from 'react';

const Sidebar = ({ onNavChange, isCollapsed, onToggleCollapse }) => {
  const [activeItem, setActiveItem] = useState('Services');

  const menuItems = [
    { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: 'Intake', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { 
      name: 'Services', 
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      subItems: ['Pre-active', 'Active', 'Blocked', 'Closed']
    },
    { 
      name: 'Invoices', 
      icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z',
      subItems: ['Proforma Invoices', 'Final Invoices']
    },
  ];

  const handleMenuClick = (itemName) => {
    setActiveItem(itemName);
    if (onNavChange) {
      onNavChange(itemName);
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-20 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}>
      {/* Brand */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
              V
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Vault</h1>
              <p className="text-xs text-gray-500">Anurag Yadav</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto">
            V
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
      >
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <div key={item.name}>
            <button
              onClick={() => handleMenuClick(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeItem === item.name 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {!isCollapsed && (
                <>
                  <span>{item.name}</span>
                  {item.subItems && (
                    <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </>
              )}
            </button>
            
            {/* Subitems */}
            {item.subItems && activeItem === item.name && !isCollapsed && (
              <div className="ml-11 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem}
                    className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                  >
                    {subItem}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
