// src/app/main/dashboard/training/AccountSettingsPage.jsx
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaBell,
  FaShieldAlt,
  FaSignOutAlt
} from 'react-icons/fa';

const AccountSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    organization: 'Tech Solutions Inc.',
    website: 'www.techsolutions.com',
    notifications: true,
    twoFactor: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to your backend
    alert('Settings saved successfully!');
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaUser className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleInputChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <FaPhone className="text-purple-600 text-xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Website Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <FaGlobe className="text-green-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Website Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaGlobe className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm text-sm font-medium"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        );

      case 'security':
        return (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Security</h2>
              
              {/* Password Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <FaLock className="text-red-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword || ''}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword || ''}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword || ''}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-Factor Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaShieldAlt className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-blue-500 text-lg" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">
                        {formData.twoFactor ? 'Currently enabled' : 'Currently disabled'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="twoFactor"
                      checked={formData.twoFactor || false}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Add an extra layer of security to your account
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm text-sm font-medium"
                >
                  Save Security Settings
                </button>
              </div>
            </div>
          </form>
        );

      case 'notifications':
        return (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Notifications</h2>
              
              {/* Email Notifications Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FaEnvelope className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Email Notifications</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Course updates</p>
                      <p className="text-xs text-gray-500">Receive updates about your courses</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="courseUpdates"
                        checked={formData.notifications || false}
                        onChange={() => setFormData(prev => ({...prev, notifications: !prev.notifications}))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">New messages</p>
                      <p className="text-xs text-gray-500">Get notified about new messages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="newMessages"
                        checked={formData.notifications || false}
                        onChange={() => setFormData(prev => ({...prev, notifications: !prev.notifications}))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment reminders</p>
                      <p className="text-xs text-gray-500">Receive payment due date reminders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="paymentReminders"
                        checked={formData.notifications || false}
                        onChange={() => setFormData(prev => ({...prev, notifications: !prev.notifications}))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Push Notifications Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaBell className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Push Notifications</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">New enrollments</p>
                      <p className="text-xs text-gray-500">Get alerts for new course enrollments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="newEnrollments"
                        checked={formData.notifications || false}
                        onChange={() => setFormData(prev => ({...prev, notifications: !prev.notifications}))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Course reminders</p>
                      <p className="text-xs text-gray-500">Receive reminders about upcoming classes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="courseReminders"
                        checked={formData.notifications || false}
                        onChange={() => setFormData(prev => ({...prev, notifications: !prev.notifications}))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm text-sm font-medium"
                >
                  Save Notification Settings
                </button>
              </div>
            </div>
          </form>
        );

      case 'logout':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Logout</h2>
            
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-5">
                <FaSignOutAlt className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Are you sure you want to logout?</h3>
              <p className="text-sm text-gray-500 mb-6">You'll need to sign in again to access your account</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="px-6 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  Cancel
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-sm text-sm font-medium">
                  Logout
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Account Settings</h2>
            <p className="text-sm text-gray-500 mt-2">
              Manage your account information and preferences
            </p>
          </div>
          
          {/* Navigation Tabs - Horizontal Layout with Colorful Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Profile Tab */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-4 rounded-lg transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-white border-t-4 border-blue-500 shadow-md'
                  : 'bg-white hover:shadow-md border-t-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  activeTab === 'profile' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-blue-50 text-blue-500'
                }`}>
                  <FaUser className="text-xl" />
                </div>
                <div className="text-left">
                  <h3 className={`text-sm font-medium ${
                    activeTab === 'profile' ? 'text-blue-700' : 'text-gray-700'
                  }`}>Profile</h3>
                  <p className={`text-xs ${
                    activeTab === 'profile' ? 'text-blue-500' : 'text-gray-500'
                  }`}>Personal details</p>
                </div>
              </div>
            </button>

            {/* Security Tab */}
            <button
              onClick={() => setActiveTab('security')}
              className={`p-4 rounded-lg transition-all duration-200 ${
                activeTab === 'security'
                  ? 'bg-white border-t-4 border-green-500 shadow-md'
                  : 'bg-white hover:shadow-md border-t-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  activeTab === 'security' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-green-50 text-green-500'
                }`}>
                  <FaLock className="text-xl" />
                </div>
                <div className="text-left">
                  <h3 className={`text-sm font-medium ${
                    activeTab === 'security' ? 'text-green-700' : 'text-gray-700'
                  }`}>Security</h3>
                  <p className={`text-xs ${
                    activeTab === 'security' ? 'text-green-500' : 'text-gray-500'
                  }`}>Password & auth</p>
                </div>
              </div>
            </button>

            {/* Notifications Tab */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`p-4 rounded-lg transition-all duration-200 ${
                activeTab === 'notifications'
                  ? 'bg-white border-t-4 border-purple-500 shadow-md'
                  : 'bg-white hover:shadow-md border-t-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  activeTab === 'notifications' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-purple-50 text-purple-500'
                }`}>
                  <FaBell className="text-xl" />
                </div>
                <div className="text-left">
                  <h3 className={`text-sm font-medium ${
                    activeTab === 'notifications' ? 'text-purple-700' : 'text-gray-700'
                  }`}>Notifications</h3>
                  <p className={`text-xs ${
                    activeTab === 'notifications' ? 'text-purple-500' : 'text-gray-500'
                  }`}>Alerts & emails</p>
                </div>
              </div>
            </button>

            {/* Logout Tab */}
            <button
              onClick={() => setActiveTab('logout')}
              className={`p-4 rounded-lg transition-all duration-200 ${
                activeTab === 'logout'
                  ? 'bg-white border-t-4 border-red-500 shadow-md'
                  : 'bg-white hover:shadow-md border-t-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  activeTab === 'logout' 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-red-50 text-red-500'
                }`}>
                  <FaSignOutAlt className="text-xl" />
                </div>
                <div className="text-left">
                  <h3 className={`text-sm font-medium ${
                    activeTab === 'logout' ? 'text-red-700' : 'text-gray-700'
                  }`}>Logout</h3>
                  <p className={`text-xs ${
                    activeTab === 'logout' ? 'text-red-500' : 'text-gray-500'
                  }`}>Sign out</p>
                </div>
              </div>
            </button>
          </div>

          {/* Main Content Area */}
          <div>
            {renderTabContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsPage;
