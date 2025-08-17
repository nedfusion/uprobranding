import React from 'react';
import { X } from 'lucide-react';
import { SERVICE_CATEGORIES, ServiceCategory } from '../types';

interface ServiceCategorySelectorProps {
  selectedCategories: ServiceCategory[];
  onCategoryChange: (category: ServiceCategory) => void;
  required?: boolean;
  className?: string;
}

export function ServiceCategorySelector({
  selectedCategories,
  onCategoryChange,
  required = false,
  className = ''
}: ServiceCategorySelectorProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Service Categories {required && <span className="text-red-500">*</span>}
      </label>
      <p className="text-sm text-gray-600 mb-4">
        Select all services you can provide (you can choose multiple)
      </p>
      
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
        {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
          <label 
            key={key} 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(key as ServiceCategory)}
              onChange={() => onCategoryChange(key as ServiceCategory)}
              className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 select-none">{value}</span>
          </label>
        ))}
      </div>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Selected categories:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(category => (
              <span
                key={category}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-forest-100 text-forest-800"
              >
                {SERVICE_CATEGORIES[category]}
                <button
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-forest-400 hover:bg-forest-200 hover:text-forest-600 transition-colors"
                  aria-label={`Remove ${SERVICE_CATEGORIES[category]}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {required && selectedCategories.length === 0 && (
        <p className="mt-2 text-sm text-red-600">
          Please select at least one service category
        </p>
      )}
    </div>
  );
}