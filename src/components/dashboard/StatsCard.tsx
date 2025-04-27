import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 text-primary-700';
      case 'secondary':
        return 'bg-secondary-50 text-secondary-700';
      case 'accent':
        return 'bg-accent-50 text-accent-700';
      case 'success':
        return 'bg-success-50 text-success-700';
      case 'warning':
        return 'bg-warning-50 text-warning-700';
      default:
        return 'bg-primary-50 text-primary-700';
    }
  };

  return (
    <div className="card p-6 h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success-500' : 'text-error-500'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-md ${getColorClass()}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;