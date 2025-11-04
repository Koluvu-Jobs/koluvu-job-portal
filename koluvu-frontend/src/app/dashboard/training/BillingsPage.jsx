//src/app/main/dashboard/training/BillingsPage.jsx
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Check, Zap, RefreshCw, ShieldCheck, BadgeCheck } from 'lucide-react';

const TrainingBilling = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isYearly, setIsYearly] = useState(true); // Default to yearly for better value

  const plans = [
    {
      name: 'Monthly',
      price: '₹1,999',
      postings: 2,
      validity: '30 Days',
      popular: false,
      savings: '',
      features: ['Basic analytics', 'Email support', '2 active postings'],
    },
    {
      name: 'Quarterly',
      price: '₹5,999',
      postings: 4,
      validity: '90 Days',
      popular: false,
      savings: 'Save 10%',
      features: ['All monthly features', 'Priority support', '4 active postings'],
    },
    {
      name: 'Half-Yearly',
      price: '₹7,999',
      postings: 8,
      validity: '6 Months',
      popular: true,
      savings: 'Save 20%',
      features: ['All quarterly features', 'Advanced analytics', '8 active postings'],
    },
    {
      name: 'Yearly',
      price: '₹9,999',
      postings: 14,
      validity: '1 Year',
      popular: false,
      savings: 'Save 30%',
      features: [
        'All half-yearly features',
        '24/7 premium support',
        'Featured listings',
        '14 active postings',
      ],
    },
  ];

  const features = [
    'Real-time posting analytics',
    'Multi-user access',
    'Custom branding',
    'API access',
    'Bulk posting tools',
  ];

  const testimonials = [
    {
      name: 'Rajesh K.',
      role: 'Training Manager',
      content: 'The yearly plan saved us 30% and the featured listings doubled our enrollment rates!',
    },
    {
      name: 'Priya M.',
      role: 'Course Director',
      content: 'Switching to the half-yearly plan was the best decision. The ROI is incredible.',
    },
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    // In a real app, you would redirect to checkout or show a modal
  };

  const toggleBillingCycle = () => {
    setIsYearly(!isYearly);
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Training Program Subscriptions
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan to showcase your training programs and reach more learners.
              Scale as your training business grows.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 p-1 rounded-full inline-flex">
              <button
                onClick={toggleBillingCycle}
                className={`px-6 py-2 rounded-full font-medium transition ${!isYearly ? 'bg-white shadow-md text-blue-600' : 'text-gray-600'}`}
              >
                Monthly
              </button>
              <button
                onClick={toggleBillingCycle}
                className={`px-6 py-2 rounded-full font-medium transition ${isYearly ? 'bg-white shadow-md text-blue-600' : 'text-gray-600'}`}
              >
                Yearly <span className="text-sm text-green-600 ml-1">(Save 30%)</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative border rounded-2xl p-6 transition-all hover:shadow-xl ${plan.popular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'} ${selectedPlan?.name === plan.name ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                {plan.savings && (
                  <div className="absolute -top-3 right-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    {plan.savings}
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-500">/{plan.validity}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {plan.postings} postings included
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  {selectedPlan?.name === plan.name ? 'Selected' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Compare Plan Features
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-6 text-left font-medium text-gray-700">Features</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="py-4 px-6 text-center font-medium text-gray-700">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-4 px-6 text-gray-700">{feature}</td>
                      {plans.map((plan) => (
                        <td key={plan.name} className="py-4 px-6 text-center">
                          {plan.postings >= 8 ? (
                            <Check className="h-5 w-5 text-green-500 inline" />
                          ) : plan.postings >= 4 ? (
                            idx < 3 ? (
                              <Check className="h-5 w-5 text-green-500 inline" />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )
                          ) : idx < 2 ? (
                            <Check className="h-5 w-5 text-green-500 inline" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Usage Policy */}
          <div className="bg-blue-50 rounded-xl p-6 mb-16">
            <div className="flex items-start mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-600 mr-2 mt-0.5" />
              <h3 className="text-xl font-bold text-blue-800">Usage Policy & Benefits</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-700 mb-3">📌 Posting Guidelines</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                      <Zap className="h-4 w-4" />
                    </span>
                    <span>
                      A <strong>posting</strong> refers to one course/training listing on Koluvu.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                      <RefreshCw className="h-4 w-4" />
                    </span>
                    <span>Each posting remains active during the subscription validity.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                    <span>Postings can be edited or updated within the active period.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-3">💡 Plan Flexibility</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                      <span className="font-bold">!</span>
                    </span>
                    <span>
                      Unused postings do <strong>not</strong> carry forward to the next billing cycle.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                      <span className="font-bold">↑</span>
                    </span>
                    <span>You may upgrade your plan anytime with adjusted balance.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                      <span className="font-bold">$</span>
                    </span>
                    <span>Volume discounts available for institutions with 10+ trainers.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              What Our Customers Say
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  question: 'Can I change my plan later?',
                  answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, we\'ll prorate the difference. Downgrades take effect at your next billing cycle.',
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, UPI payments, net banking, and PayPal for international transactions.',
                },
                {
                  question: 'Is there a free trial available?',
                  answer: 'We offer a 14-day free trial for new users with limited posting capabilities. No credit card required to start the trial.',
                },
                {
                  question: 'How do I cancel my subscription?',
                  answer: 'You can cancel anytime from your account settings. Cancellations take effect at the end of your current billing period with no additional charges.',
                },
              ].map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition">
                    <span className="font-medium text-gray-900">{item.question}</span>
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="p-4 bg-white text-gray-700">{item.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingBilling;
