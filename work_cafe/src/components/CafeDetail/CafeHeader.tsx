import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { MapPin } from "lucide-react";

interface CafeHeaderProps {
  name: string;
  address: string;
  area: string;
  averageRating: number;
}

const CafeHeader: React.FC<CafeHeaderProps> = ({ name, address, area, averageRating }) => {
  return (
    <div className="cafe-header mb-8">
      <Link
        to="/cafes"
        className="flex items-center text-blue-600 mb-4 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to all cafes
      </Link>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2 md:mb-0">
          {name}
        </h1>
        <div className="flex items-center">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center">
            <span className="text-2xl font-bold mr-1">{averageRating.toFixed(1)}</span>
            <Star size={20} className="fill-current text-yellow-400" />
            <span className="ml-2 text-sm">Overall Rating</span>
          </div>
        </div>
      </div>
      <div className="flex items-center text-gray-600 mt-2">
        <MapPin size={18} className="mr-1" />
        {address} ({area})
      </div>
    </div>
  );
};

export default CafeHeader;