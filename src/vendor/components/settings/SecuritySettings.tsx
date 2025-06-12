import React, { useState } from 'react';
import { Lock, Shield, Key, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: '30'
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving security settings:', formData);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Password Change */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-400" />
              <div className="ml-3">
                <label htmlFor="twoFactorEnabled" className="text-sm font-medium text-gray-900">Enable Two-Factor Authentication</label>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="twoFactorEnabled"
              checked={formData.twoFactorEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Session Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Session Settings</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                Session Timeout
              </label>
              <select
                id="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={(e) => setFormData(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="loginNotifications"
                checked={formData.loginNotifications}
                onChange={(e) => setFormData(prev => ({ ...prev, loginNotifications: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="loginNotifications" className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Login Notifications</span>
                <span className="block text-sm text-gray-500">Get notified of new login attempts</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Key className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Current Session</p>
                  <p className="text-sm text-gray-500">Portland, OR • Chrome on Windows</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active Now
              </span>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-700"
            >
              Sign out of all other sessions
            </button>
          </div>
        </div>
      </div>

      {/* Security Log */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Log</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <Lock className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">Password changed</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500">2 days ago</span>
            </div>
            <div className="flex items-center text-sm">
              <Shield className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">Two-factor authentication enabled</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500">5 days ago</span>
            </div>
            <div className="flex items-center text-sm">
              <AlertCircle className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-gray-900">Failed login attempt</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500">1 week ago</span>
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