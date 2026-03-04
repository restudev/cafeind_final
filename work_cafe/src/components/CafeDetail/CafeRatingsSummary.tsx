import React from "react";
import { Star, Wifi, Zap, Coffee } from "lucide-react";
import Rating from "../../components/common/Rating";

interface CafeRatingSummaryProps {
  averageRatings: {
    wifiQuality: number;
    powerOutlets: number;
    comfortLevel: number;
  };
}

const CafeRatingSummary: React.FC<CafeRatingSummaryProps> = ({ averageRatings }) => {
  return (
    <div className="cafe-ratings-summary bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Star size={20} className="mr-2 fill-current text-yellow-400" />
        Rating Summary
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg">
          <Wifi size={28} className="mx-auto mb-2 text-blue-300" />
          <h3 className="font-semibold mb-1 text-white">WiFi Quality</h3>
          <div className="flex justify-center">
            <Rating
              value={averageRatings.wifiQuality}
              showValue
              size="lg"
              className="custom-rating custom-rating-value"
            />
          </div>
        </div>
        <div className="text-center p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg">
          <Zap size={28} className="mx-auto mb-2 text-yellow-300" />
          <h3 className="font-semibold mb-1 text-white">Power Outlets</h3>
          <div className="flex justify-center">
            <Rating
              value={averageRatings.powerOutlets}
              showValue
              size="lg"
              className="custom-rating custom-rating-value"
            />
          </div>
        </div>
        <div className="text-center p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg">
          <Coffee size={28} className="mx-auto mb-2 text-green-300" />
          <h3 className="font-semibold mb-1 text-white">Comfort Level</h3>
          <div className="flex justify-center">
            <Rating
              value={averageRatings.comfortLevel}
              showValue
              size="lg"
              className="custom-rating custom-rating-value"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeRatingSummary;