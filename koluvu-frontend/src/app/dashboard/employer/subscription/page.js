// src/app/dashboard/subscription/page.js

"use client";
import React, { useState } from "react";
import { FaCheck, FaTimes, FaDownload } from "react-icons/fa";

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' or 'yearly'
  const [billingHistory] = useState([
    {
      date: "October 26, 2023",
      description: "Professional Plan",
      amount: "₹999.00",
      status: "Paid",
    },
    {
      date: "September 26, 2023",
      description: "Professional Plan",
      amount: "₹999.00",
      status: "Paid",
      highlight: true,
    },
    {
      date: "August 26, 2023",
      description: "Basic Plan",
      amount: "₹499.00",
      status: "Paid",
    },
  ]);

  const plans = {
    basic: {
      title: "Koluvu Basic",
      monthlyPrice: 499,
      features: [
        "2 Job Postings",
        "100 Boolean Searches",
        "Basic ATS",
        "AI Candidate Matching",
        "Interview Scheduler",
      ],
      included: [true, true, true, false, false],
      buttonText: "Get Started",
    },
    professional: {
      title: "Koluvu Professional",
      monthlyPrice: 999,
      features: [
        "4 Job Postings",
        "500 Boolean Searches per day",
        "100 ATS",
        "200 AI Suggested Candidates",
        "Basic Interview Scheduler",
      ],
      included: [true, true, true, true, false],
      buttonText: "Upgrade",
      popular: true,
    },
    enterprise: {
      title: "Koluvu Enterprise",
      monthlyPrice: 1499,
      features: [
        "6 Job Postings",
        "Unlimited Boolean Searches per day",
        "Unlimited ATS",
        "Unlimited AI Suggested Candidates",
        "Full Interview Scheduler",
      ],
      included: [true, true, true, true, true],
      buttonText: "Contact Sales",
    },
  };

  const calculateYearlyPrice = (monthlyPrice) => {
    return Math.floor(monthlyPrice * 12 * 0.8); // 20% discount
  };

  const handlePlanSelect = (plan, cycle) => {
    alert(`You selected the ${plan.title} plan (${cycle} billing)`);
  };

  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-md overflow-hidden p-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Choose Your Subscription
          </h1>
          <p className="text-gray-600 text-lg">
            Select the plan that best fits your needs.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center items-center mt-4">
            <span
              className={`mr-3 ${
                billingCycle === "monthly"
                  ? "font-medium text-gray-900"
                  : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={toggleBillingCycle}
              className="relative inline-flex items-center h-6 rounded-full w-12 bg-blue-600 transition-colors focus:outline-none"
            >
              <span
                className={`${
                  billingCycle === "monthly" ? "translate-x-1" : "translate-x-7"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </button>
            <span
              className={`ml-3 ${
                billingCycle === "yearly"
                  ? "font-medium text-gray-900"
                  : "text-gray-500"
              }`}
            >
              Yearly{" "}
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-1">
                20% OFF
              </span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
          {/* Basic Plan */}
          <div className="flex-1 max-w-md border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {plans.basic.title}
              </h2>
              <div className="text-3xl font-bold text-blue-600">
                {billingCycle === "monthly" ? (
                  <>
                    ₹{plans.basic.monthlyPrice}
                    <small className="text-gray-500 text-base">/month</small>
                  </>
                ) : (
                  <>
                    ₹{calculateYearlyPrice(plans.basic.monthlyPrice)}
                    <small className="text-gray-500 text-base">/year</small>
                    <div className="text-sm text-gray-500 line-through mt-1">
                      ₹{plans.basic.monthlyPrice * 12}
                    </div>
                  </>
                )}
              </div>
            </div>
            <ul className="mb-6 space-y-3">
              {plans.basic.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center py-2 border-b border-gray-100"
                >
                  {plans.basic.included[index] ? (
                    <FaCheck className="text-blue-500 mr-3" />
                  ) : (
                    <FaTimes className="text-gray-400 mr-3" />
                  )}
                  <span
                    className={
                      plans.basic.included[index] ? "" : "text-gray-400"
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelect(plans.basic, billingCycle)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {plans.basic.buttonText}
            </button>
          </div>

          {/* Professional Plan */}
          <div className="flex-1 max-w-md border-2 border-blue-500 rounded-lg p-6 shadow-lg relative">
            {plans.professional.popular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                {plans.professional.title}
              </h2>
              <div className="text-3xl font-bold text-blue-600">
                {billingCycle === "monthly" ? (
                  <>
                    ₹{plans.professional.monthlyPrice}
                    <small className="text-gray-500 text-base">/month</small>
                  </>
                ) : (
                  <>
                    ₹{calculateYearlyPrice(plans.professional.monthlyPrice)}
                    <small className="text-gray-500 text-base">/year</small>
                    <div className="text-sm text-gray-500 line-through mt-1">
                      ₹{plans.professional.monthlyPrice * 12}
                    </div>
                  </>
                )}
              </div>
            </div>
            <ul className="mb-6 space-y-3">
              {plans.professional.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center py-2 border-b border-gray-100"
                >
                  {plans.professional.included[index] ? (
                    <FaCheck className="text-blue-500 mr-3" />
                  ) : (
                    <FaTimes className="text-gray-400 mr-3" />
                  )}
                  <span
                    className={
                      plans.professional.included[index] ? "" : "text-gray-400"
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelect(plans.professional, billingCycle)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {plans.professional.buttonText}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="flex-1 max-w-md border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {plans.enterprise.title}
              </h2>
              <div className="text-3xl font-bold text-blue-600">
                {billingCycle === "monthly" ? (
                  <>
                    ₹{plans.enterprise.monthlyPrice}
                    <small className="text-gray-500 text-base">/month</small>
                  </>
                ) : (
                  <>
                    ₹{calculateYearlyPrice(plans.enterprise.monthlyPrice)}
                    <small className="text-gray-500 text-base">/year</small>
                    <div className="text-sm text-gray-500 line-through mt-1">
                      ₹{plans.enterprise.monthlyPrice * 12}
                    </div>
                  </>
                )}
              </div>
            </div>
            <ul className="mb-6 space-y-3">
              {plans.enterprise.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center py-2 border-b border-gray-100"
                >
                  {plans.enterprise.included[index] ? (
                    <FaCheck className="text-blue-500 mr-3" />
                  ) : (
                    <FaTimes className="text-gray-400 mr-3" />
                  )}
                  <span
                    className={
                      plans.enterprise.included[index] ? "" : "text-gray-400"
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelect(plans.enterprise, billingCycle)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {plans.enterprise.buttonText}
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Billing History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingHistory.map((item, index) => (
                  <tr
                    key={index}
                    className={item.highlight ? "bg-blue-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
