import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Mail, 
  Phone, 
  Lock, 
  Globe, 
  Clock, 
  Save,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    security: true,
    appearance: true,
    emailNotifications: true,
    pushNotifications: true,
    systemSettings: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Profile settings
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@firstnationalbank.com',
    phone: '(555) 123-4567',
    jobTitle: 'Loan Officer',
    department: 'Construction Financing',
    
    // Security settings
    twoFactorEnabled: true,
    sessionTimeout: '30',
    
    // Appearance settings
    theme: 'system',
    
    // Email notification settings
    emailNewApprovals: true,
    emailInspectionScheduled: true,
    emailInspectionCompleted: true,
    emailPaymentReleased: true,
    emailDailyDigest: false,
    emailWeeklyReport: true,
    
    // Push notification settings
    pushNewApprovals: true,
    pushInspectionScheduled: true,
    pushInspectionCompleted: true,
    pushPaymentReleased: true,
    
    // System settings
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'en-US'
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    console.log('Saving settings:', formData);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'system'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('system')}
            >
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                System
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-220px)] overflow-y-auto will-change-scroll overscroll-behavior-y-contain custom-scrollbar">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('personalInfo')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    Personal Information
                  </h3>
                  {expandedSections.personalInfo ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </div>
                
                {expandedSections.personalInfo && (
                  <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            <Mail className="h-4 w-4" />
                          </span>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            <Phone className="h-4 w-4" />
                          </span>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          id="jobTitle"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Settings */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('security')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    Security Settings
                  </h3>
                  {expandedSections.security ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </div>
                
                {expandedSections.security && (
                  <div className="p-6 bg-white">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="twoFactorEnabled"
                            name="twoFactorEnabled"
                            checked={formData.twoFactorEnabled}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-900">
                            {formData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                          Session Timeout (minutes)
                        </label>
                        <select
                          id="sessionTimeout"
                          name="sessionTimeout"
                          value={formData.sessionTimeout}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>
                      
                      <div>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Appearance Settings */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('appearance')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Monitor className="h-5 w-5 text-blue-600 mr-2" />
                    Appearance
                  </h3>
                  {expandedSections.appearance ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </div>
                
                {expandedSections.appearance && (
                  <div className="p-6 bg-white">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Theme
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <div 
                            className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                              formData.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setFormData({...formData, theme: 'light'})}
                          >
                            <Sun className="h-6 w-6 text-gray-700 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Light</span>
                          </div>
                          <div 
                            className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                              formData.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setFormData({...formData, theme: 'dark'})}
                          >
                            <Moon className="h-6 w-6 text-gray-700 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Dark</span>
                          </div>
                          <div 
                            className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                              formData.theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setFormData({...formData, theme: 'system'})}
                          >
                            <Monitor className="h-6 w-6 text-gray-700 mb-2" />
                            <span className="text-sm font-medium text-gray-900">System</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('emailNotifications')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-2" />
                    Email Notifications
                  </h3>
                  {expandedSections.emailNotifications ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </div>
                
                {expandedSections.emailNotifications && (
                  <div className="p-6 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">New Approval Requests</h4>
                          <p className="text-sm text-gray-500">Get notified when a new payment approval is requested</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailNewApprovals"
                            name="emailNewApprovals"
                            checked={formData.emailNewApprovals}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Inspection Scheduled</h4>
                          <p className="text-sm text-gray-500">Get notified when an inspection is scheduled</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailInspectionScheduled"
                            name="emailInspectionScheduled"
                            checked={formData.emailInspectionScheduled}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Inspection Completed</h4>
                          <p className="text-sm text-gray-500">Get notified when an inspection is completed</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailInspectionCompleted"
                            name="emailInspectionCompleted"
                            checked={formData.emailInspectionCompleted}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Payment Released</h4>
                          <p className="text-sm text-gray-500">Get notified when a payment is released</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailPaymentReleased"
                            name="emailPaymentReleased"
                            checked={formData.emailPaymentReleased}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Daily Digest</h4>
                          <p className="text-sm text-gray-500">Receive a daily summary of all activities</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailDailyDigest"
                            name="emailDailyDigest"
                            checked={formData.emailDailyDigest}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Weekly Report</h4>
                          <p className="text-sm text-gray-500">Receive a weekly summary report</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailWeeklyReport"
                            name="emailWeeklyReport"
                            checked={formData.emailWeeklyReport}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Push Notifications */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('pushNotifications')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Bell className="h-5 w-5 text-blue-600 mr-2" />
                    Push Notifications
                  </h3>
                  {expandedSections.pushNotifications ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </div>
                
                {expandedSections.pushNotifications && (
                  <div className="p-6 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">New Approval Requests</h4>
                          <p className="text-sm text-gray-500">Get notified when a new payment approval is requested</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="pushNewApprovals"
                            name="pushNewApprovals"
                            checked={formData.pushNewApprovals}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Inspection Scheduled</h4>
                          <p className="text-sm text-gray-500">Get notified when an inspection is scheduled</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="pushInspectionScheduled"
                            name="pushInspectionScheduled"
                            checked={formData.pushInspectionScheduled}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Inspection Completed</h4>
                          <p className="text-sm text-gray-500">Get notified when an inspection is completed</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="pushInspectionCompleted"
                            name="pushInspectionCompleted"
                            checked={formData.pushInspectionCompleted}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Payment Released</h4>
                          <p className="text-sm text-gray-500">Get notified when a payment is released</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="pushPaymentReleased"
                            name="pushPaymentReleased"
                            checked={formData.pushPaymentReleased}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('systemSettings')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 text-blue-600 mr-2" />
                    System Settings
                  </h3>
                  {expandedSections.systemSettings ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </div>
                
                {expandedSections.systemSettings && (
                  <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                          Timezone
                        </label>
                        <select
                          id="timezone"
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="America/Anchorage">Alaska Time (AKT)</option>
                          <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                          Date Format
                        </label>
                        <select
                          id="dateFormat"
                          name="dateFormat"
                          value={formData.dateFormat}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                          Language
                        </label>
                        <select
                          id="language"
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                          <option value="es-ES">Spanish</option>
                          <option value="fr-FR">French</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Save Button */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            {saveSuccess && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Settings saved successfully</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};