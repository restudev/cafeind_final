import React, { useState } from 'react';
import { Star, ArrowRight, Coffee } from 'lucide-react';
import { UserReview } from '../../../types/cafe';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RecentReviewsProps {
  reviews: {
    id: string;
    cafeName: string;
    review: UserReview;
  }[];
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ reviews }) => {
  const [hoveredReview, setHoveredReview] = useState<string | null>(null);

  // Limit reviews to first 3
  const displayedReviews = reviews.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-500 animate-pulse">✨</span> Recent Reviews
          </h3>
          <Link 
            to="/admin/reviews" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
          >
            View all
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-slate-100">
        {displayedReviews.length === 0 ? (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Coffee size={32} className="text-indigo-200 mx-auto mb-3 animate-bounce" />
              <p className="text-slate-600 font-medium">No reviews yet</p>
              <p className="text-sm text-slate-400 mt-1">Encourage users to share their experiences!</p>
            </motion.div>
          </div>
        ) : (
          displayedReviews.map((item, index) => {
            const averageRating = (item.review.wifiQuality + item.review.powerOutlets + item.review.comfortLevel) / 3;
            const displayName = item.review.user?.trim() || 'Guest'; // Use 'Guest' instead of 'Anonymous'
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 hover:bg-indigo-50/30 transition-all duration-300"
                onMouseEnter={() => setHoveredReview(item.id)}
                onMouseLeave={() => setHoveredReview(null)}
              >
                <div className="flex items-center gap-4">
                  {/* User Avatar with Hover Effect */}
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-semibold text-base shadow-md">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  </motion.div>

                  {/* Review Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-900 text-lg truncate hover:text-indigo-600 transition-colors">
                        {item.cafeName}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < Math.round(averageRating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200'
                            } transition-all duration-200 ${
                              hoveredReview === item.id ? 'scale-110' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="text-indigo-500">👤</span> {displayName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>{format(new Date(item.review.date), 'MMM d, yyyy')}</span>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {item.review.comment}
                    </p>
                    <motion.div
                      className="mt-2 flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors">
                        WiFi: {item.review.wifiQuality}/5
                      </div>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors">
                        Power: {item.review.powerOutlets}/5
                      </div>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors">
                        Comfort: {item.review.comfortLevel}/5
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentReviews;