import React, { ChangeEvent } from "react";
import { DollarSign, Volume2, Clock, Tag, Plus, X } from "lucide-react";
import { Cafe, allAmenities, noiseOptions, visitLengthOptions } from "../../../types/cafe";

interface DetailsTabProps {
  cafeData: Cafe;
  newAmenity: string;
  newTag: string;
  setNewAmenity: (value: string) => void;
  setNewTag: (value: string) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePriceChange: (price: 1 | 2 | 3) => void;
  handleOpeningHoursChange: (field: "Weekdays" | "Weekends", value: string) => void;
  toggleAmenity: (amenity: string) => void;
  addAmenity: () => void;
  removeAmenity: (amenity: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  cafeData,
  newAmenity,
  newTag,
  setNewAmenity,
  setNewTag,
  handleChange,
  handlePriceChange,
  handleOpeningHoursChange,
  toggleAmenity,
  addAmenity,
  removeAmenity,
  addTag,
  removeTag,
}) => {
  // Ensure we have valid values from database or fallback to first option
  const currentPriceRange = cafeData.priceRange || 1;
  const currentNoiseLevel = cafeData.noiseLevel || noiseOptions[0];
  const currentAvgVisitLength = cafeData.avgVisitLength || visitLengthOptions[0];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Price Range
          </label>
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => handlePriceChange(price as 1 | 2 | 3)}
                className={`flex items-center justify-center w-16 h-16 rounded-xl border-2 transition-all ${
                  currentPriceRange === price
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-lg"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                }`}
              >
                {Array.from({ length: price }).map((_, i) => (
                  <DollarSign key={i} size={16} className="-mx-0.5" />
                ))}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            $ = Budget, $$ = Moderate, $$$ = Expensive
          </p>
        </div>

        <div>
          <label htmlFor="noiseLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Noise Level
          </label>
          <div className="relative">
            <Volume2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="noiseLevel"
              name="noiseLevel"
              value={currentNoiseLevel}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {noiseOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="avgVisitLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Average Visit Length
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="avgVisitLength"
              name="avgVisitLength"
              value={currentAvgVisitLength}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {visitLengthOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Opening Hours</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="openingHoursWeekdays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weekdays
            </label>
            <input
              type="text"
              id="openingHoursWeekdays"
              value={cafeData.openingHours?.Weekdays || ""}
              onChange={(e) => handleOpeningHoursChange("Weekdays", e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 9:00 AM - 10:00 PM"
            />
          </div>
          <div>
            <label htmlFor="openingHoursWeekends" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weekends
            </label>
            <input
              type="text"
              id="openingHoursWeekends"
              value={cafeData.openingHours?.Weekends || ""}
              onChange={(e) => handleOpeningHoursChange("Weekends", e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 10:00 AM - 8:00 PM"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Amenities</h3>
        
        {/* Selected amenities display */}
        {cafeData.amenities && cafeData.amenities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {cafeData.amenities.map((amenity, index) => {
                const isStandard = allAmenities.includes(amenity);
                return (
                  <div
                    key={`${amenity}-${index}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      isStandard 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeAmenity(amenity);
                      }}
                      className={`ml-2 h-4 w-4 rounded-full flex items-center justify-center transition-colors ${
                        isStandard
                          ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-700'
                          : 'text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-700'
                      }`}
                      title={`Remove ${amenity}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available standard amenities */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available Standard Amenities</h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {allAmenities
              .filter(amenity => !cafeData.amenities?.includes(amenity))
              .map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleAmenity(amenity);
                  }}
                  className="flex items-center text-left p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-700 dark:text-white">{amenity}</span>
                </button>
              ))}
            {allAmenities.filter(amenity => !cafeData.amenities?.includes(amenity)).length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">All standard amenities have been added.</p>
            )}
          </div>
        </div>

        {/* Add custom amenity */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Add custom amenity..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newAmenity.trim()) {
                e.preventDefault();
                addAmenity();
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addAmenity();
            }}
            disabled={!newAmenity.trim()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tags</h3>
        {cafeData.tags && cafeData.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {cafeData.tags.map((tag, index) => (
              <div
                key={`${tag}-${index}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="ml-2 h-4 w-4 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-700 flex items-center justify-center transition-colors"
                  title={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">No tags added yet.</p>
        )}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag (e.g., Quiet, Cozy)"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newTag.trim()) {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addTag();
            }}
            disabled={!newTag.trim()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;