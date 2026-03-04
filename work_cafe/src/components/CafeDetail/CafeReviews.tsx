import React from "react";
import Rating from "../common/Rating";

interface UserReview {
  wifiQuality: number;
  powerOutlets: number;
  comfortLevel: number;
  comment: string;
  date: string;
  user: string;
}

interface CafeReviewsProps {
  cafe: { reviews?: UserReview[] };
}

const CafeReviews: React.FC<CafeReviewsProps> = ({ cafe }) => {
  return (
    <div className="cafe-reviews bg-white p-6 rounded-xl shadow-md mb-8">
      {cafe.reviews && cafe.reviews.length > 0 && (
        <div className="space-y-4 mb-6">
          {cafe.reviews.map((review, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 font-semibold">
                  Anonymous User {review.user.slice(0, 8)}...
                </span>
                <span className="text-gray-600 text-sm">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-2">
                <div className="flex items-center">
                  <span className="w-32 text-gray-600">WiFi Quality:</span>
                  <Rating value={review.wifiQuality} size="sm" />
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-gray-600">Power Outlets:</span>
                  <Rating value={review.powerOutlets} size="sm" />
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-gray-600">Comfort Level:</span>
                  <Rating value={review.comfortLevel} size="sm" />
                </div>
              </div>
              <p className="text-gray-800">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CafeReviews;