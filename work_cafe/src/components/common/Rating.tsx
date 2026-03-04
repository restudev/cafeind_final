import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showValue?: boolean;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  maxValue = 5,
  size = 'md',
  color = 'text-yellow-400',
  showValue = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-full-${i}`} className={`${sizeClasses[size]} ${color} fill-current`} />
      );
    }

    // Half star
    if (hasHalfStar && fullStars < maxValue) {
      stars.push(
        <div key="star-half" className="relative">
          <Star className={`${sizeClasses[size]} text-gray-300 fill-current`} />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className={`${sizeClasses[size]} ${color} fill-current`} />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStarsCount = maxValue - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(
        <Star key={`star-empty-${i}`} className={`${sizeClasses[size]} text-gray-300 fill-current`} />
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">{renderStars()}</div>
      {showValue && <span className="ml-1 text-sm text-gray-300 font-bold">{value.toFixed(1)}</span>}
    </div>
  );
};

export default Rating;