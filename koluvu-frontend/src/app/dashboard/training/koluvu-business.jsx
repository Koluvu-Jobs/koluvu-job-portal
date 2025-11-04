// src\app\main\dashboard\training\koluvu-business.jsx

const plans = [
  {
    name: "Koluvu Basic",
    icon: "🚀",
    price: "₹2,999",
    period: "/month",
    description: "Perfect launchpad for growing institutes",
    details: "Ideal for institutes with 1-50 students looking to establish their digital presence",
    benefits: [
      "Brand Building Foundation",
      "Streamlined Operations",
      "Cost-Effective Growth"
    ],
    features: [
      { name: "2 Professional Posts Monthly", included: true },
      { name: "Unlimited Resume Collection", included: true },
      { name: "4 Training Program Updates", included: true },
      { name: "Email Support", included: true },
      { name: "Internship Management", included: false },
      { name: "Advanced Analytics", included: false },
      { name: "Bulk Communication Tools", included: false }
    ],
    button: { text: "START WITH BASIC", color: "bg-gradient-to-r from-blue-500 to-blue-700" }
  },
  {
    name: "Koluvu Elite",
    icon: "⭐",
    price: "₹4,999",
    period: "/month",
    description: "Accelerate growth with advanced features",
    details: "Perfect for institutes with 51-200 students ready to expand their opportunities",
    benefits: [
      "Internship Opportunities",
      "Real-time Notifications",
      "Priority Support",
      "Enhanced Visibility"
    ],
    features: [
      { name: "4 Professional Posts Monthly", included: true },
      { name: "6 Training Program Updates", included: true },
      { name: "Internship Management System", included: true },
      { name: "Website Notifications", included: true },
      { name: "Full Candidate Profile Access", included: false },
      { name: "Placement Management", included: false },
      { name: "Bulk SMS & Email", included: false }
    ],
    mostPopular: true,
    button: { text: "CHOOSE ELITE PLAN", color: "bg-green-600" }
  },
  {
    name: "Koluvu Business",
    icon: "👑",
    price: "₹8,999",
    period: "/month",
    description: "Complete enterprise solution",
    details: "Comprehensive solution for established institutes with 200+ students",
    benefits: [
      "Complete Placement Ecosystem",
      "Mass Communication Power",
      "Dedicated Account Manager",
      "Advanced Analytics"
    ],
    features: [
      { name: "6 Professional Posts Monthly", included: true },
      { name: "8 Training Program Updates", included: true },
      { name: "Complete Candidate Profile Access", included: true },
      { name: "Placement Management System", included: true },
      { name: "Bulk SMS (1,000/month)", included: true },
      { name: "Bulk Email (5,000/month)", included: true },
      { name: "Custom Branding", included: true },
      { name: "Advanced search", included: true }
    ],
    button: { text: "GO BUSINESS", color: "bg-gradient-to-r from-yellow-500 to-orange-600" }
  }
];

const reasons = [
  {
    icon: "📈",
    title: "Increase Placement Rates",
    description: "Our clients see an average 40% improvement in student placement rates within 6 months of implementation."
  },
  {
    icon: "⚡",
    title: "Streamlined Operations",
    description: "Reduce administrative work by 60% with automated resume collection, notifications, and candidate management."
  },
  {
    icon: "🎯",
    title: "Better Employer Connections",
    description: "Connect with more employers through our integrated communication tools and professional presentation features."
  }
];

const KoluvuBusiness = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="w-full bg-[#253347] py-16 px-4 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Koluvu Training Platform</h1>
        <p className="text-lg md:text-xl text-white/80 text-center max-w-2xl">Comprehensive solutions designed to scale your training institute<br />and maximize student placement success</p>
      </div>

      {/* Growth Plan Section */}
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#253347] text-center mb-4">Choose Your Subscription Plan</h2>
        <p className="text-lg text-[#253347]/80 text-center max-w-2xl mb-8">Each plan is carefully designed to meet your institute's specific needs and growth stage,<br />with features that deliver measurable results</p>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
          {plans.map((plan, idx) => (
            <div key={plan.name} className={`bg-white border rounded-2xl shadow-lg p-8 flex-1 flex flex-col items-center relative ${plan.mostPopular ? 'border-blue-500' : 'border-gray-200'}`}
                 style={{ minWidth: 280 }}>
              {plan.mostPopular && (
                <span className="absolute top-6 right-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">MOST POPULAR</span>
              )}
              <div className="mb-4 text-4xl">{plan.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-[#253347] text-center">{plan.name}</h3>
              <p className="text-gray-600 text-center mb-2">{plan.description}</p>
              <div className="text-3xl font-bold text-[#253347] mb-1">{plan.price}<span className="text-lg font-normal">{plan.period}</span></div>
              <p className="text-gray-500 text-center mb-4">{plan.details}</p>
              {/* Benefits */}
              <div className="mb-4 w-full">
                <h4 className="font-semibold text-[#253347] mb-2 text-left">{idx === 0 ? 'Key Benefits' : idx === 1 ? 'Enhanced Benefits' : 'Premium Benefits'}</h4>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className={`rounded-lg px-3 py-2 text-sm ${idx === 2 ? 'bg-yellow-50 border-l-4 border-yellow-400' : idx === 1 ? 'bg-green-50 border-l-4 border-green-400' : 'bg-blue-50 border-l-4 border-blue-400'}`}>{benefit}</li>
                  ))}
                </ul>
              </div>
              {/* Features */}
              <div className="mb-6 w-full">
                <h4 className="font-semibold text-[#253347] mb-2 text-left">{idx === 0 ? 'Features Included' : idx === 1 ? 'Everything in Basic, Plus' : 'Complete Feature Set'}</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <span className="text-green-500 text-lg">&#10003;</span>
                      ) : (
                        <span className="text-red-400 text-lg">&#10007;</span>
                      )}
                      <span className={feature.included ? "" : "text-gray-400 line-through"}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={`w-full py-3 mt-auto rounded-lg font-bold text-white text-lg shadow ${plan.button.color} hover:opacity-90 transition`}>
                {plan.button.text}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Koluvu Section */}
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#253347] text-center mb-4">Why Training Institutes Choose Koluvu</h2>
        <p className="text-lg text-[#253347]/80 text-center max-w-2xl mb-8">Our platform delivers measurable results that drive student success and institute growth</p>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col items-center bg-white rounded-2xl shadow p-8 flex-1">
              <div className="mb-4 text-4xl">{reason.icon}</div>
              <h3 className="text-xl font-bold text-[#253347] mb-2 text-center">{reason.title}</h3>
              <p className="text-gray-600 text-center">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KoluvuBusiness;
