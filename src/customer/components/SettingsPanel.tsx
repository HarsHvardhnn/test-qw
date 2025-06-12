import React, { useEffect, useState } from 'react';
import { 
  User, 
  Bell, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  Save,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  MapPin,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft
} from 'lucide-react';
import axiosInstance from '../../axios';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';

interface SettingsPanelProps {
  onBack?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    communication: true,
    notifications: true,
    security: true
  });

  const {showLoader,hideLoader}=useLoader()
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 90210',
    
    // Communication Preferences
    language: 'en-US',
    timezone: 'America/New_York',
    
    // Project Notifications
    taskCompletionAlerts: true,
    paymentMilestoneReminders: true,
    inspectionNotifications: true,
    contractorMessages: true,
    
    // Communication Settings
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,

    // Password Change
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        showLoader()
        const response = await axiosInstance.get(`/auth/v2/profile`);
        setFormData(response.data);
      } catch (err) {
toast.error("Failed to fetch profile")      } finally {
hideLoader()      }

    };

     fetchProfile();
  }, []);
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

  const updateUserProfile = async (formData:any) => {
    try {
      showLoader()
      // Send only valid fields
      const response = await axiosInstance.put("/auth/v2/profile", formData);
      toast.success("Profile Updated")
      console.log("✅ Profile Updated:", response.data);
      return response.data; // Return updated user data
    } catch (error: any) {
      console.error("❌ Error updating profile:", error.response?.data || error.message);
      throw error;
    }finally{
      hideLoader()
    }
  };

  const handleSaveSettings = async () => {
    // In a real app, this would save to a backend
    console.log('Saving settings:', formData);
    
    await updateUserProfile(formData)
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          Last updated: Just now
        </div>
      </div>

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
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Address
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div 
            className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('security')}
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Lock className="h-5 w-5 text-blue-600 mr-2" />
              Password & Security
            </h3>
            {expandedSections.security ? 
              <ChevronUp className="h-5 w-5 text-gray-500" /> : 
              <ChevronDown className="h-5 w-5 text-gray-500" />
            }
          </div>
          
          {expandedSections.security && (
            <div className="p-6 bg-white">
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
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
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
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
                  <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters long and include a number and special character.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Communication Preferences */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div 
            className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('communication')}
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Globe className="h-5 w-5 text-blue-600 mr-2" />
              Communication Preferences
            </h3>
            {expandedSections.communication ? 
              <ChevronUp className="h-5 w-5 text-gray-500" /> : 
              <ChevronDown className="h-5 w-5 text-gray-500" />
            }
          </div>
          
          {expandedSections.communication && (
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="es-ES">Español</option>
                    <option value="fr-FR">Français</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Zone
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
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div 
            className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('notifications')}
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Bell className="h-5 w-5 text-blue-600 mr-2" />
              Notification Settings
            </h3>
            {expandedSections.notifications ? 
              <ChevronUp className="h-5 w-5 text-gray-500" /> : 
              <ChevronDown className="h-5 w-5 text-gray-500" />
            }
          </div>
          
          {expandedSections.notifications && (
            <div className="p-6 bg-white">
              <div className="space-y-6">
                {/* Project Notifications */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Project Updates</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Task Completion Alerts</p>
                        <p className="text-sm text-gray-500">Get notified when project tasks are completed</p>
                      </div>
                      <input
                        type="checkbox"
                        id="taskCompletionAlerts"
                        name="taskCompletionAlerts"
                        checked={formData.taskCompletionAlerts}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Payment Milestone Reminders</p>
                        <p className="text-sm text-gray-500">Get notified about upcoming payments</p>
                      </div>
                      <input
                        type="checkbox"
                        id="paymentMilestoneReminders"
                        name="paymentMilestoneReminders"
                        checked={formData.paymentMilestoneReminders}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Inspection Notifications</p>
                        <p className="text-sm text-gray-500">Get notified about scheduled inspections</p>
                      </div>
                      <input
                        type="checkbox"
                        id="inspectionNotifications"
                        name="inspectionNotifications"
                        checked={formData.inspectionNotifications}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Contractor Messages</p>
                        <p className="text-sm text-gray-500">Get notified about new messages</p>
                      </div>
                      <input
                        type="checkbox"
                        id="contractorMessages"
                        name="contractorMessages"
                        checked={formData.contractorMessages}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Methods */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Methods</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates in your browser</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        id="pushNotifications"
                        name="pushNotifications"
                        checked={formData.pushNotifications}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">SMS Alerts</p>
                          <p className="text-sm text-gray-500">Receive updates via text message</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        id="smsAlerts"
                        name="smsAlerts"
                        checked={formData.smsAlerts}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex items-center justify-end">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Settings saved successfully</span>
          </div>
        )}
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
  );
};