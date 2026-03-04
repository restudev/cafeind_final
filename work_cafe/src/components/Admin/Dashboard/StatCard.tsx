import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeText?: string;
  iconBgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeText,
  iconBgColor = 'bg-blue-100',
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
      </div>
      
      {(change !== undefined || changeText) && (
        <div className="mt-4 flex items-center">
          {change !== undefined && (
            <span className={`flex items-center text-sm font-medium ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
            }`}>
              {isPositive && <ArrowUp className="h-4 w-4 mr-1" />}
              {isNegative && <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(change)}%
            </span>
          )}
          {changeText && (
            <span className="text-sm text-gray-500 ml-1">
              {changeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;