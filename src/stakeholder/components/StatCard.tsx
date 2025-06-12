import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-700';
      case 'green':
        return 'bg-green-50 text-green-700';
      case 'purple':
        return 'bg-purple-50 text-purple-700';
      case 'orange':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          {icon}
        </div>
        <div className={`flex items-center ${
          changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="text-sm font-medium">{change}</span>
          {changeType === 'increase' ? (
            <ArrowUpRight className="w-4 h-4 ml-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 ml-1" />
          )}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
};