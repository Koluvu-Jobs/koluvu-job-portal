//src/app/main/dashboard/employee/verification/VerificationBenefits.js

import React from "react";
import { Shield, Eye, Trophy, CheckCircle, Users, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from "@koluvu/components/ui/card";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Build Trust",
    description: "Employers prefer verified candidates by 78% more than unverified ones"
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "More Visibility",
    description: "Verified profiles appear 3x more in search results"
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Professional Edge",
    description: "Stand out from competition with verified credentials"
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Show Authenticity",
    description: "Prove your credentials are real and verified"
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Network Better",
    description: "Gain credibility with peers and recruiters"
  },
  {
    icon: <BadgeCheck className="w-5 h-5" />,
    title: "Higher Response Rate",
    description: "Get 2.5x more responses from employers"
  }
];

function VerificationBenefits() {
  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium tracking-wide shadow-sm">
            Why Get Verified?
          </span>
          <h2 className="mt-4 text-xl md:text-2xl font-semibold text-gray-900 text-center max-w-2xl">
            Unlock exclusive benefits and stand out to employers
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
                {React.cloneElement(benefit.icon, { className: 'w-6 h-6' })}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2 text-center">{benefit.title}</h3>
              <p className="text-gray-600 text-sm text-center">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default VerificationBenefits;
