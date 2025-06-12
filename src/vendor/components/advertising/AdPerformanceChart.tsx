import React from 'react';
import { Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AdPerformanceChart: React.FC = () => {
  // Sample performance data
  const performanceData = {
    currentPeriod: {
      impressions: 25000,
      clicks: 1250,
      ctr: 5,
      conversions: 75,
      roi: 285
    },
    previousPeriod: {
      impressions: 22000,
      clicks: 1100,
      ctr: 4.5,
      conversions: 65,
      roi: 250
    }
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const metrics = [
    {
      name: 'Impressions',
      current: performanceData.currentPeriod.impressions,
      previous: performanceData.previousPeriod.impressions,
      format: (value: number) => value.toLocaleString()
    },
    {
      name: 'Clicks',
      current: performanceData.currentPeriod.clicks,
      previous: performanceData.previousPeriod.clicks,
      format: (value: number) => value.toLocaleString()
    },
    {
      name: 'CTR',
      current: performanceData.currentPeriod.ctr,
      previous: performanceData.previousPeriod.ctr,
      format: (value: number) => `${value}%`
    },
    {
      name: 'Conversions',
      current: performanceData.currentPeriod.conversions,
      previous: performanceData.previousPeriod.conversions,
      format: (value: number) => value.toLocaleString()
    },
    {
      name: 'ROI',
      current: performanceData.currentPeriod.roi,
      previous: performanceData.previousPeriod.roi,
      format: (value: number) => `${value}%`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <select className="border-none bg-transparent focus:ring-0 py-0 pl-0 pr-6">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((metric) => {
          const change = calculateChange(metric.current, metric.previous);
          return (
            <div key={metric.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{metric.name}</span>
                <div className={`flex items-center text-sm ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change.isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{change.value}%</span>
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {metric.format(metric.current)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                vs {metric.format(metric.previous)} prev
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">Interactive performance chart coming soon</p>
        </div>
      </div>
    </div>
  );
};