//src/app/main/dashboard/employee/verification/VerificationStatus.js

"use client";
import React from "react";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@koluvu/components/ui/button";
import { motion } from "framer-motion";

export default function VerificationStatus({ status, onReset }) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-blue-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center"
      >
        {status.success ? (
          <>
            <div className="relative">
              <div className="absolute -inset-2 bg-blue-100 rounded-full blur-md opacity-75"></div>
              <CheckCircle className="relative w-16 h-16 text-green-500 mx-auto mb-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Verification Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Your {status.type === 'uan' ? 'UAN' : 
                status.type === 'form16' ? 'Form 16' : 'Fresher'} 
              verification is being processed. You'll receive an email confirmation shortly.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                Amount Paid: ₹{status.price}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="absolute -inset-2 bg-red-100 rounded-full blur-md opacity-75"></div>
              <XCircle className="relative w-16 h-16 text-red-500 mx-auto mb-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{status.message}</p>
          </>
        )}
        
        <Button 
          onClick={onReset}
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          {status.success ? (
            <>
              <span>View Dashboard</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          ) : (
            'Try Again'
          )}
        </Button>
      </motion.div>
    </div>
  );
}
