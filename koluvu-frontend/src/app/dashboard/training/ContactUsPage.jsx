// src/app/main/dashboard/training/ContactUsPage.jsx
'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';

const ContactUsPage = () => {
  return (
    <div className="space-y-6">
      {/* Contact Information Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Contact Information</h2>
            <p className="text-sm text-gray-500 mt-2">Get in touch with our support team</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Info Card 1 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FaEnvelope className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800">Email</h3>
              </div>
              <p className="text-gray-600 text-sm">support@koluvu.com</p>
              <p className="text-gray-600 text-sm mt-1">info@koluvu.com</p>
            </div>

            {/* Contact Info Card 2 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <FaPhone className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800">Phone</h3>
              </div>
              <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
              <p className="text-gray-600 text-sm mt-1">+1 (555) 987-6543</p>
            </div>

            {/* Contact Info Card 3 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <FaMapMarkerAlt className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800">Address</h3>
              </div>
              <p className="text-gray-600 text-sm">123 Education Blvd</p>
              <p className="text-gray-600 text-sm">San Francisco, CA 94107</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Contact Form</h2>
            <p className="text-sm text-gray-500 mt-2">Send us a message directly</p>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subject"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
            >
              Send Message
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Social Media Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Connect With Us</h2>
            <p className="text-sm text-gray-500 mt-2">Follow us on social media</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <a href="#" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
              <FaFacebook className="text-xl" />
            </a>
            <a href="#" className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors shadow-sm">
              <FaTwitter className="text-xl" />
            </a>
            <a href="#" className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors shadow-sm">
              <FaLinkedin className="text-xl" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUsPage;
