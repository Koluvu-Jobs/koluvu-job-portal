// src/app/dashboard/employer/subscription/cart/page.js

"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Cart = () => {
  const router = useRouter();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("selectedPlan");
    if (stored) {
      setPlan(JSON.parse(stored));
    } else {
      router.replace("/dashboard/employer/subscription");
    }
  }, [router]);

  const goToReview = () => {
    router.push("/dashboard/employer/subscription/review");
  };

  const goBackToPlan = () => {
    router.push("/dashboard/employer/subscription/plans");
  };

  const removeFromCart = () => {
    localStorage.removeItem("selectedPlan");
    goBackToPlan();
  };

  const calculateTotal = () => (plan ? plan.price : 0);

  if (!plan) return null; // waiting for hydration / redirect

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Your Cart</h1>
          <p className="text-gray-600">
            Review your selected plan before proceeding.
          </p>
        </div>

        <div className="space-y-6">
          {/* Cart Items */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="font-semibold text-gray-800">Selected Plan</h3>
            </div>
            <div className="p-6 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {plan.title} Plan
                </h4>
                <p className="text-gray-600 mb-2">
                  Billing:{" "}
                  {plan.billingCycle === "monthly" ? "Monthly" : "Yearly"}
                  {plan.billingCycle === "yearly" && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      20% OFF
                    </span>
                  )}
                </p>
                <div className="text-sm text-gray-500">
                  <p>• {plan.features?.length || 0} features included</p>
                  <p>
                    • Next billing:{" "}
                    {new Date(
                      Date.now() +
                        (plan.billingCycle === "monthly" ? 30 : 365) *
                          24 *
                          60 *
                          60 *
                          1000
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  ₹{plan.price}
                </p>
                <p className="text-gray-500">
                  /{plan.billingCycle === "monthly" ? "month" : "year"}
                </p>
                <div className="flex mt-2 space-x-2">
                  <button
                    onClick={goBackToPlan}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={removeFromCart}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Remove"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="font-semibold text-gray-800">Price Summary</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="text-lg font-bold text-blue-600">
                  ₹{calculateTotal()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={goBackToPlan}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Plans
            </button>
            <button
              onClick={goToReview}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Proceed to Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
