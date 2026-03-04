import React from "react";
import { Tag, Coffee, Book, Laptop, Clock } from "lucide-react";
import { Promo } from "../../types/cafe";
import { formatDisplayDate, isPromoExpired } from "../../utils/dateUtils";

interface CafePromotionsProps {
  promos?: Promo[];
}

const CafePromotions: React.FC<CafePromotionsProps> = ({ promos = [] }) => {
  // Array of dark gradient backgrounds
  const gradients = [
    "bg-gradient-to-r from-pink-500 to-orange-500",
    "bg-gradient-to-r from-blue-500 to-teal-500",
    "bg-gradient-to-r from-purple-500 to-indigo-500",
    "bg-gradient-to-r from-red-500 to-yellow-500",
    "bg-gradient-to-r from-green-500 to-emerald-500",
  ];

  return (
    <section
      className="cafe-promotions bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md mb-8"
      aria-labelledby="promotions-heading"
    >
      <h2
        id="promotions-heading"
        className="text-2xl font-bold text-blue-900 mb-4 flex items-center"
      >
        <Tag size={24} className="mr-2 text-purple-600" aria-hidden="true" />
        Current Promotions
      </h2>
      <div className="space-y-4">
        {promos.length > 0 ? (
          promos.map((promo, index) => {
            const expired = isPromoExpired(promo.valid_until);
            const gradientClass = gradients[index % gradients.length]; 
            return (
              <div
                key={promo.id}
                className={`${gradientClass} text-white p-5 rounded-lg shadow-lg transition-transform hover:scale-102 group hover:-translate-y-1 duration-300 ${expired ? "opacity-60" : ""}`}
              >
                <div className="flex items-start">
                  {promo.icon === "coffee" && (
                    <Coffee size={28} className="mr-4 text-white opacity-90" aria-hidden="true" />
                  )}
                  {promo.icon === "book" && (
                    <Book size={28} className="mr-4 text-white opacity-90" aria-hidden="true" />
                  )}
                  {promo.icon === "laptop" && (
                    <Laptop size={28} className="mr-4 text-white opacity-90" aria-hidden="true" />
                  )}
                  <div className="flex-grow">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-yellow-200 transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-white text-opacity-90">{promo.description}</p>
                    <div className="text-sm text-white text-opacity-80 mt-3 flex items-center">
                      <Clock size={16} className="mr-1" aria-hidden="true" />
                      Valid until: {formatDisplayDate(promo.valid_until)}
                      {expired && (
                        <span className="ml-2 text-red-200 font-semibold">[Expired]</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-sm">
                    <span className="font-bold">
                      {expired ? "Expired" : "In-Store Only"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No promotions available at the moment.</p>
        )}
      </div>
      {promos.length > 0 && promos.some(promo => !isPromoExpired(promo.valid_until)) && (
        <div className="mt-6 bg-blue-800 text-white p-4 rounded-lg text-center">
          <p className="text-lg font-medium">
            Show this page to our staff to redeem these promotions
          </p>
        </div>
      )}
    </section>
  );
};

export default CafePromotions;