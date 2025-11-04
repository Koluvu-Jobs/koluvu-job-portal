// src/app/dashboard/employee/subscription/page.js

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeSubscriptionPlans() {
  const router = useRouter();

  const handlePlanSelect = (planData) => {
    sessionStorage.setItem("selectedPlan", JSON.stringify(planData));
    router.push("/dashboard/employee/subscription/cart");
  };

  const plans = [
    {
      id: "ai-resume",
      name: "AI Resume Building",
      emoji: "",
      price: 99,
      period: "Quarter",
      color: "blue",
      features: [
        "Professionally structured resume",
        "Keyword optimized for ATS",
        "Instant resume score & tips",
      ],
    },
    {
      id: "ai-interviews",
      name: "AI Mock Interviews",
      emoji: "",
      price: 259,
      period: "Quarter",
      color: "purple",
      features: [
        "Practice real interview questions",
        "Role-specific Q&A powered by AI",
        "Get personalized feedback",
      ],
    },
    {
      id: "combo",
      name: "Combo Plan",
      emoji: "",
      price: 329,
      period: "Quarter",
      originalPrice: 358,
      savings: 29,
      color: "amber",
      popular: true,
      features: [
        "Resume Building + Mock Interviews",
        "All features from both plans",
        "Priority support",
      ],
    },
  ];

  const getCardClasses = (color) => {
    const baseClasses = "box flex flex-col h-[586px] w-[300px] rounded-[20px] mx-2.5 bg-white shadow-[0_1rem_2rem_rgba(0,0,0,0.2)] relative";
    return baseClasses;
  };

  const getTitleClasses = (color) => {
    const baseClasses = "title w-full py-2.5 text-xl font-light text-center rounded-t-[20px] text-white";
    const colorMap = {
      blue: "bg-blue-600",
      purple: "bg-purple-600", 
      amber: "bg-amber-600"
    };
    return `${baseClasses} ${colorMap[color]}`;
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
        
        * {
          font-family: "Poppins", sans-serif;
        }
        
        .pricing-section {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #F5F5F4;
          padding: 40px 20px;
        }
        
        .pricing-content {
          display: flex;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .box {
          display: flex;
          flex-direction: column;
          height: auto;
          min-height: 400px;
          width:300px;
          border-radius: 20px;
          margin: 0 15px;
          background: white;
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
          position: relative;
          transition: transform 0.3s ease;
        }
        
        .box:hover {
          transform: translateY(-5px);
        }
        
        .view {
          display: block;
          width: 100%;
          padding: 30px 0 20px;
          background: #F5F5F4;
        }
        
        .icon {
          display: flex;
          justify-content: center;
          font-size: 4rem;
          margin-bottom: 10px;
        }
        
        .cost {
          display: flex;
          justify-content: center;
          flex-direction: row;
          margin-top: 10px;
        }
        
        .amount {
          font-size: 2.8em;
          font-weight: bold;
          color: #333;
        }
        
        .detail {
          margin: auto 0 auto 5px;
          width: 70px;
          font-size: 0.7em;
          font-weight: bold;
          line-height: 15px;
          color: #7D7C7C;
        }
        
        .description {
          margin: 30px auto;
          font-size: 0.8em;
          color: #7D7C7C;
          padding: 0 20px;
          flex-grow: 1;
        }
        
        .description ul {
          list-style: none;
          padding: 0;
        }
        
        .description li {
          margin-top: 10px;
          position: relative;
          padding-left: 20px;
          font-size: 1.2em;
        }
        
        .description li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10B981;
          font-weight: bold;
          font-size: 1.3em;
        }
        
        .button {
          margin: 0 auto 30px;
        }
        
        .cta-button {
          height: 40px;
          width: 250px;
          font-size: 0.7em;
          font-weight: bold;
          letter-spacing: 0.5px;
          color: #7D7C7C;
          border: 2px solid #7D7C7C;
          border-radius: 50px;
          background: transparent;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .cta-button:hover {
          color: #F5F5F4;
          border: none;
          background: #FF7445;
          transform: scale(1.02);
        }
        
        .popular-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #FF7445;
          color: white;
          font-size: 0.7em;
          font-weight: bold;
          padding: 5px 10px;
          border-top-right-radius: 20px;
          border-bottom-left-radius: 10px;
        }
        
        .savings-text {
          color: #10B981;
          font-size: 0.75em;
          font-weight: 600;
          margin-top: 5px;
        }
        
        .free-benefits {
          max-width: 1200px;
          margin: 40px auto 0;
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
        }
        
        .free-benefits h3 {
          color: #2d3af3ff;
          font-size: 1.5em;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .free-benefits ul {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          list-style: none;
          font-size: 1.1em;
          padding: 0;
        }
        
        .free-benefits li {
          color: #7D7C7C;
          font-size: 0.9em;
          padding-left: 25px;
          position: relative;
        }
        
        .free-benefits li::before {
          content: "✅";
          position: absolute;
          left: 0;
          font-size: 1.1em;
        }
        
        .cta-text {
          text-align: center;
          margin-top: 40px;
          font-size: 1.2em;
          font-weight: 600;
          color: #4F46E5;
        }
        
        @media screen and (max-width: 970px) {
          .pricing-content {
            flex-direction: column;
            align-items: center;
          }
          
          .box {
            margin-bottom: 25px;
          }
          
          .pricing-section {
            padding: 20px 10px;
          }
        }
      `}</style>
      
      <div className="pricing-section">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-600 mb-4">
              Koluvu Employee Subscription Plans
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Boost your career with AI-powered tools and expert feedback.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="pricing-content">
            {plans.map((plan) => (
              <div key={plan.id} className={getCardClasses(plan.color)}>
                {plan.popular && (
                  <div className="popular-badge">POPULAR</div>
                )}
                
                <h2 className={getTitleClasses(plan.color)}>
                  {plan.emoji} {plan.name}
                </h2>
                
                <div className="view">
                  <div className="icon">
                    {plan.emoji}
                  </div>
                  <div className="cost">
                    <p className="amount">₹{plan.price}</p>
                    <p className="detail">per {plan.period.toLowerCase()}</p>
                  </div>
                  {plan.savings && (
                    <p className="savings-text text-center">
                      Save ₹{plan.savings} /- with this combo!
                    </p>
                  )}
                </div>
                
                <div className="description">
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="button">
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className="cta-button"
                  >
                    SELECT PLAN
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Free Benefits */}
          <div className="free-benefits">
            <h3>Free Benefits with Every Plan</h3>
            <ul>
              <li>ATS Optimizer - Match resume with job descriptions</li>
              <li>Gap Analysis - Skill gap insights & course suggestions</li>
              <li>Interview Feedback - Real feedback from employers</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="cta-text">
            🚀 Start Your Career Growth Journey Now!
          </div>
        </div>
      </div>
    </>
  );
}
