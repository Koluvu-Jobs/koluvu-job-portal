// src/app/dashboard/employee/subscription/success/page.js

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Mail } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [invoiceId, setInvoiceId] = useState("");

  useEffect(() => {
    const planData = sessionStorage.getItem("selectedPlan");
    const userData = sessionStorage.getItem("userInfo");
    const invoiceData = sessionStorage.getItem("invoiceId");
    const paymentComplete = sessionStorage.getItem("paymentComplete");

    if (planData && userData && invoiceData && paymentComplete) {
      setSelectedPlan(JSON.parse(planData));
      setUserInfo(JSON.parse(userData));
      setInvoiceId(invoiceData);
    } else {
      router.push("/dashboard/employee/subscription");
    }
  }, [router]);

  const handleNewPurchase = () => {
    // Clear all session data
    sessionStorage.removeItem("selectedPlan");
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("invoiceId");
    sessionStorage.removeItem("paymentComplete");

    router.push("/dashboard/employee/subscription");
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
          1
        </div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
          2
        </div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
          3
        </div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
          4
        </div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white">
          5
        </div>
      </div>
    </div>
  );

  if (!selectedPlan || !userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-2xl mx-auto">
        {renderStepIndicator()}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
          <h1 className="text-2xl font-bold mb-2 text-green-700">
            Payment Successful!
          </h1>
          <p className="mb-4 text-lg">
            Thank you for your purchase,{" "}
            <span className="font-semibold">{userInfo.name}</span>!
          </p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">{selectedPlan.name}</h2>
            <p className="text-gray-600 mb-1">Per {selectedPlan.period}</p>
            <p className="text-lg font-bold">₹{selectedPlan.price}/-</p>
            {selectedPlan.savings && (
              <p className="text-green-600 text-sm">
                You saved ₹{selectedPlan.savings}/-
              </p>
            )}
          </div>
          <div className="mb-6">
            <Mail className="inline-block mr-2 text-blue-600" />
            <span className="text-gray-700">
              Invoice ID: <span className="font-mono">{invoiceId}</span>
            </span>
          </div>
          <p className="mb-6 text-gray-700">
            A confirmation email has been sent to{" "}
            <span className="font-semibold">{userInfo.email}</span>.
          </p>
          <button
            onClick={handleNewPurchase}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Other Plans
          </button>
        </div>
        <p className="mt-8 text-center text-green-600 font-semibold">
          🚀 Your subscription is now active. Enjoy your benefits!
        </p>
      </div>
    </div>
  );
}
