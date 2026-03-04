import React from 'react';
import { Star, MapPin, ArrowRight, Coffee } from 'lucide-react';
import { Cafe } from '../../../types/cafe';
import { Link } from 'react-router-dom';

interface PopularCafesProps {
  cafes: Cafe[];
}

const PopularCafes: React.FC<PopularCafesProps> = ({ cafes }) => {
  // Limit cafes to first 3
  const displayedCafes = cafes.slice(0, 3);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Simple header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Popular Cafes</h3>
          <Link 
            to="/admin/cafes" 
            className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center transition-colors"
          >
            View all
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-slate-100">
        {displayedCafes.length === 0 ? (
          <div className="p-8 text-center">
            <Coffee size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No cafes available</p>
          </div>
        ) : (
          displayedCafes.map((cafe, index) => (
            <div key={cafe.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                {/* Rank number */}
                <div className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-700 text-sm font-medium rounded-full flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Cafe image */}
                <div className="flex-shrink-0">
                  <img
                    src={cafe.imageUrl || 'https://via.placeholder.com/48x48?text=Cafe'}
                    alt={cafe.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </div>

                {/* Cafe info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{cafe.name}</h4>
                  
                  <div className="flex items-center gap-3 mt-1">
                    {/* Rating */}
                    <div className="flex items-center">
                      <Star size={14} className="text-amber-400 fill-amber-400 mr-1" />
                      <span className="text-sm text-slate-600">{cafe.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 ml-1">({cafe.reviews.length})</span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center text-slate-500">
                      <MapPin size={12} className="mr-1" />
                      <span className="text-xs">{cafe.area}</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex-shrink-0">
                  <Link
                    to={`/cafes/${cafe.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-md border border-sky-200 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PopularCafes;