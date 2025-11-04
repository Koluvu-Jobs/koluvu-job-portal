// src/app/main/dashboard/employer/components/SettingsModal.js
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const SettingsModal = ({ showModal, onClose }) => {
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedTimeZone, setSelectedTimeZone] = useState("(GMT) London");
  const [currentTab, setCurrentTab] = useState("general");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@company.com",
      role: "Admin",
      lastActive: "2023-06-15T10:30:00",
      status: "active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@company.com",
      role: "Recruiter",
      lastActive: "2023-06-14T15:45:00",
      status: "active"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@company.com",
      role: "Interviewer",
      lastActive: "2023-06-10T09:15:00",
      status: "pending"
    }
  ]);

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Recruiter");
  const [securityLogs, setSecurityLogs] = useState([
    {
      id: 1,
      email: "john@company.com",
      action: "Login",
      ip: "192.168.1.1",
      device: "MacBook Pro (Chrome)",
      timestamp: "2023-06-15T10:30:00",
      location: "New York, US"
    },
    {
      id: 2,
      email: "jane@company.com",
      action: "Login",
      ip: "203.0.113.42",
      device: "iPhone (Safari)",
      timestamp: "2023-06-14T15:45:00",
      location: "London, UK"
    },
    {
      id: 3,
      email: "john@company.com",
      action: "Failed Login",
      ip: "198.51.100.75",
      device: "Unknown (Firefox)",
      timestamp: "2023-06-12T04:20:00",
      location: "Tokyo, Japan"
    }
  ]);

  const roles = ["Admin", "Recruiter", "Interviewer", "Viewer"];

  const saveSettings = () => {
    console.log("Settings saved", {
      emailNotificationsEnabled,
      pushNotificationsEnabled,
      selectedLanguage,
      selectedTimeZone,
      twoFactorEnabled,
      teamMembers
    });
    onClose();
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      console.log("Password changed successfully");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      console.error("Passwords don't match");
    }
  };

  const inviteTeamMember = () => {
    if (newMemberEmail && newMemberRole) {
      const newMember = {
        id: teamMembers.length + 1,
        name: "",
        email: newMemberEmail,
        role: newMemberRole,
        lastActive: "",
        status: "pending"
      };
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail("");
      setNewMemberRole("Recruiter");
    }
  };

  const updateMemberRole = (id, newRole) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, role: newRole } : member
    ));
  };

  const removeTeamMember = (id) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            className={`rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl bg-white`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                  <i className="fas fa-gear text-white text-lg"></i>
                </div>
                <h3 className={`text-2xl font-bold text-gray-800`}>Settings</h3>
              </div>
              <button
                onClick={onClose}
                className={`text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full`}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className={`flex mb-6 border-b border-gray-200`}>
              <button
                className={`px-4 py-2 font-medium ${currentTab === "general" ? 'text-blue-600 border-blue-600 border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setCurrentTab("general")}
              >
                General
              </button>
              <button
                className={`px-4 py-2 font-medium ${currentTab === "notifications" ? 'text-blue-600 border-blue-600 border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setCurrentTab("notifications")}
              >
                Notifications
              </button>
              <button
                className={`px-4 py-2 font-medium ${currentTab === "security" ? 'text-blue-600 border-blue-600 border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setCurrentTab("security")}
              >
                Security
              </button>
              <button
                className={`px-4 py-2 font-medium ${currentTab === "teams" ? 'text-blue-600 border-blue-600 border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setCurrentTab("teams")}
              >
                Teams
              </button>
            </div>

            <div className="space-y-6">
              {currentTab === "general" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-800 flex items-center">
                    <i className="fas fa-sliders-h mr-2 text-blue-500"></i>
                    General Settings
                  </h4>
                  <div className="space-y-4">

                    <div className="p-4 rounded-xl shadow-sm bg-white">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Language
                      </label>
                      <div className="relative">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="block w-full p-3 pr-10 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <i className="fas fa-chevron-down text-gray-400"></i>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl shadow-sm bg-white">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Time Zone
                      </label>
                      <div className="relative">
                        <select
                          value={selectedTimeZone}
                          onChange={(e) => setSelectedTimeZone(e.target.value)}
                          className="block w-full p-3 pr-10 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          <option value="(GMT) London">(GMT) London</option>
                          <option value="(GMT+1) Paris">(GMT+1) Paris</option>
                          <option value="(GMT+2) Cairo">(GMT+2) Cairo</option>
                          <option value="(GMT+3) Moscow">(GMT+3) Moscow</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <i className="fas fa-globe text-gray-400"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "notifications" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-800 flex items-center">
                    <i className="fas fa-bell mr-2 text-purple-500"></i>
                    Notification Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl shadow-sm bg-white">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg mr-3 bg-green-100">
                          <i className="fas fa-envelope text-green-500"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive email alerts</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotificationsEnabled}
                          onChange={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl shadow-sm bg-white">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg mr-3 bg-purple-100">
                          <i className="fas fa-bell text-purple-500"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive browser notifications</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={pushNotificationsEnabled}
                          onChange={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "security" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-800 flex items-center">
                    <i className="fas fa-shield-alt mr-2 text-red-500"></i>
                    Security Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl shadow-sm bg-white">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg mr-3 bg-red-100">
                          <i className="fas fa-lock text-red-500"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={twoFactorEnabled}
                          onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    <div className="p-4 rounded-xl shadow-sm bg-white">
                      <h5 className="font-medium mb-4 text-gray-800">Change Password</h5>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "teams" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 flex items-center">
                      <i className="fas fa-users mr-2 text-indigo-500"></i>
                      Team Management
                    </h4>
                    <div className="mt-4 rounded-xl shadow-sm p-6 bg-white">
                      <h5 className="font-medium mb-4 text-gray-800">Invite Team Members</h5>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="w-full sm:w-48">
                          <label className="block text-sm font-medium mb-1 text-gray-700">
                            Role
                          </label>
                          <select
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {roles.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={inviteTeamMember}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                          >
                            Invite
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl shadow-sm overflow-hidden bg-white">
                    <h5 className="font-medium p-6 pb-0 text-gray-800">Team Members</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Active</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y bg-white divide-gray-200">
                          {teamMembers.map((member) => (
                            <tr key={member.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {member.name || "Pending"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {member.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <select
                                  value={member.role}
                                  onChange={(e) => updateMemberRole(member.id, e.target.value)}
                                  className="border rounded-md px-2 py-1 text-sm bg-white border-gray-300"
                                >
                                  {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {member.lastActive ? new Date(member.lastActive).toLocaleString() : "Never"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  member.status === "active" ? "bg-green-100 text-green-800" :
                                  member.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {member.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => removeTeamMember(member.id)}
                                  className="text-red-600 hover:text-red-900 mr-4"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="rounded-xl shadow-sm overflow-hidden bg-white">
                    <h5 className="font-medium p-6 pb-0 text-gray-800">Security Logs</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">IP Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Device</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y bg-white divide-gray-200">
                          {securityLogs.map((log) => (
                            <tr key={log.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {log.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  log.action.includes("Failed") ? "bg-red-100 text-red-800" :
                                  "bg-green-100 text-green-800"
                                }`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {log.ip}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {log.device}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {log.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
