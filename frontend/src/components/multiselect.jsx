import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

const MultiSelectFilter = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleRemove = (value) => {
    const newValues = selectedValues.filter(v => v !== value);
    onChange(newValues);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full min-h-[44px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {selectedValues.length === 0 ? (
                <span className="text-gray-500 dark:text-gray-400">Alle auswählen</span>
              ) : (
                selectedValues.slice(0, 2).map((value) => (
                  <span
              key={value} 
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(value);
                      }}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
              {selectedValues.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                  +{selectedValues.length - 2} mehr
                </span>
              )}
            </div>
            <FiChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <input
                type="text"
                placeholder="Suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {selectedValues.length > 0 && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Alle löschen
                </button>
              </div>
            )}
            
            <div className="max-h-40 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Keine Ergebnisse gefunden
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer min-h-[44px]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={() => handleToggle(option)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                      {option}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MultiSelectFilter);
