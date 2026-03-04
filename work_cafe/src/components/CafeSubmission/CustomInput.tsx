import React, { useState, KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';

interface CustomInputProps {
  label: string;
  items: string[];
  defaultItems: string[];
  onItemsChange: (items: string[]) => void;
  placeholder: string;
  colorScheme: 'blue' | 'amber' | 'green' | 'purple';
  maxItems?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  items,
  defaultItems,
  onItemsChange,
  placeholder,
  colorScheme,
  maxItems = 20
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const colorClasses = {
    blue: {
      selected: 'bg-blue-50 border-blue-300 text-blue-700',
      hover: 'hover:bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      input: 'focus:ring-blue-500 focus:border-blue-500',
      checkbox: 'text-blue-600 focus:ring-blue-500'
    },
    amber: {
      selected: 'bg-amber-50 border-amber-300 text-amber-700',
      hover: 'hover:bg-amber-50',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      input: 'focus:ring-amber-500 focus:border-amber-500',
      checkbox: 'text-amber-600 focus:ring-amber-500'
    },
    green: {
      selected: 'bg-green-50 border-green-300 text-green-700',
      hover: 'hover:bg-green-50',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      input: 'focus:ring-green-500 focus:border-green-500',
      checkbox: 'text-green-600 focus:ring-green-500'
    },
    purple: {
      selected: 'bg-purple-50 border-purple-300 text-purple-700',
      hover: 'hover:bg-purple-50',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      input: 'focus:ring-purple-500 focus:border-purple-500',
      checkbox: 'text-purple-600 focus:ring-purple-500'
    }
  };

  const colors = colorClasses[colorScheme];

  const handleItemToggle = (item: string) => {
    const updatedItems = items.includes(item)
      ? items.filter(i => i !== item)
      : [...items, item];
    onItemsChange(updatedItems);
  };

  const handleCustomAdd = () => {
    const trimmedInput = customInput.trim();
    if (trimmedInput && !items.includes(trimmedInput) && items.length < maxItems) {
      onItemsChange([...items, trimmedInput]);
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomAdd();
    } else if (e.key === 'Escape') {
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  const removeCustomItem = (item: string) => {
    onItemsChange(items.filter(i => i !== item));
  };

  const customItems = items.filter(item => !defaultItems.includes(item));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-xs text-gray-500">
          {items.length}/{maxItems} selected
        </span>
      </div>

      {/* Default Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {defaultItems.map((item) => (
          <label
            key={item}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
              items.includes(item)
                ? colors.selected
                : `border-gray-200 ${colors.hover}`
            }`}
          >
            <input
              type="checkbox"
              checked={items.includes(item)}
              onChange={() => handleItemToggle(item)}
              className={`h-4 w-4 ${colors.checkbox} border-gray-300 rounded`}
            />
            <span className="ml-2 text-sm font-medium">{item}</span>
          </label>
        ))}
      </div>

      {/* Custom Items */}
      {customItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Custom {label}</h4>
          <div className="flex flex-wrap gap-2">
            {customItems.map((item) => (
              <div
                key={item}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${colors.selected}`}
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeCustomItem(item)}
                  className="ml-2 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Item */}
      <div className="space-y-2">
        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            disabled={items.length >= maxItems}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              items.length >= maxItems
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : `${colors.button} shadow-sm`
            }`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Custom {label.slice(0, -1)}
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg ${colors.input} transition-colors`}
              maxLength={50}
              autoFocus
            />
            <button
              type="button"
              onClick={handleCustomAdd}
              disabled={!customInput.trim() || items.includes(customInput.trim())}
              className={`px-4 py-2 ${colors.button} rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomInput('');
                setShowCustomInput(false);
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        {showCustomInput && (
          <p className="text-xs text-gray-500">
            Press Enter to add, Escape to cancel
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomInput;