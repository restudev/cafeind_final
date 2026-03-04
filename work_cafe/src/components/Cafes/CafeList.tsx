import React from 'react';
import CafeCard from './CafeCard';
import { Cafe } from '../../types/cafe';

interface CafeListProps {
  cafes: Cafe[];
}

const CafeList: React.FC<CafeListProps> = ({ cafes }) => {
  if (cafes.length === 0) {
    return <div className="text-center py-10">No cafes available at this time.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cafes.map((cafe, index) => (
        <CafeCard key={cafe.id} cafe={cafe} index={index} />
      ))}
    </div>
  );
};

export default CafeList;