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
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 ${className}`}>
      <div className="flex items-center">
        <div className="bg-blue-100 rounded-lg p-3 mr-4">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <div className="flex items-center mt-4 text-sm">
          <div className={`flex items-center font-semibold ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeIcon}
            <span className="ml-1">{change.value}</span>
          </div>
          <span className="text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};