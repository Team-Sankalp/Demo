import React from 'react';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  className = ''
}) => {
  const changeIcon = change?.type === 'increase' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-5 ${className}`}>
      <div className="flex items-center">
        <div className="bg-blue-100 rounded-lg p-2 sm:p-3 mr-3 sm:mr-4">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{value}</p>
        </div>
      </div>
      {change && (
        <div className="flex items-center mt-3 sm:mt-4 text-xs sm:text-sm">
          <div className={`flex items-center font-semibold ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="h-3 w-3 sm:h-4 sm:w-4">{changeIcon}</span>
            <span className="ml-1">{change.value}</span>
          </div>
          <span className="text-gray-500 ml-2 hidden sm:inline">vs last month</span>
        </div>
      )}
    </div>
  );
};