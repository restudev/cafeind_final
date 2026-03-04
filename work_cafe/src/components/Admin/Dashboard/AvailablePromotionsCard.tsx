import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Tag, Clock, Calendar, Coffee, Book, Laptop, Filter, Search } from 'lucide-react';

// Updated promotion interface to handle different types of promotions
interface Promotion {
  name: string;
  discount?: number;      // Optional percentage discount
  description: string;    // Description of the promotion
  valid_until: string;     // ISO date string
  promoType?: string;     // Type of promotion (discount, freebie, buy-one-get-one, etc.)
  icon?: string;          // Icon identifier (coffee, book, laptop)
}

interface AvailablePromotionsCardProps {
  data: {
    cafeName: string;
    promotions: Promotion[];
  }[];
}

const AvailablePromotionsCard: React.FC<AvailablePromotionsCardProps> = ({ data }) => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Theme colors with dominant blue palette, updated to match CafePromotions
  const themeColors = {
    primary: {
      light: 'bg-blue-50',
      medium: 'bg-blue-100',
      dark: 'bg-blue-600',
      text: 'text-blue-700',
      border: 'border-blue-200',
      gradient: 'from-blue-50 to-blue-200',
      hover: 'hover:bg-blue-200',
      focus: 'focus:ring-blue-600'
    },
    accent: {
      light: 'bg-gray-50',
      medium: 'bg-gray-100',
      text: 'text-gray-600',
      gradient: 'from-blue-600 to-teal-500'
    }
  };

  // Array of gradient backgrounds matching CafePromotions
  const gradients = [
    'bg-gradient-to-r from-pink-500 to-orange-500',
    'bg-gradient-to-r from-blue-500 to-teal-500',
    'bg-gradient-to-r from-purple-500 to-indigo-500',
    'bg-gradient-to-r from-red-500 to-yellow-500',
    'bg-gradient-to-r from-green-500 to-emerald-500',
  ];

  // Flatten promotions and filter based on time and search - ONLY ACTIVE PROMOTIONS
  const filteredPromotions = data
    .flatMap(item => item.promotions.map(promo => ({ ...promo, cafeName: item.cafeName })))
    .filter(promo => {
      // First filter: only active promotions (not expired)
      const valid_until = new Date(promo.valid_until);
      const now = new Date('2025-05-21T17:24:00+07:00');
      const isActive = valid_until >= now;
      
      if (!isActive) return false;
      
      // Second filter: search term
      const matchesSearch = promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           promo.cafeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           promo.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Third filter: time range (only for active promotions)
      if (timeFilter === 'all') return true;
      const diffDays = Math.floor((valid_until.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (timeFilter) {
        case '7days': return diffDays <= 7;
        case '30days': return diffDays <= 30;
        case '3months': return diffDays <= 90;
        case 'year': return diffDays <= 365;
        default: return true;
      }
    })
    .sort((a, b) => {
      // Sort by expiry date (closest first)
      const dateA = new Date(a.valid_until);
      const dateB = new Date(b.valid_until);
      
      return dateA.getTime() - dateB.getTime();
    });

  // Display logic: show max 2 promotions as preview
  const displayedPromotions = filteredPromotions.slice(0, 2);

  // Function to get the appropriate icon based on promotion icon property
  const getPromoIcon = (icon?: string): JSX.Element => {
    switch (icon?.toLowerCase()) {
      case 'coffee':
        return <Coffee className="w-6 h-6 text-white opacity-90" />;
      case 'book':
        return <Book className="w-6 h-6 text-white opacity-90" />;
      case 'laptop':
        return <Laptop className="w-6 h-6 text-white opacity-90" />;
      default:
        return <Coffee className="w-6 h-6 text-white opacity-90" />;
    }
  };

  const getExpiryStatus = (valid_until: string): { label: string; color: string; urgent: boolean } => {
    const expiryDate = new Date(valid_until);
    const now = new Date('2025-05-21T17:24:00+07:00'); // Current time: 05:24 PM WIB, May 21, 2025
    const diffDays = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffDays === 0) {
      return { label: `${diffHours}h left`, color: 'bg-red-100 text-red-800 border-red-200', urgent: true };
    } else if (diffDays <= 3) {
      return { label: `${diffDays} days left`, color: 'bg-orange-100 text-orange-800 border-orange-200', urgent: true };
    } else if (diffDays <= 7) {
      return { label: `${diffDays} days left`, color: 'bg-blue-100 text-blue-800 border-blue-200', urgent: false };
    } else {
      return { label: 'Active', color: 'bg-blue-100 text-blue-800 border-blue-200', urgent: false };
    }
  };

  // Get promotion type counts for stats display
  const getPromoTypeCounts = (): Record<string, number> => {
    const counts = {
      discount: 0,
      bogo: 0,
      freebie: 0,
      other: 0
    };
    
    filteredPromotions.forEach((promo) => {
      if (promo.discount !== undefined && promo.discount > 0) {
        counts.discount++;
      } else if (['bogo', 'buy-one-get-one'].includes(promo.promoType?.toLowerCase() || '')) {
        counts.bogo++;
      } else if (promo.promoType?.toLowerCase() === 'freebie') {
        counts.freebie++;
      } else {
        counts.other++;
      }
    });
    
    return counts;
  };

  // Get the most common promo type
  const getMostCommonPromoType = (): string | null => {
    const counts = getPromoTypeCounts();
    const maxType = Object.entries(counts).reduce((max, [type, count]) => 
      count > max.count ? {type, count} : max, {type: '', count: 0});
    
    if (maxType.count === 0) return null;
    
    switch(maxType.type) {
      case 'discount': return 'Discounts';
      case 'bogo': return 'BOGO Offers';
      case 'freebie': return 'Freebies';
      default: return 'Special Offers';
    }
  };

  // Get discount statistics if applicable
  const getDiscountStats = (): { avgDiscount: number; bestDiscount: number; count: number } | null => {
    const discountPromos = filteredPromotions.filter(p => p.discount !== undefined && p.discount > 0);
    
    if (discountPromos.length === 0) return null;
    
    const avgDiscount = Math.round(
      discountPromos.reduce((sum, p) => sum + (p.discount || 0), 0) / discountPromos.length
    );
    
    const bestDiscount = Math.max(...discountPromos.map(p => p.discount || 0));
    
    return { avgDiscount, bestDiscount, count: discountPromos.length };
  };

  // Get numbers of promotions ending soon (within 7 days)
  const getPromosEndingSoon = (): number => {
    return filteredPromotions.filter(p => {
      const days = Math.floor(
        (new Date(p.valid_until).getTime() - new Date('2025-05-21T17:24:00+07:00').getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      return days <= 7;
    }).length;
  };

  // Get stats for the summary section
  const getStats = (): Array<{ value: string; label: string; bgColor: string; textColor: string; labelColor: string }> => {
    const stats = [];
    const discountStats = getDiscountStats();
    const endingSoon = getPromosEndingSoon();
    const typeCounts = getPromoTypeCounts();
    const mostCommonType = getMostCommonPromoType();
    
    if (discountStats && discountStats.count > 0) {
      stats.push({
        value: `${discountStats.avgDiscount}%`,
        label: 'Avg Discount',
        bgColor: themeColors.primary.light,
        textColor: themeColors.primary.text,
        labelColor: themeColors.primary.text
      });
      
      stats.push({
        value: `${discountStats.bestDiscount}%`,
        label: 'Best Discount',
        bgColor: themeColors.primary.light,
        textColor: themeColors.primary.text,
        labelColor: themeColors.primary.text
      });
    } else {
      if (mostCommonType) {
        stats.push({
          value: `${Math.max(...Object.values(typeCounts))}`,
          label: mostCommonType,
          bgColor: themeColors.primary.light,
          textColor: themeColors.primary.text,
          labelColor: themeColors.primary.text
        });
      }
      
      stats.push({
        value: `${endingSoon}`,
        label: 'Ending Soon',
        bgColor: themeColors.primary.light,
        textColor: themeColors.primary.text,
        labelColor: themeColors.primary.text
      });
    }
    
    stats.push({
      value: `${filteredPromotions.length}`,
      label: 'Active Promotions',
      bgColor: themeColors.primary.light,
      textColor: themeColors.primary.text,
      labelColor: themeColors.primary.text
    });
    
    return stats;
  };

  const summaryStats = getStats();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-5 border-b border-blue-100 bg-gradient-to-r ${themeColors.primary.gradient}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Coffee className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Available Promotions</h3>
              <p className="text-sm text-gray-600">Discover great deals and special offers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Total:</span>
            <span className="font-semibold text-blue-700">{filteredPromotions.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search promotions or cafes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 ${themeColors.primary.focus} focus:border-transparent text-sm`}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className={`pl-10 pr-8 py-2 border border-blue-200 rounded-lg focus:ring-2 ${themeColors.primary.focus} focus:border-transparent text-sm bg-white appearance-none cursor-pointer min-w-40`}
            >
              <option value="all">All Active</option>
              <option value="7days">Expiring in 7 Days</option>
              <option value="30days">Expiring in 30 Days</option>
              <option value="3months">Expiring in 3 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredPromotions.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 ${themeColors.primary.light} rounded-full flex items-center justify-center`}>
              <Coffee className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No active promotions found</h4>
            <p className="text-gray-500 text-sm">Try adjusting your search terms or check back later for new deals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedPromotions.map((promo, index) => {
              const status = getExpiryStatus(promo.valid_until);
              const gradientClass = gradients[index % gradients.length];
              
              return (
                <div 
                  key={index} 
                  className={`group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-102 hover:-translate-y-1 duration-300 ${gradientClass} text-white`}
                >
                  {/* Urgent indicator */}
                  {status.urgent && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-red-500"></div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        {getPromoIcon(promo.icon)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg mb-2 group-hover:text-yellow-200 transition-colors truncate">
                            {promo.name}
                          </h4>
                          <div className="flex items-center space-x-1 mb-2">
                            <Tag className="w-3 h-3 text-white opacity-80" />
                            <span className="text-sm text-white opacity-90 font-medium">{promo.cafeName}</span>
                          </div>
                          <p className="text-sm text-white opacity-90 line-clamp-2">{promo.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-white opacity-80 mt-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Valid until {format(new Date(promo.valid_until), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(promo.valid_until), 'h:mm a')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Status badge */}
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredPromotions.length > 2 && (
              <div className="pt-4 border-t border-blue-100">
                <Link
                  to="/admin/promotions"
                  className={`w-full py-3 px-4 text-sm font-medium ${themeColors.primary.text} ${themeColors.primary.medium} ${themeColors.primary.hover} rounded-lg transition-colors duration-200 flex items-center justify-center`}
                >
                  View All Promotions
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Summary Statistics */}
        {filteredPromotions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-blue-100">
            <div className="grid grid-cols-3 gap-4">
              {summaryStats.map((stat, index) => (
                <div key={index} className={`text-center p-3 ${stat.bgColor} rounded-lg`}>
                  <div className={`text-lg font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs ${stat.labelColor} uppercase tracking-wide`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailablePromotionsCard;