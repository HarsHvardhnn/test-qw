import React, { useEffect, useState } from 'react';
import { Clock, Package, BarChart, Star, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, Users, ShoppingCart, Eye, MousePointer, Upload, Target, Plus } from 'lucide-react';
import axiosInstance from '../../axios';

interface OverviewPanelProps {
  onPanelChange?: (panel: string) => void;
  setActivePanel: any;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ onPanelChange ,setActivePanel}) => {
  // Sample data - in a real app this would come from an API
  const [stats,setStats]=useState( {
    totalProducts: 25,
    activeProducts: 18,
    totalViews: 12500,
    totalClicks: 850,
    conversionRate: 2.8,
    revenue: 45250.75,
    monthlyGrowth: 12.5,
    topPerforming: [
      {
        id: 'p1',
        name: 'Whole House Water Filter System',
        views: 1250,
        clicks: 320,
        revenue: 12999.90,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'
      },
      {
        id: 'p2',
        name: 'Under-Sink Water Filter',
        views: 850,
        clicks: 210,
        revenue: 5999.80,
        image: 'https://images.unsplash.com/photo-1585622733897-0d0df3418edb?auto=format&fit=crop&q=80'
      }
    ]
  })


   const getPerformanceOverview =
     async (): Promise<any | null> => {
       try {
         const res = await axiosInstance.get("/quote/v2/perf/metrics");
         return res.data;
       } catch (error) {
         console.error("Error fetching performance overview:", error);
         return null;
       }
     };

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getPerformanceOverview();
      if (data) {
        setStats(data);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleNavigation = (panel: string) => {
    if (onPanelChange) {
      onPanelChange(panel);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
        <button 
          onClick={() => setActivePanel('products')}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <Upload className="w-8 h-8" />
            <ArrowUpRight className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Inventory</h3>
          <p className="text-sm text-blue-100">Bulk upload your products and manage inventory</p>
        </button>

        <button 
          onClick={() => setActivePanel('services')}
          className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <Plus className="w-8 h-8" />
            <ArrowUpRight className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Create Service</h3>
          <p className="text-sm text-purple-100">Add a new service to your offerings</p>
        </button>

        <button 
          onClick={() => setActivePanel('marketing')}
          className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg text-white hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <ArrowUpRight className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Choose Marketing Plan</h3>
          <p className="text-sm text-yellow-100">Set up targeted advertising campaigns</p>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-blue-600">{stats.activeProducts} active</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.totalProducts}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <BarChart className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600">+{stats.monthlyGrowth}% this month</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-yellow-600">{stats.conversionRate}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.conversionRate}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-purple-600">MTD</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      {/* Performance Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Top Performing Products</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topPerforming.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                    <div className="mt-1 flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {product.views.toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MousePointer className="w-4 h-4 mr-1" />
                        {product.clicks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                    <div className="mt-1 flex items-center justify-end text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      12%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marketing Performance */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Marketing Performance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-amber-600 mr-2" />
                  <span className="text-sm text-gray-700">Current Plan:</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Premium ($2.50/click)</span>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Monthly Budget Used</span>
                  <span>$750/$1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">250 clicks remaining this month</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Click-through Rate</p>
                  <div className="flex items-center">
                    <p className="text-lg font-semibold text-gray-900">4.8%</p>
                    <div className="flex items-center ml-2 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs ml-1">+0.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Conversion Rate</p>
                  <div className="flex items-center">
                    <p className="text-lg font-semibold text-gray-900">2.8%</p>
                    <div className="flex items-center ml-2 text-red-600">
                      <TrendingDown className="w-4 h-4" />
                      <span className="text-xs ml-1">-0.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleNavigation('marketing')}
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Adjust Marketing Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};