import React from "react";
import { MessageCircle, Trophy } from "lucide-react";
import Button from "../common/Button";
import Rating from "../common/Rating";
import { UserReview } from "../../types/cafe";

interface CafeReviewSectionProps {
  reviews: UserReview[];
  averageRating: number;
  openReviewModal: () => void; // Function to open review modal
}

const CafeReviewSection: React.FC<CafeReviewSectionProps> = ({
  reviews,
  averageRating,
  openReviewModal,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-blue-800 px-6 py-5 border-b border-blue-800">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
              <MessageCircle className="text-white" size={20} />
            </div>
             Reviews
          </h2>
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center border border-white border-opacity-30 shadow-sm">
            <Trophy className="text-yellow-300 mr-2" size={16} />
            <span className="text-white font-medium text-sm">{averageRating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-blue-100 mt-2 text-sm">See what others say about this cafe</p>
      </div>
      <div className="p-6">
        {reviews && reviews.length > 0 ? (
          <div className="space-y-5 mb-6">
            {reviews.map((review: UserReview, index: number) => (
              <div key={index} className="group bg-gray-50 hover:bg-blue-50 transition-colors duration-200 p-5 rounded-xl border border-gray-100 hover:border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-blue-600 font-semibold text-sm">
                        {(review.user || "A").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <span className="text-gray-800 font-medium">
                        {review.user || "Anonymous"}
                      </span>
                      <p className="text-gray-500 text-xs">
                        {new Date(review.date || "").toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg">
                      <span className="text-gray-600 text-sm mb-1">WiFi Quality</span>
                      <Rating value={review.wifiQuality} size="sm" />
                    </div>
                    <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg">
                      <span className="text-gray-600 text-sm mb-1">Power Outlets</span>
                      <Rating value={review.powerOutlets} size="sm" />
                    </div>
                    <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg">
                      <span className="text-gray-600 text-sm mb-1">Comfort Level</span>
                      <Rating value={review.comfortLevel} size="sm" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100 group-hover:border-blue-100 transition-colors duration-200">
                  <p className="text-gray-700 leading-relaxed text-sm italic">"{review.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 mb-2">No reviews yet</p>
            <p className="text-gray-400 text-sm">Be the first to share your cafe experience!</p>
          </div>
        )}
        <div className="flex justify-center pt-4 border-t border-gray-100">
          <Button
            variant="primary"
            onClick={openReviewModal}
            className="px-8 py-3 font-medium shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            Write a Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CafeReviewSection;