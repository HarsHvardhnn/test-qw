import React, { useState } from 'react';
import { Clock, Target, DollarSign, BarChart, Users, MapPin, Plus, Star, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { AdCampaignForm } from './AdCampaignForm';
import { AdPerformanceChart } from './AdPerformanceChart';
import { AdCampaignsList } from './AdCampaignsList';

interface AdCampaign {
  id: string;
  name: string;
  type: 'product' | 'service';
  status: 'active' | 'paused' | 'ended';
  budget: number;
  spent: number;
  startDate: string;
  endDate?: string;
  targeting: {
    locations: string[];
    audience: ('contractors' | 'customers')[];
  };
  performance: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    roi: number;
  };
  products: Array<{
    id: string;
    name: string;
    image: string;
  }>;
}

export const AdvertisingPanel: React.FC = () => {
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);

  // Sample campaigns data
  const [campaigns] = useState<AdCampaign[]>([
    {
      id: 'c1',
      name: 'Summer Water Solutions',
      type: 'product',
      status: 'active',
      budget: 5000,
      spent: 2150,
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      targeting: {
        locations: ['Portland Metro', 'Vancouver WA'],
        audience: ['contractors', 'customers']
      },
      performance: {
        impressions: 25000,
        clicks: 1250,
        ctr: 5,
        conversions: 75,
        roi: 285
      },
      products: [
        {
          id: 'p1',
          name: 'Whole House Water Filter System',
          image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      id: 'c2',
      name: 'Contractor Special',
      type: 'service',
      status: 'active',
      budget: 3000,
      spent: 950,
      startDate: '2025-05-15',
      targeting: {
        locations: ['Portland Metro'],
        audience: ['contractors']
      },
      performance: {
        impressions: 12000,
        clicks: 480,
        ctr: 4,
        conversions: 28,
        roi: 195
      },
      products: [
        {
          id: 'p2',
          name: 'Professional Installation Service',
          image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80'
        }
      ]
    }
  ]);

  // Calculate total stats
  const totalStats = campaigns.reduce(
    (acc, campaign) => ({
      spent: acc.spent + campaign.spent,
      impressions: acc.impressions + campaign.performance.impressions,
      clicks: acc.clicks + campaign.performance.clicks,
      conversions: acc.conversions + campaign.performance.conversions,
      roi: acc.roi + campaign.performance.roi
    }),
    { spent: 0, impressions: 0, clicks: 0, conversions: 0, roi: 0 }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Advertising</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
          </div>
          <button
            onClick={() => setShowCampaignForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-blue-600">MTD</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Ad Spend</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{formatCurrency(totalStats.spent)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <BarChart className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600">+12% this month</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{totalStats.impressions.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-purple-600">+8% this month</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{totalStats.clicks.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-yellow-600">+15% this month</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{totalStats.conversions.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-700">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-orange-600">+5% this month</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">ROI</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{totalStats.roi.toFixed(1)}%</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Campaign Performance</h2>
          <button
            onClick={() => setShowPerformanceDetails(!showPerformanceDetails)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {showPerformanceDetails ? 'Hide' : 'Show'} Details
            {showPerformanceDetails ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>
        <div className="p-6">
          <AdPerformanceChart />
        </div>
      </div>

      {/* Active Campaigns */}
      <AdCampaignsList
        campaigns={campaigns}
        onEdit={setSelectedCampaign}
      />

      {/* Campaign Form Modal */}
      {(showCampaignForm || selectedCampaign) && (
        <AdCampaignForm
          isOpen={true}
          onClose={() => {
            setShowCampaignForm(false);
            setSelectedCampaign(null);
          }}
          campaign={selectedCampaign}
        />
      )}
    </div>
  );
};