import React from 'react';
import { Construction, Clock } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, features = [] }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="mb-6">
          <Construction className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        {features.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Planned Features:</h3>
            <ul className="text-left max-w-md mx-auto space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-blue-800 font-medium">This feature is under active development</p>
          <p className="text-blue-600 text-sm mt-1">Check back soon for updates!</p>
        </div>
      </div>
    </div>
  );
};