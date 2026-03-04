import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import Rating from '../common/Rating';
import { Cafe, Promo } from '../../types/cafe';

interface CafeCardProps {
  cafe: Cafe;
  index: number;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [promos, setPromos] = useState<Promo[]>([]);

  // Fetch promo data from the database
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch(`http://localhost/CAFEIND_API/api/get_promotions.php?cafe_id=${cafe.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch promos');
        }
        const promoIds = result.data.map((promo: Promo) => promo.id);
        console.log(`Promo IDs for cafe ${cafe.id}:`, promoIds); // Debugging
        setPromos(result.data); // Set data from the 'data' property
      } catch (error) {
        console.error(`Error fetching promos for cafe ${cafe.id}:`, error);
        setPromos([]); // Set to empty array if fetch fails
      }
    };

    fetchPromos();
  }, [cafe.id]);

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      // Initial card animation
      gsap.set(card, { opacity: 0, y: 30 });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.15,
        ease: 'power3.out',
      });

      // Initial price badge animation
      const priceBadge = card.querySelector('.price-badge');
      if (priceBadge) {
        gsap.fromTo(
          priceBadge,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: index * 0.15 + 0.3, // Slightly after card animation
            ease: 'back.out(1.7)',
          }
        );

        // Continuous floating animation for price badge
        gsap.to(priceBadge, {
          y: '+=10',
          x: '+=5', // Slight horizontal drift
          duration: 1.5 + index * 0.2, // Vary duration based on index for natural effect
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.1,
        });
      }

      // Hover animations for card, image, and details
      const hoverIn = () => {
        const image = card.querySelector('.cafe-image');
        const details = card.querySelector('.view-details');
        if (image) gsap.to(image, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
        if (details) gsap.to(details, { x: 5, duration: 0.3, ease: 'power1.out' });
        gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out' });
      };

      const hoverOut = () => {
        const image = card.querySelector('.cafe-image');
        const details = card.querySelector('.view-details');
        if (image) gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.out' });
        if (details) gsap.to(details, { x: 0, duration: 0.3, ease: 'power1.out' });
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
      };

      card.addEventListener('mouseenter', hoverIn);
      card.addEventListener('mouseleave', hoverOut);

      return () => {
        card.removeEventListener('mouseenter', hoverIn);
        card.removeEventListener('mouseleave', hoverOut);
      };
    }
  }, [index]);

  const renderPriceRange = (priceRange: number) => {
    const getBadgeStyle = () => {
      switch (priceRange) {
        case 1:
          return 'bg-green-50 text-green-700';
        case 2:
          return 'bg-orange-50 text-orange-700';
        case 3:
          return 'bg-purple-50 text-purple-700';
        default:
          return 'bg-gray-50 text-gray-700';
      }
    };

    const getPriceSymbol = () => {
      switch (priceRange) {
        case 1:
          return '💵';
        case 2:
          return '💰';
        case 3:
          return '💎';
        default:
          return '$';
      }
    };

    return (
      <div
        className={`price-badge flex items-center ${getBadgeStyle()} rounded-full px-4 py-2 font-medium text-base shadow-md transition-colors duration-300 hover:opacity-80`}
      >
        <span className="mr-2">{getPriceSymbol()}</span>
        <span>{'$'.repeat(priceRange)}</span>
      </div>
    );
  };

  const getAverageRating = (cafe: Cafe) => {
    const averageRatings =
      cafe.reviews && cafe.reviews.length > 0
        ? {
            wifiQuality: cafe.reviews.reduce((acc, review) => acc + review.wifiQuality, 0) / cafe.reviews.length,
            powerOutlets: cafe.reviews.reduce((acc, review) => acc + review.powerOutlets, 0) / cafe.reviews.length,
            comfortLevel: cafe.reviews.reduce((acc, review) => acc + review.comfortLevel, 0) / cafe.reviews.length,
          }
        : { wifiQuality: 0, powerOutlets: 0, comfortLevel: 0 };

    return cafe.reviews && cafe.reviews.length > 0
      ? (averageRatings.wifiQuality + averageRatings.powerOutlets + averageRatings.comfortLevel) / 3
      : 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    });
  };

  const isExpired = (valid_until: string) => {
    const now = new Date();
    const expiryDate = new Date(valid_until);
    return now > expiryDate;
  };

  const imageSrc = cafe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';

  const getIconComponent = (iconName: string) => {
    const icons = {
      coffee: Tag,
      book: Tag,
      laptop: Tag,
      Tag,
      Gift: () => null,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Tag;
    return <IconComponent size={16} className="mr-1 text-gray-600" />;
  };

  return (
    <div ref={cardRef} className="cafe-card-wrapper h-full">
      <Link to={`/cafes/${cafe.id}`} className="block h-full">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageSrc}
              alt={cafe.name}
              className="cafe-image w-full h-full object-cover transition-transform duration-500"
            />
            <div className="absolute top-4 right-4">{renderPriceRange(cafe.priceRange)}</div>

            <div className="absolute bottom-4 left-4 flex space-x-2">
              {cafe.amenities?.includes('Meeting Room') && (
                <div className="bg-blue-800 bg-opacity-90 text-white px-2.5 py-1 rounded-lg text-sm font-medium flex items-center shadow-sm hover:bg-blue-900 transition-colors duration-300">
                  <span className="mr-1">💼</span>
                  <span>Meeting Room</span>
                </div>
              )}
              {cafe.amenities?.includes('Prayer Room') && (
                <div className="bg-teal-500 bg-opacity-90 text-white px-2.5 py-1 rounded-lg text-sm font-medium flex items-center shadow-sm hover:bg-teal-600 transition-colors duration-300">
                  <span className="mr-1">🕌</span>
                  <span>Prayer Room</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-blue-900 hover:text-orange-500 transition-colors duration-300">
                {cafe.name}
              </h3>
              <Rating value={getAverageRating(cafe)} size="sm" showValue />
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin size={16} className="mr-1 text-blue-500" />
              <span>{cafe.area} - {cafe.address.split(',')[0]}</span>
            </div>
            <p className="text-base text-gray-700 mb-4 line-clamp-2 flex-grow">{cafe.description}</p>
            <div className="mt-auto">
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-1 text-green-500" />
                  <span>{cafe.avgVisitLength}</span>
                </div>
                {promos.length > 0 ? (
                  <div
                    className={`bg-blue-50 border border-blue-100 px-2 py-1 rounded-md text-sm font-medium shadow-sm transition-transform hover:bg-blue-200 hover:text-white duration-300 ${
                      isExpired(promos[0].valid_until) ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      {getIconComponent(promos[0].icon)}
                      <span className="text-gray-700">{promos[0].title}</span>
                      <span className="ml-2 text-sm text-gray-600">
                        (Until {formatDate(promos[0].valid_until)})
                        {isExpired(promos[0].valid_until) && (
                          <span className="ml-1 text-red-500 font-medium">[Expired]</span>
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-400 px-2 py-1 rounded-md font-medium">
                    <Tag size={16} className="mr-1" />
                    <span>No Promo Available</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {cafe.tags.slice(0, 2).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm font-medium transition-colors duration-300 hover:bg-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                  {cafe.tags.length > 2 && (
                    <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                      +{cafe.tags.length - 2}
                    </span>
                  )}
                </div>
                <span className="view-details text-orange-500 font-medium text-sm transition-transform duration-300 hover:text-orange-600">
                  View Details →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CafeCard;