const Header = ({ onSearch }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between w-full">
      <h2 className="text-xl font-semibold text-gray-800">Sales Management System</h2>
      
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Name, Phone no."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
        />
      </div>
    </header>
  );
};

export default Header;
