import { useState, useRef, useEffect } from 'react';

const FilterPanel = ({ filters, filterOptions, onFilterChange }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleMultiSelectChange = (field, value) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ [field]: newValues });
  };

  const handleRangeChange = (field, rangeType, value) => {
    const currentRange = filters[field] || {};
    onFilterChange({ [field]: { ...currentRange, [rangeType]: value } });
  };

  const clearFilter = (field) => {
    if (Array.isArray(filters[field])) {
      onFilterChange({ [field]: [] });
    } else if (typeof filters[field] === 'object') {
      onFilterChange({ [field]: {} });
    } else {
      onFilterChange({ [field]: '' });
    }
  };

  // Multi-Select Dropdown Component
  const MultiSelectDropdown = ({ label, field, options }) => {
    const selectedValues = filters[field] || [];
    const isOpen = openDropdown === field;

    return (
      <div className="relative" ref={isOpen ? dropdownRef : null}>
        <button
          onClick={() => setOpenDropdown(isOpen ? null : field)}
          className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors min-w-[160px] text-left"
        >
          {selectedValues.length === 0 ? label : `${label} (${selectedValues.length})`}
          <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options?.map((option) => (
              <label
                key={option}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleMultiSelectChange(field, option)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
            {selectedValues.length > 0 && (
              <button
                onClick={() => clearFilter(field)}
                className="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border-t border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Number Range Component 
  const NumberRange = ({ label, field, min, max, step = 1 }) => {
    const range = filters[field] || {};
    return (
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-sm text-gray-600 whitespace-nowrap">{label}:</span>
        <input
          type="number"
          placeholder="Min"
          value={range.min || ''}
          onChange={(e) => handleRangeChange(field, 'min', e.target.value)}
          min={min}
          max={max}
          step={step}
          className="w-16 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          placeholder="Max"
          value={range.max || ''}
          onChange={(e) => handleRangeChange(field, 'max', e.target.value)}
          min={min}
          max={max}
          step={step}
          className="w-16 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        {(range.min || range.max) && (
          <button
            onClick={() => clearFilter(field)}
            className="ml-1 text-gray-400 hover:text-gray-600"
            title="Clear"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  // Date Range Component
  const DateRange = ({ label, field }) => {
    const range = filters[field] || {};
    return (
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
        <span className="text-sm text-gray-600 whitespace-nowrap">{label}:</span>
        <input
          type="date"
          value={range.start || ''}
          onChange={(e) => handleRangeChange(field, 'start', e.target.value)}
          className="px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <span className="text-gray-400">-</span>
        <input
          type="date"
          value={range.end || ''}
          onChange={(e) => handleRangeChange(field, 'end', e.target.value)}
          className="px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        {(range.start || range.end) && (
          <button
            onClick={() => clearFilter(field)}
            className="ml-1 text-gray-400 hover:text-gray-600"
            title="Clear"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 mb-3">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        
        <MultiSelectDropdown
          label="Customer Region"
          field="regions"
          options={filterOptions.regions}
        />
        
        <MultiSelectDropdown
          label="Gender"
          field="genders"
          options={['Male', 'Female']}
        />
        
        <MultiSelectDropdown
          label="Product Category"
          field="categories"
          options={filterOptions.categories}
        />
        
        <MultiSelectDropdown
          label="Payment Method"
          field="paymentMethods"
          options={['UPI', 'Credit Card', 'Debit Card', 'Cash']}
        />
        
        <MultiSelectDropdown
          label="Tags"
          field="tags"
          options={filterOptions.tags || []}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <NumberRange label="Age" field="ageRange" min={18} max={100} />
        <DateRange label="Date" field="dateRange" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {(() => {
            const activeFilters = Object.values(filters).filter(v => 
              (Array.isArray(v) && v.length > 0) || 
              (typeof v === 'object' && Object.keys(v).length > 0) ||
              (typeof v === 'string' && v !== '')
            ).length;
            return activeFilters > 0 ? `${activeFilters} filter(s) active` : 'No filters applied';
          })()}
        </div>
        
        <select
          value={filters.sort || 'customerName'}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="appearance-none bg-transparent text-gray-600 text-sm font-medium focus:outline-none cursor-pointer pr-6 relative"
        >
          <option value="customerName">Sort by: Customer Name (A-Z)</option>
          <option value="date">Sort by: Date</option>
          <option value="finalAmount">Sort by: Amount</option>
        </select>
        <svg className="w-4 h-4 text-gray-400 -ml-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default FilterPanel;
