import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, DollarSign, Star, AlertCircle } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    emailNotifications: {
      newOrders: true,
      productViews: false,
      lowStock: true,
      paymentReceived: true,
      customerMessages: true,
      marketingUpdates: false,
      weeklyReports: true,
      monthlyReports: true
    },
    pushNotifications: {
      newOrders: true,
      productViews: true,
      lowStock: true,
      paymentReceived: true,
      customerMessages: true
    },
    emailDigestFrequency: 'daily'
  });

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving notification settings:', formData);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Email Notifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <label htmlFor="newOrders" className="text-sm font-medium text-gray-900">New Orders</label>
                  <p className="text-sm text-gray-500">Get notified when a new order is placed</p>
                </div>
              </div>
              <input
                type="checkbox"
                id="newOrders"
                checked={formData.emailNotifications.newOrders}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    newOrders: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <label htmlFor="productViews" className="text-sm font-medium text-gray-900">Product Views</label>
                  <p className="text-sm text-gray-500">Get notified when your products receive significant views</p>
                </div>
              </div>
              <input
                type="checkbox"
                id="productViews"
                checked={formData.emailNotifications.productViews}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    productViews: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <label htmlFor="lowStock" className="text-sm font-medium text-gray-900">Low Stock Alerts</label>
                  <p className="text-sm text-gray-500">Get notified when product stock is running low</p>
                </div>
              </div>
              <input
                type="checkbox"
                id="lowStock"
                checked={formData.emailNotifications.lowStock}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    lowStock: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <label htmlFor="customerMessages" className="text-sm font-medium text-gray-900">Customer Messages</label>
                  <p className="text-sm text-gray-500">Get notified when you receive customer messages</p>
                </div>
              </div>
              <input
                type="checkbox"
                id="customerMessages"
                checked={formData.emailNotifications.customerMessages}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    customerMessages: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          <div className="p-4 space-y-4">
            {Object.entries(formData.pushNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <label htmlFor={`push-${key}`} className="text-sm font-medium text-gray-900">
                      {key.split(/(?=[A-Z])/).join(' ')}
                    </label>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id={`push-${key}`}
                  checked={value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pushNotifications: {
                      ...prev.pushNotifications,
                      [key]: e.target.checked
                    }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Digest Frequency */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Digest Frequency</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="daily"
                name="digest-frequency"
                value="daily"
                checked={formData.emailDigestFrequency === 'daily'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emailDigestFrequency: e.target.value
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="daily" className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Daily Digest</span>
                <span className="block text-sm text-gray-500">Get a summary of your store's activity every day</span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="weekly"
                name="digest-frequency"
                value="weekly"
                checked={formData.emailDigestFrequency === 'weekly'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emailDigestFrequency: e.target.value
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="weekly" className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Weekly Digest</span>
                <span className="block text-sm text-gray-500">Get a summary of your store's activity every week</span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="none"
                name="digest-frequency"
                value="none"
                checked={formData.emailDigestFrequency === 'none'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emailDigestFrequency: e.target.value
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="none" className="ml-3">
                <span className="block text-sm font-medium text-gray-900">No Digest</span>
                <span className="block text-sm text-gray-500">Don't send me digest emails</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};