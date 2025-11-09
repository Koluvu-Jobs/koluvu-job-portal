// src/app/dashboard/employer/subscription/success/page.js

"use client";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaDownload, FaEnvelope, FaPrint } from "react-icons/fa";

const SuccessPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userDetails"));
    const storedPlan = JSON.parse(localStorage.getItem("selectedPlan"));

    setUserDetails(storedUser);
    setSelectedPlan(storedPlan);
  }, []);

  const generateInvoiceNumber = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `INV-2025-${randomNum}`;
  };

  const downloadInvoice = () => {
    alert("Invoice downloaded successfully!");
  };

  const sendEmailInvoice = () => {
    alert(`Invoice sent to ${userDetails?.email}`);
  };

  const printInvoice = () => {
    window.print();
  };

  const goToDashboard = () => {
    const username = userDetails?.username;
    window.location.href = username
      ? `/dashboard/employer/${username}`
      : "/dashboard/employer";
  };

  if (!userDetails || !selectedPlan) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden p-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Your subscription has been activated successfully.
          </p>
        </div>

        {/* Invoice Details */}
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Invoice</h2>
              <p className="text-gray-600">#{generateInvoiceNumber()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Invoice Date</p>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* Bill To */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Bill To:</h3>
              <div className="text-gray-600">
                <p className="font-medium">{userDetails.name}</p>
                <p>{userDetails.company}</p>
                <p>{userDetails.email}</p>
                <p className="mt-2">{userDetails.address}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Payment Details:
              </h3>
              <div className="text-gray-600">
                <p>
                  <span className="font-medium">Method:</span> Credit Card
                </p>
                <p>
                  <span className="font-medium">Transaction ID:</span> TXN
                  {Math.floor(100000000 + Math.random() * 900000000)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Completed
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t pt-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">
                        {selectedPlan.title} Plan
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedPlan.billingCycle === "monthly"
                          ? "Monthly"
                          : "Yearly"}{" "}
                        subscription
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ₹{selectedPlan.price}
                  </td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-lg text-blue-600">
                    ₹{selectedPlan.price}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={downloadInvoice}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FaDownload className="mr-2" /> Download Invoice
          </button>
          <button
            onClick={sendEmailInvoice}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FaEnvelope className="mr-2" /> Email Invoice
          </button>
          <button
            onClick={printInvoice}
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FaPrint className="mr-2" /> Print Invoice
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">What's Next?</h3>
          <div className="text-blue-700 space-y-2">
            <p>• Your {selectedPlan.title} plan is now active</p>
            <p>• Access all premium features from your dashboard</p>
            <p>• Invoice has been sent to {userDetails.email}</p>
            <p>
              • Next billing date:{" "}
              {new Date(
                Date.now() +
                  (selectedPlan.billingCycle === "monthly" ? 30 : 365) *
                    24 *
                    60 *
                    60 *
                    1000
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="text-center">
          <button
            onClick={goToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Need help? Contact our support team at support@yourcompany.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
