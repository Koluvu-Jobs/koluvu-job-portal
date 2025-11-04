// src/app/dashboard/employer/proxying-detector/page.js

"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-hot-toast";

export default function ProxyingDetectorPage() {
  const { darkMode } = useTheme();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchRecentScans();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('🔍 Fetching dashboard data...');
      const response = await fetch('/api/employer/proxy-scans/dashboard');
      console.log('📡 Dashboard response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dashboard data received:', data);
        setDashboardData(data);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch dashboard data:', response.status, errorText);
        
        // If unauthorized, show helpful message
        if (response.status === 401) {
          toast.error('Please login with proxy test account: employer_proxy_test');
        } else {
          toast.error('Failed to load dashboard data');
        }
      }
    } catch (error) {
      console.error('🚨 Error fetching dashboard data:', error);
      toast.error('Network error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentScans = async () => {
    try {
      console.log('📋 Fetching recent scans...');
      const response = await fetch('/api/employer/proxy-scans?limit=10');
      console.log('📡 Recent scans response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Recent scans data received:', data);
        setRecentScans(data.results || data);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch recent scans:', response.status, errorText);
        
        // If unauthorized, show helpful message
        if (response.status === 401) {
          toast.error('Authentication required for proxy detection');
        } else {
          toast.error('Failed to load recent scans');
        }
      }
    } catch (error) {
      console.error('🚨 Error fetching recent scans:', error);
      toast.error('Network error loading recent scans');
    }
  };

  const handleScan = async () => {
    if (!ipAddress.trim()) {
      toast.error('Please enter an IP address to scan');
      return;
    }

    setIsScanning(true);
    setScanResults(null);

    try {
      const response = await fetch('/api/employer/proxy-scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip_address: ipAddress.trim(),
          user_agent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setScanResults(data);
        
        // Show result message
        if (data.is_proxy || data.is_vpn || data.is_tor) {
          toast.error(`Proxy/VPN detected! Risk level: ${data.risk_level}`);
        } else {
          toast.success('Clean connection detected');
        }

        // Refresh dashboard and recent scans
        fetchDashboardData();
        fetchRecentScans();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Scan failed');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to perform scan');
    } finally {
      setIsScanning(false);
    }
  };

  const handleQuickScan = async () => {
    setIpAddress(""); // Clear manual IP
    setIsScanning(true);
    setScanResults(null);

    try {
      // Use client's IP (backend will detect it)
      const response = await fetch('/api/employer/proxy-scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_agent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setScanResults(data);
        setIpAddress(data.ip_address); // Show the detected IP
        
        if (data.is_proxy || data.is_vpn || data.is_tor) {
          toast.error(`Proxy/VPN detected! Risk level: ${data.risk_level}`);
        } else {
          toast.success('Clean connection detected');
        }

        fetchDashboardData();
        fetchRecentScans();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Scan failed');
      }
    } catch (error) {
      console.error('Quick scan error:', error);
      toast.error('Failed to perform quick scan');
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading proxy detector...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Proxying Detector
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
            Detect proxy usage and ensure candidate authenticity during interviews
          </p>
          
          {/* Login Reminder for Testing */}
          {!dashboardData && !loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                <div>
                  <p className="text-blue-800 font-medium">Testing Proxy Detection System</p>
                  <p className="text-blue-700 text-sm mt-1">
                    Please login with test account: <strong>employer_proxy_test</strong> / <strong>test123</strong>
                  </p>
                  <a 
                    href="/auth/login/employer" 
                    className="text-blue-600 hover:text-blue-800 text-sm underline mt-1 inline-block"
                  >
                    Go to Login Page →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <i className="fas fa-search text-blue-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Scans</p>
                  <p className="text-2xl font-bold">{dashboardData.statistics.total_scans}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <i className="fas fa-shield-alt text-red-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Proxies Detected</p>
                  <p className="text-2xl font-bold">{dashboardData.statistics.proxy_detected}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <i className="fas fa-eye-slash text-yellow-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">VPNs Detected</p>
                  <p className="text-2xl font-bold">{dashboardData.statistics.vpn_detected}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <i className="fas fa-check-circle text-green-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Clean Connections</p>
                  <p className="text-2xl font-bold">{dashboardData.statistics.clean_connections}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-xl font-semibold mb-4">
              <i className="fas fa-search mr-2"></i>
              Proxy Detection Scanner
            </h2>
            
            <div className="space-y-4">
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Scan IP addresses to detect proxy usage and ensure interview integrity.
              </p>

              {/* IP Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  IP Address (optional)
                </label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="Enter IP address or leave blank for auto-detection"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                />
              </div>

              {/* Scan Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleScan}
                  disabled={isScanning || !ipAddress.trim()}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    isScanning || !ipAddress.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  } text-white`}
                >
                  {isScanning ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Scanning...
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      Scan IP
                    </>
                  )}
                </button>

                <button
                  onClick={handleQuickScan}
                  disabled={isScanning}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    isScanning
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  } text-white`}
                >
                  {isScanning ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Scanning...
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-bolt mr-2"></i>
                      Quick Scan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-xl font-semibold mb-4">
              <i className="fas fa-clipboard-list mr-2"></i>
              Scan Results
            </h2>
            
            {scanResults ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">IP Address:</span>
                  <span className={`font-mono ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {scanResults.ip_address}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Proxy Detected:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    scanResults.is_proxy ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}>
                    {scanResults.is_proxy ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">VPN Detected:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    scanResults.is_vpn ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}>
                    {scanResults.is_vpn ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Tor Network:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    scanResults.is_tor ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}>
                    {scanResults.is_tor ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Location:</span>
                  <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {scanResults.location_string || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Risk Level:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(scanResults.risk_level)}`}>
                    {scanResults.risk_level}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Threat Score:</span>
                  <span className={`font-bold ${
                    scanResults.threat_score >= 70 ? "text-red-600" :
                    scanResults.threat_score >= 50 ? "text-yellow-600" : "text-green-600"
                  }`}>
                    {scanResults.threat_score}/100
                  </span>
                </div>

                {scanResults.isp && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">ISP:</span>
                    <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                      {scanResults.isp}
                    </span>
                  </div>
                )}

                {/* Alerts */}
                {scanResults.alerts && scanResults.alerts.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Security Alerts:</h3>
                    <div className="space-y-2">
                      {scanResults.alerts.map((alert, index) => (
                        <div key={index} className={`p-3 rounded border-l-4 ${
                          alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                          alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                          'border-blue-500 bg-blue-50'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{alert.title}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No scan results available. Run a scan to see results.
              </p>
            )}
          </div>
        </div>

        {/* Recent Scans Section */}
        {recentScans.length > 0 && (
          <div className={`mt-8 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-xl font-semibold mb-4">
              <i className="fas fa-history mr-2"></i>
              Recent Scans
            </h2>
            
            <div className="overflow-x-auto">
              <table className={`min-w-full ${darkMode ? "text-white" : "text-gray-900"}`}>
                <thead>
                  <tr className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <th className="text-left py-2 px-4">IP Address</th>
                    <th className="text-left py-2 px-4">Location</th>
                    <th className="text-left py-2 px-4">Risk Level</th>
                    <th className="text-left py-2 px-4">Proxy/VPN</th>
                    <th className="text-left py-2 px-4">Scan Time</th>
                    <th className="text-left py-2 px-4">Alerts</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.slice(0, 5).map((scan, index) => (
                    <tr key={index} className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <td className="py-2 px-4 font-mono text-sm">{scan.ip_address}</td>
                      <td className="py-2 px-4 text-sm">{scan.location_string || "Unknown"}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(scan.risk_level)}`}>
                          {scan.risk_level}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex space-x-1">
                          {scan.is_proxy && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Proxy</span>}
                          {scan.is_vpn && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">VPN</span>}
                          {scan.is_tor && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Tor</span>}
                          {!scan.is_proxy && !scan.is_vpn && !scan.is_tor && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Clean</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {new Date(scan.started_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-4">
                        {scan.alert_count > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            {scan.alert_count} alerts
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className={`mt-8 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">
            <i className="fas fa-info-circle mr-2"></i>
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-search text-blue-600"></i>
              </div>
              <h3 className="font-medium mb-2">Multi-API Analysis</h3>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Uses multiple free APIs to cross-verify proxy and VPN detection
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-shield-alt text-purple-600"></i>
              </div>
              <h3 className="font-medium mb-2">Threat Intelligence</h3>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Analyzes IP reputation and threat scores for comprehensive assessment
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
              <h3 className="font-medium mb-2">Real-time Results</h3>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Provides instant feedback with detailed security alerts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-chart-bar text-yellow-600"></i>
              </div>
              <h3 className="font-medium mb-2">Analytics & Tracking</h3>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Maintains detailed logs and statistics for security monitoring
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
