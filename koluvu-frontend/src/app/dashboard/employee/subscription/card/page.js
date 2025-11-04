// src/app/main/dashboard/employee/subscription/card/page.js

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const planData = sessionStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    } else {
      // Redirect back to plans if no plan selected
      router.push('/dashboard/employee/subscription');
    }
  }, [router]);

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">1</div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">2</div>
        <div className="w-8 h-0.5 bg-gray-300" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600">3</div>
        <div className="w-8 h-0.5 bg-gray-300" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600">4</div>
        <div className="w-8 h-0.5 bg-gray-300" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600">5</div>
      </div>
    </div>
  );

  if (!selectedPlan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto">
        {renderStepIndicator()}
        
        <div className="mb-4">
          <h1 className="text-center text-xl font-semibold text-gray-600">Your Cart</h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ShoppingCart className="mr-2" /> Your Cart
          </h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
                <p className="text-gray-600">Per {selectedPlan.period}</p>
              </div>
              <div className="text-right">
                {selectedPlan.originalPrice && (
                  <p className="text-gray-400 line-through text-sm">₹{selectedPlan.originalPrice}/-</p>
                )}
                <p className="text-lg font-bold">₹{selectedPlan.price}/-</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>₹{selectedPlan.price}/-</span>
              </div>
              {selectedPlan.savings && (
                <p className="text-green-600 text-sm mt-1">You save ₹{selectedPlan.savings}/-</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => router.push('/dashboard/employee/subscription')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Plans
            </button>
            <button 
              onClick={() => router.push('/dashboard/employee/subscription/review')}
              className="flex items-center flex-1 justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Continue to Review <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
