// src/app/main/dashboard/employee/account-settings/EmployeeAccountSettings.js

"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@koluvu/components/ui/card";
import { Input } from "@koluvu/components/ui/input";
import { Label } from "@koluvu/components/ui/label";
import { Button } from "@koluvu/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@koluvu/components/ui/tabs";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiLock } from "react-icons/fi";

export default function EmployeeAccountSettings({ user = {} }) {
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    linkedin: user?.linkedin || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Add actual form submission logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar would be here */}
        
        {/* Main Content Container - moved closer to left */}
        <div className="flex-1 pl-0 md:pl-4 lg:pl-6 margin-left:40px"> {/* Adjusted left padding */}
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Account Settings
            </h1>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2 bg-color:red">
                  <FiUser size={16} /> Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <FiLock size={16} /> Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="border rounded-lg shadow-sm">
                  <CardHeader className="border-b p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Update your personal details and contact information
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FiUser size={16} /> Full Name
                          </Label>
                          <Input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FiMail size={16} /> Email
                          </Label>
                          <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FiPhone size={16} /> Phone
                          </Label>
                          <Input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FiMapPin size={16} /> Location
                          </Label>
                          <Input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <FiLinkedin size={16} /> LinkedIn URL
                        </Label>
                        <Input
                          name="linkedin"
                          value={form.linkedin}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="pt-2">
                        <Button type="submit" className="w-full md:w-auto">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="border rounded-lg shadow-sm">
                  <CardHeader className="border-b p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Security Settings
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Manage your password and account security
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <FiLock size={16} /> Current Password
                        </Label>
                        <Input
                          name="currentPassword"
                          type="password"
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FiLock size={16} /> New Password
                          </Label>
                          <Input
                            name="newPassword"
                            type="password"
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <FiLock size={16} /> Confirm Password
                          </Label>
                          <Input
                            name="confirmPassword"
                            type="password"
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button type="submit" className="w-full md:w-auto">
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Side - Optional Additional Content */}
        <div className="hidden xl:block w-80 pl-8 pr-6 py-8"> {/* Adjusted to be less prominent */}
          <Card className="border rounded-lg shadow-sm sticky top-8">
            <CardHeader className="border-b p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Account Overview
              </h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                  <p className="text-sm font-medium">January 15, 2023</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last updated</p>
                  <p className="text-sm font-medium">May 22, 2023</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account status</p>
                  <p className="text-sm font-medium text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
