// src/app/main/dashboard/training/LogoutPage.jsx
'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faShieldAlt,
  faLock,
  faUserClock,
  faHistory,
  faDesktop,
  faMobileAlt,
  faTabletAlt
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, this would call your logout API and clear session
    alert('You have been logged out successfully!');
    router.push('/login');
  };

  const getDeviceIcon = (deviceType) => {
    switch(deviceType.toLowerCase()) {
      case 'macbook pro':
        return <FontAwesomeIcon icon={faDesktop} className="text-gray-600 mr-2" />;
      case 'iphone 13':
        return <FontAwesomeIcon icon={faMobileAlt} className="text-gray-600 mr-2" />;
      case 'ipad':
        return <FontAwesomeIcon icon={faTabletAlt} className="text-gray-600 mr-2" />;
      default:
        return <FontAwesomeIcon icon={faDesktop} className="text-gray-600 mr-2" />;
    }
  };

  const sessionActivities = [
    { id: 1, device: 'MacBook Pro', type: 'desktop', location: 'San Francisco, CA', time: 'Currently active', active: true },
    { id: 2, device: 'iPhone 13', type: 'mobile', location: 'New York, NY', time: '5 days ago', active: false },
    { id: 3, device: 'iPad', type: 'tablet', location: 'London, UK', time: '2 weeks ago', active: false }
  ];

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm rounded-xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Logout Card */}
            <div className="lg:flex-1">
              <div className="bg-gradient-to-br from-red-50 via-white to-red-50 rounded-xl p-6 mb-6 border border-red-100">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-md border-4 border-red-100">
                    <FontAwesomeIcon 
                      icon={faSignOutAlt} 
                      className="w-8 h-8 text-red-600" 
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                      Secure Logout
                    </h2>
                    <p className="text-gray-600 max-w-md">
                      Confirm to end your current session and protect your account
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-red-500 w-5 h-5 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Security First</h4>
                      <p className="text-sm text-gray-600">
                        Always log out when using shared or public devices to prevent unauthorized access.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
                    <FontAwesomeIcon icon={faLock} className="text-blue-500 w-5 h-5 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Data Protection</h4>
                      <p className="text-sm text-gray-600">
                        Your information remains encrypted and secure. Log back in anytime to access your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 text-sm font-medium transition-all shadow-sm flex-1 sm:flex-none flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                    Confirm Logout
                  </button>
                </div>
              </div>

              {/* Security Tips */}
              <div className="mt-6">
                <Card className="border border-gray-200 rounded-xl">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />
                      Security Best Practices
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex gap-3 items-start">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <span>Enable two-factor authentication for enhanced security</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <span>Regularly review active sessions and log out unfamiliar devices</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        <span>Use a password manager to create and store strong passwords</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                        <span>Be cautious of phishing attempts and suspicious emails</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Session Information */}
            <div className="lg:w-96 flex-shrink-0">
              <Card className="border border-gray-200 rounded-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FontAwesomeIcon icon={faUserClock} className="text-blue-500 w-5 h-5" />
                    <h3 className="font-bold text-gray-800">Your Active Sessions</h3>
                  </div>

                  <div className="space-y-4">
                    {sessionActivities.map((session) => (
                      <div 
                        key={session.id} 
                        className={`p-4 rounded-lg transition-all ${session.active ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {getDeviceIcon(session.device)}
                            <div>
                              <p className="font-medium text-gray-800">{session.device}</p>
                              <p className="text-xs text-gray-500">{session.location}</p>
                            </div>
                          </div>
                          {session.active ? (
                            <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Active Now
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">{session.time}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <FontAwesomeIcon icon={faHistory} className="w-3 h-3" />
                          <span>{session.active ? 'Currently in use' : `Last active ${session.time}`}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                      View complete session history
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutPage;
