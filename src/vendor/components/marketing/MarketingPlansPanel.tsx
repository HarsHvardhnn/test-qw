import React, { useState } from 'react';
import { Clock, Target, DollarSign, MapPin, Users, ChevronRight, Star, BarChart, AlertCircle } from 'lucide-react';
import { PlanConfigurationView } from './PlanConfigurationView';

interface MarketingPlan {
  id: string;
  name: string;
  type: 'Essential' | 'Targeted' | 'Premium';
  monthlyViews: number;
  clickCost: number;
  maxRegions: number;
  features: string[];
  isActive?: boolean;
}

export const MarketingPlansPanel: React.FC = () => {
  // Sample marketing plans data
  const marketingPlans: MarketingPlan[] = [
    {
      id: 'essential',
      name: 'Essential Market Plan',
      type: 'Essential',
      monthlyViews: 5000,
      clickCost: 0.75,
      maxRegions: 3,
      features: [
        'Standard visibility in search results',
        '5,000 guaranteed monthly views',
        'Basic analytics dashboard',
        'Coverage for 1 state or 3 counties/cities',
        '$0.75 per click rate'
      ]
    },
    {
      id: 'targeted',
      name: 'Targeted Growth Plan',
      type: 'Targeted',
      monthlyViews: 15000,
      clickCost: 1.50,
      maxRegions: 10,
      features: [
        'Higher search result placement',
        '15,000 guaranteed monthly views',
        'Advanced analytics & reporting',
        'Coverage for multiple states/regions',
        '$1.50 per click rate',
        'A/B testing capabilities'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Market Domination',
      type: 'Premium',
      monthlyViews: 50000,
      clickCost: 2.50,
      maxRegions: -1, // Unlimited
      features: [
        'Top 5 search result placement',
        '50,000+ guaranteed monthly views',
        'Real-time analytics & insights',
        'Unlimited regional coverage',
        '$2.50 per click rate',
        'Premium vendor badge',
        'Priority customer support',
        'Custom reporting dashboard'
      ]
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState<MarketingPlan | null>(null);

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'Essential':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'Targeted':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'Premium':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getPlanIconColor = (type: string) => {
    switch (type) {
      case 'Essential':
        return 'text-blue-600';
      case 'Targeted':
        return 'text-purple-600';
      case 'Premium':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  if (selectedPlan) {
    return (
      <PlanConfigurationView
        plan={selectedPlan}
        onBack={() => setSelectedPlan(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Marketing Plans</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-700">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-amber-600">Active</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">Premium</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <BarChart className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600">This Month</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">32,450</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-purple-600">Active</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Regions</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">12</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-amber-600">MTD</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Ad Spend</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">$2,450</p>
        </div>
      </div>

      {/* PPC Explainer Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg border border-blue-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Target className="w-8 h-8 text-blue-600 mr-3" />
            Qwillo Per-Click Advertising – The Smartest Way to Reach Buyers
          </h2>
          
          <div className="text-gray-600 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
                Why Per-Click Marketing?
              </h3>
              <p>
                Qwillo's Pay-Per-Click (PPC) model ensures you only pay for real engagement from highly motivated buyers—no wasted spending, no random impressions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Star className="w-5 h-5 text-blue-600 mr-2" />
                  How It Works:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <DollarSign className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Only Pay for Clicks → Your budget is only spent when someone actively clicks on your product or service.
                  </li>
                  <li className="flex items-start">
                    <MapPin className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Targeted Marketing → Ads only show in your selected states, counties, or cities—ensuring precise audience targeting.
                  </li>
                  <li className="flex items-start">
                    <Users className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Qualified Leads → Reach customers in the middle of active projects, ready to purchase materials, services, and solutions.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Star className="w-5 h-5 text-blue-600 mr-2" />
                  Why It's So Effective:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Users className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Direct Access to Decision-Makers → Your ad appears while contractors & customers are actively working on real projects.
                  </li>
                  <li className="flex items-start">
                    <BarChart className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Higher Conversion Rates → Since buyers are already shopping for project needs, clicks lead to purchases faster.
                  </li>
                  <li className="flex items-start">
                    <Target className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    No Guesswork → Ads reach verified buyers at the exact time they need your product/service.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Star className="w-5 h-5 text-blue-600 mr-2" />
                  Total Control & Flexibility:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <BarChart className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Live Dashboard Analytics → Track clicks, engagement, and conversion data in real-time.
                  </li>
                  <li className="flex items-start">
                    <DollarSign className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Adjust Budget Anytime → Increase, decrease, or pause your campaign instantly.
                  </li>
                  <li className="flex items-start">
                    <MapPin className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Modify Target Locations → Expand or refine your advertising area with ease.
                  </li>
                  <li className="flex items-start">
                    <Target className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    Start & Stop with One Click → No long-term contracts, total flexibility.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                Perfect for Vendors Who Want:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/50 p-3 rounded-lg border border-blue-100 flex items-center">
                  <Target className="w-4 h-4 text-blue-500 mr-2" />
                  <p className="text-sm text-gray-700">Guaranteed audience targeting</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg border border-blue-100 flex items-center">
                  <Users className="w-4 h-4 text-blue-500 mr-2" />
                  <p className="text-sm text-gray-700">Highly motivated buyers</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg border border-blue-100 flex items-center">
                  <DollarSign className="w-4 h-4 text-blue-500 mr-2" />
                  <p className="text-sm text-gray-700">Full control over budget & ad placement</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg border border-blue-100 flex items-center">
                  <BarChart className="w-4 h-4 text-blue-500 mr-2" />
                  <p className="text-sm text-gray-700">Real-time insights on performance</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-lg font-semibold text-blue-600 flex items-center justify-center">
                <Star className="w-6 h-6 mr-2" />
                Qwillo's PPC is built for maximum efficiency—powerful, flexible, and designed to drive real results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Available Marketing Plans</h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketingPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`relative rounded-lg border p-6 text-left transition-all duration-200 h-full flex flex-col ${
                getPlanColor(plan.type)
              }`}
            >
              {plan.type === 'Premium' && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-amber-400 text-amber-900 text-xs font-semibold rounded-full shadow-lg">
                  BEST VALUE
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg ${getPlanColor(plan.type)} flex items-center justify-center`}>
                  <Target className={`w-5 h-5 ${getPlanIconColor(plan.type)}`} />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${plan.clickCost.toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/click</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {plan.monthlyViews.toLocaleString()} monthly views
                  </p>

                  <ul className="mt-3 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Star className={`w-4 h-4 ${getPlanIconColor(plan.type)} mr-2 flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <div className="w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                  <span>Select Plan</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Important Notes */}
        <div className="px-6 pb-6">
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Important Notes</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>All plans include access to the analytics dashboard</li>
                    <li>Upgrade, downgrade, or cancel your plan at any time</li>
                    <li>Premium plan includes priority placement in search results</li>
                    <li>Contact support for custom enterprise plans</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};