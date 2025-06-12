import React from 'react';
import { Edit2, Pause, Play, Target, Users, MapPin, DollarSign, BarChart, Star, ArrowUpRight } from 'lucide-react';

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

interface AdCampaignsListProps {
  campaigns: AdCampaign[];
  onEdit: (campaign: AdCampaign) => void;
}

export const AdCampaignsList: React.FC<AdCampaignsListProps> = ({
  campaigns,
  onEdit
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Active Campaigns</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Campaign Image */}
                <img
                  src={campaign.products[0].image}
                  alt={campaign.products[0].name}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                {/* Campaign Info */}
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                      campaign.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Target className="w-4 h-4 mr-2" />
                      <span>Campaign Period: {formatDate(campaign.startDate)} - {campaign.endDate ? formatDate(campaign.endDate) : 'Ongoing'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Targeting: {campaign.targeting.locations.join(', ')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Audience: {campaign.targeting.audience.map(a => 
                        a.charAt(0).toUpperCase() + a.slice(1)
                      ).join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(campaign)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                >
                  {campaign.status === 'active' ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Budget</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(campaign.budget)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Spent: {formatCurrency(campaign.spent)}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <BarChart className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Impressions</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{campaign.performance.impressions.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Clicks</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{campaign.performance.clicks.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">CTR</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{campaign.performance.ctr.toFixed(1)}%</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Conversions</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{campaign.performance.conversions}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">ROI</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{campaign.performance.roi}%</p>
              </div>
            </div>
          </div>
        ))}

        {campaigns.length === 0 && (
          <div className="p-6 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-500">Create your first campaign to start promoting your products.</p>
          </div>
        )}
      </div>
    </div>
  );
};