import React, { useState } from 'react';
import { X, Target, Users, DollarSign, AlertCircle } from 'lucide-react';

interface AdCampaign {
  id: string;
  name: string;
  budget: number;
  clickBudget: number;
  maxClicks: number;
  startDate: string;
  endDate?: string;
  targeting: {
    audience: ('contractors' | 'customers')[];
  };
}

interface AdCampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaign: Omit<AdCampaign, 'id'>) => void;
  clickRate?: number;
}

export const AdCampaignForm: React.FC<AdCampaignFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clickRate = 2.50 // Default to premium rate if not specified
}) => {
  const [formData, setFormData] = useState({
    budget: 1000, // Default monthly budget
    clickBudget: clickRate,
    maxClicks: Math.floor(1000 / clickRate), // Calculate max clicks based on budget
    endDate: '',
    audience: [] as ('contractors' | 'customers')[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
    if (formData.audience.length === 0) newErrors.audience = 'At least one audience type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      name: 'Targeted Growth Plan', // Plan name is used as campaign name
      budget: formData.budget,
      clickBudget: formData.clickBudget,
      maxClicks: formData.maxClicks,
      startDate: new Date().toISOString().split('T')[0],
      endDate: formData.endDate || undefined,
      targeting: {
        audience: formData.audience
      }
    });
  };

  const handleBudgetChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      budget: value,
      maxClicks: Math.floor(value / clickRate)
    }));
  };

  const toggleAudience = (type: 'contractors' | 'customers') => {
    setFormData(prev => ({
      ...prev,
      audience: prev.audience.includes(type)
        ? prev.audience.filter(a => a !== type)
        : [...prev.audience, type]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <Target className="w-6 h-6 text-blue-600 mr-2" />
                Configure Campaign
              </h3>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Monthly Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Monthly Budget *
                    {errors.budget && <span className="ml-2 text-xs text-red-500">{errors.budget}</span>}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="budget"
                      min="0"
                      step="100"
                      value={formData.budget}
                      onChange={(e) => handleBudgetChange(parseFloat(e.target.value) || 0)}
                      className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.budget ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Estimated {formData.maxClicks.toLocaleString()} clicks at ${clickRate}/click
                  </p>
                </div>

                {/* Optional End Date */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300"
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                    {errors.audience && <span className="ml-2 text-xs text-red-500">{errors.audience}</span>}
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => toggleAudience('contractors')}
                      className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        formData.audience.includes('contractors')
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Users className="w-5 h-5 mx-auto mb-1" />
                      Contractors
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAudience('customers')}
                      className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        formData.audience.includes('customers')
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Users className="w-5 h-5 mx-auto mb-1" />
                      Customers
                    </button>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>You will only be charged when someone clicks on your ad</li>
                          <li>Unused budget rolls over to the next month</li>
                          <li>You can adjust your budget or pause the campaign anytime</li>
                          <li>Campaign applies to all your active products</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Start Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};