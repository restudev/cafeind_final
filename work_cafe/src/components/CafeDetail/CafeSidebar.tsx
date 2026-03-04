import React, { useState, useEffect } from "react";
import { Users, Clock, Globe, Map, Instagram, Tag } from "lucide-react";
import Button from "../../components/common/Button";
import { Promo } from "../../types/cafe";

const priceRangeStyles = {
  1: {
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    icon: "💵",
  },
  2: {
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    icon: "💰",
  },
  3: {
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    icon: "💎",
  },
  default: {
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    icon: "$",
  },
};

// Utility function untuk format tanggal yang konsisten
const formatValidUntilDate = (dateString: string | null): string => {
  if (!dateString) return "Not set";
  
  const date = parseDate(dateString);
  
  if (!date || isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Utility function untuk parsing berbagai format tanggal
const parseDate = (dateString: string | null): Date | null => {
  if (!dateString) return null;

  try {
    // Handle ISO format (YYYY-MM-DDTHH:MM:SS)
    if (dateString.includes('T')) {
      return new Date(dateString);
    }
    
    // Handle YYYY-MM-DD format
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(dateString + 'T23:59:59');
    }
    
    // Handle DD/MM/YYYY format
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day, 23, 59, 59);
    }
    
    // Handle MM/DD/YYYY format
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const parts = dateString.split('/').map(Number);
      // Assume MM/DD/YYYY if first part <= 12
      if (parts[0] <= 12) {
        return new Date(parts[2], parts[0] - 1, parts[1], 23, 59, 59);
      }
    }
    
    // Fallback: try native Date parsing
    const fallbackDate = new Date(dateString);
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate;
    }
    
    return null;
  } catch {
    return null;
  }
};

// Utility function untuk menghitung countdown
const calculateTimeLeft = (endDate: string | null): { days: number; hours: number; minutes: number; seconds: number } => {
  const targetDate = parseDate(endDate);
  
  if (!targetDate || isNaN(targetDate.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

// Interface untuk PriceRangeCard
interface PriceRangeProps {
  priceRange: number;
}

// Komponen PriceRangeCard
const PriceRangeCard: React.FC<PriceRangeProps> = ({ priceRange }) => {
  const validPriceRange = [1, 2, 3].includes(priceRange) ? priceRange : 1;
  const { bgColor, textColor, icon } =
    priceRangeStyles[validPriceRange as 1 | 2 | 3] || priceRangeStyles.default;

  return (
    <div className={`rounded-xl p-4 ${bgColor}`}>
      <h3 className={`font-medium mb-2 flex items-center ${textColor}`}>
        <span className="mr-2" aria-label={`Price range ${validPriceRange}`}>
          {icon}
        </span>
        Price Range
      </h3>
      <div className={`text-xl font-bold ${textColor}`}>
        {"$".repeat(validPriceRange)}
      </div>
    </div>
  );
};

// Interface untuk CafeSidebar
interface CafeSidebarProps {
  priceRange: number;
  noiseLevel: "Quiet" | "Moderate" | "Loud";
  avgVisitLength: string;
  openingHours: { Weekdays: string; Weekends: string };
  website: string | null;
  linkMaps: string | null;
  instagram: string | null;
  promos: Promo[];
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

// Komponen CafeSidebar
const CafeSidebar: React.FC<CafeSidebarProps> = ({
  priceRange,
  noiseLevel,
  avgVisitLength,
  openingHours,
  website,
  linkMaps,
  instagram,
  promos,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Update countdown setiap detik
  useEffect(() => {
    if (promos.length === 0 || !promos[0].valid_until) return;

    const updateCountdown = () => {
      const newTimeLeft = calculateTimeLeft(promos[0].valid_until);
      setTimeLeft(newTimeLeft);
    };

    // Update immediately
    updateCountdown();

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [promos]);

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <PriceRangeCard priceRange={priceRange} />

            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                <Users size={16} className="mr-2" />
                Noise Level
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  noiseLevel === "Quiet"
                    ? "bg-green-100 text-green-800"
                    : noiseLevel === "Moderate"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {noiseLevel}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Clock size={18} className="mr-2 text-blue-600" />
              Hours & Visit Length
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="flex justify-between mb-2">
                Average visit: <span className="font-medium">{avgVisitLength}</span>
              </p>
              <ul className="space-y-2">
                {Object.entries(openingHours).map(([days, hours], index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-600">{days}</span>
                    <span className="text-gray-800 font-medium">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mb-4"
              >
                <Button variant="primary" className="w-full justify-center">
                  <Globe size={18} className="mr-2" />
                  Website
                </Button>
              </a>
            )}
            <div className="flex space-x-2">
              <a
                href={linkMaps ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center"
              >
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  disabled={!linkMaps}
                >
                  <Map size={18} className="mr-2" />
                  Map
                </Button>
              </a>
              <a
                href={instagram ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center"
              >
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  disabled={!instagram}
                >
                  <Instagram size={18} className="mr-2" />
                  Instagram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {promos.length > 0 && (
        <div className="relative rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/api/placeholder/400/400')] mix-blend-multiply opacity-20"></div>

          <div className="absolute -right-12 top-6 bg-yellow-400 text-red-800 font-bold py-1 px-12 transform rotate-45 text-sm shadow-md">
            LIMITED
          </div>

          <div className="relative z-10 p-6">
            <h2 className="text-xl font-bold mb-3 flex items-center text-white">
              <Tag size={20} className="mr-2" />
              Special Offer
            </h2>
            <p className="font-bold text-3xl mb-2 text-white">{promos[0].title}</p>
            <p className="text-white text-opacity-90 mb-5">{promos[0].description}</p>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl mb-5 text-center border border-white border-opacity-20">
              <p className="font-medium text-white">Show this page to our staff</p>
            </div>

            <div className="mb-5">
              <p className="text-sm font-semibold mb-3 text-white">Offer ends in:</p>
              <div className="grid grid-cols-4 gap-3 text-center">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div
                    key={unit}
                    className="bg-white bg-opacity-15 backdrop-blur-sm rounded-lg p-2 border border-white border-opacity-10"
                  >
                    <span className="block text-2xl font-bold text-white">
                      {value.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs text-white text-opacity-80 capitalize">{unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-white text-opacity-80 text-center">
              Valid until {formatValidUntilDate(promos[0].valid_until)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeSidebar;