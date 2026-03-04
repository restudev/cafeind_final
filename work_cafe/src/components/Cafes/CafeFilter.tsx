import { useState, useEffect } from 'react';
import { Search, Filter, X, Wifi, Zap, Users, Wind, Coffee, Utensils, Palmtree, Printer, Clock } from 'lucide-react';

// Define necessary types
interface Cafe {
  id: string;
  name: string;
  location: string;
  area: string;
  rating: number;
  priceRange: number;
  openingHours?: {
    Weekdays: string;
    Weekends: string;
  };
  amenities: string[];
}

interface CafeFilterType {
  search: string;
  area: string;
  minRating: number;
  priceRange: number[];
  amenities: string[];
  openNow: boolean;
}

interface ButtonProps {
  variant: 'primary' | 'outline' | 'default';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

// Assuming Button component exists in the project
const Button = ({ variant, size, onClick, className, children, ...props }: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm';
      case 'outline':
        return 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-1.5 px-3 text-sm';
      case 'lg':
        return 'py-3 px-6 text-lg';
      default:
        return 'py-2 px-4 text-base';
    }
  };

  return (
    <button
      className={`rounded-lg font-medium transition-all flex items-center justify-center ${getVariantClasses()} ${getSizeClasses()} ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

interface CafeFilterProps {
  filter: CafeFilterType;
  setFilter: React.Dispatch<React.SetStateAction<CafeFilterType>>;
  applyFilters: () => void;
  resetFilters: () => void;
  allCafes: Cafe[];
}

const CafeFilter = ({
  filter,
  setFilter,
  applyFilters,
  resetFilters,
  allCafes,
}: CafeFilterProps) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [areas, setAreas] = useState<string[]>(['All Areas']);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [isFilterChanged, setIsFilterChanged] = useState<boolean>(false);

  useEffect(() => {
    const fetchFilterMetadata = async () => {
      try {
        console.log("Fetching filter metadata...");
        const response = await fetch('https://cafeind.my.id/cafeind_api/api/get_cafes.php');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log("Metadata response:", result.metadata);

        if (result.success) {
          setAreas(result.metadata.areas || ['All Areas']);
          setAmenities(result.metadata.amenities || []);
        } else {
          setMetadataError(result.message || 'Failed to fetch metadata');
          console.log("Error from API:", result.message);
        }
      } catch (err) {
        setMetadataError(`Error fetching metadata: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Metadata fetch error:', err);
      }
    };

    fetchFilterMetadata();
  }, []);

  // Monitor filter changes to enable/disable Apply button
  useEffect(() => {
    setIsFilterChanged(true);
  }, [filter]);

  const isCafeOpen = (cafe: Cafe): boolean => {
    const now = new Date("2025-05-19T07:34:00+07:00"); // Current time: 07:34 AM WIB
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;

    const isWeekend = day === 0 || day === 6;
    const hoursKey = isWeekend ? "Weekends" : "Weekdays";
    const openingHours = cafe.openingHours || { Weekdays: "", Weekends: "" };

    if (openingHours[hoursKey] === "24 Hour") {
      return true;
    }

    const [opening, closing] = (openingHours[hoursKey] || "").split(" - ");
    if (!opening || !closing) return false;

    const parseTime = (time: string): number => {
      const [hourStr, period] = time.split(" ");
      const [hours, minutes] = hourStr.split(":").map(Number);
      const isPM = period.includes("PM");
      let adjustedHours = hours;
      if (isPM && hours !== 12) adjustedHours += 12;
      if (!isPM && hours === 12) adjustedHours = 0;
      return adjustedHours * 60 + (minutes || 0);
    };

    const openingTime = parseTime(opening);
    let closingTime = parseTime(closing);

    if (closingTime <= openingTime) {
      closingTime += 24 * 60; // Handle midnight crossover
    }

    return (
      currentTimeInMinutes >= openingTime && currentTimeInMinutes <= closingTime
    );
  };

  const openCafesCount = allCafes.filter(isCafeOpen).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      applyFilters();
      setIsFilterChanged(false); // Reset filter changed state after applying
    }
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFilter({ ...filter, area: e.target.value });
  };

  const handleRatingChange = (value: number): void => {
    setFilter({ ...filter, minRating: value });
  };

  const handlePriceRangeChange = (value: number): void => {
    const newPriceRange = [...filter.priceRange];
    const index = newPriceRange.indexOf(value);
    if (index === -1) {
      newPriceRange.push(value);
    } else {
      newPriceRange.splice(index, 1);
    }
    setFilter({ ...filter, priceRange: newPriceRange });
  };

  const handleAmenityChange = (amenity: string): void => {
    const newAmenities = [...filter.amenities];
    const index = newAmenities.indexOf(amenity);
    if (index === -1) {
      newAmenities.push(amenity);
    } else {
      newAmenities.splice(index, 1);
    }
    setFilter({ ...filter, amenities: newAmenities });
  };

  const handleOpenNowChange = (): void => {
    setFilter((prev: CafeFilterType) => {
      const newFilter = { ...prev, openNow: !prev.openNow };
      return newFilter;
    });
  };

  const handleApplyFilters = () => {
    applyFilters();
    setIsFilterChanged(false);
  };

  const handleResetFilters = () => {
    resetFilters();
    setIsFilterChanged(false);
  };

  const getAmenityIcon = (amenity: string): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
      'High-Speed WiFi': <Wifi className="w-4 h-4" />,
      'Power Outlets': <Zap className="w-4 h-4" />,
      'Prayer Room': <Users className="w-4 h-4" />,
      'Meeting Room': <Users className="w-4 h-4" />,
      'Air Conditioning': <Wind className="w-4 h-4" />,
      'Coffee': <Coffee className="w-4 h-4" />,
      'Snacks': <Utensils className="w-4 h-4" />,
      'Outdoor Seating': <Palmtree className="w-4 h-4" />,
      'Printing Services': <Printer className="w-4 h-4" />
    };
    return icons[amenity] || <Coffee className="w-4 h-4" />;
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 w-full border border-gray-100 transition-all duration-300">
      <div className="p-5">
        <div className="flex items-center flex-col sm:flex-row gap-3">
          <div className="relative flex-grow w-full sm:w-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Search cafes by name or location..."
              value={filter.search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search cafes"
            />
          </div>
          <button
            onClick={toggleFilters}
            className={`flex items-center px-5 py-3 rounded-xl hover:bg-opacity-90 transition-all duration-200 w-full sm:w-auto justify-center ${
              showFilters 
              ? 'bg-blue-600 text-white shadow-md hover:shadow-lg' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            aria-expanded={showFilters}
            aria-controls="filter-options"
          >
            <Filter size={18} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div 
            id="filter-options" 
            className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn"
          >
            {metadataError ? (
              <div className="text-center p-4 bg-red-50 rounded-xl text-red-600 flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{metadataError}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Area Selection */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <div className="relative">
                      <select
                        className="block w-full p-3 pl-4 pr-10 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                        value={filter.area}
                        onChange={handleAreaChange}
                        aria-label="Select area"
                      >
                        {areas.map((area) => (
                          <option key={area} value={area === 'All Areas' ? '' : area}>
                            {area}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={`rating-${value}`}
                          className={`flex-1 py-2 rounded-lg transition-all ${
                            filter.minRating >= value 
                              ? 'bg-yellow-500 text-white font-medium shadow-md' 
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleRatingChange(value)}
                          aria-pressed={filter.minRating >= value}
                          aria-label={`Minimum rating ${value} stars`}
                        >
                          {/* Star icon + number */}
                          <div className="flex items-center justify-center">
                            <span>{value}</span>
                            <svg className="w-4 h-4 ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((value) => (
                        <button
                          key={`price-${value}`}
                          className={`flex-1 py-2 rounded-lg transition-all ${
                            filter.priceRange.includes(value) 
                              ? 'bg-purple-600 text-white font-medium shadow-md' 
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handlePriceRangeChange(value)}
                          aria-pressed={filter.priceRange.includes(value)}
                          aria-label={`Price range ${value} dollars`}
                        >
                          {'$'.repeat(value)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Open Now Toggle */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                        filter.openNow 
                          ? 'bg-green-600 text-white shadow-md font-medium' 
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={handleOpenNowChange}
                      aria-pressed={filter.openNow}
                      aria-label="Toggle show only cafes open now"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Open Now</span>
                    </button>
                    <span className="text-sm bg-white text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                      {openCafesCount} {openCafesCount === 1 ? 'cafe' : 'cafes'} open now
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  {amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((amenity) => (
                        <button
                          key={amenity}
                          className={`px-3 py-2 rounded-full flex items-center gap-2 text-sm transition-all ${
                            filter.amenities.includes(amenity) 
                              ? 'bg-amber-500 text-white shadow-md font-medium' 
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleAmenityChange(amenity)}
                          aria-pressed={filter.amenities.includes(amenity)}
                          aria-label={`Toggle ${amenity} amenity`}
                        >
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-100 text-gray-500">
                      No amenities available.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="flex items-center gap-1"
                aria-label="Reset all filters"
              >
                <X size={16} />
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyFilters}
                className={`transition-all ${isFilterChanged ? 'opacity-100' : 'opacity-75'}`}
                disabled={!isFilterChanged}
                aria-label="Apply filters"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeFilter;