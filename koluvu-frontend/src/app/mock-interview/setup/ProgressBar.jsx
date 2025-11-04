// src/app/mai/mock-interview/setup/components/ProgressBar.jsx

"use client";

const steps = [
  { label: "Personal" },
  { label: "Setup" },
  { label: "Confirm" },
];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="w-full mb-6">
      {/* Clean Simple Progress */}
      <div className="flex items-center justify-center space-x-8">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const active = currentStep === stepNumber;
          const completed = currentStep > stepNumber;
          
          return (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Simple Step Indicator */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "bg-blue-600 text-white"
                    : completed
                    ? "bg-gray-400 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {completed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                
                {/* Step Label */}
                <span className={`text-xs mt-1.5 font-medium transition-colors duration-200 ${
                  active 
                    ? "text-blue-600" 
                    : completed 
                    ? "text-gray-500" 
                    : "text-gray-400"
                }`}>
                  {step.label}
                </span>
              </div>
              
              {/* Simple Connecting Line */}
              {idx < steps.length - 1 && (
                <div className="w-16 h-px bg-gray-200 mx-6 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gray-400 transition-all duration-300 ${
                    completed ? "translate-x-0" : "-translate-x-full"
                  }`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile: Just show current step */}
      <div className="md:hidden text-center">
        <div className="flex justify-center items-center space-x-1.5 mb-2">
          {steps.map((_, idx) => {
            const stepNumber = idx + 1;
            const active = currentStep === stepNumber;
            const completed = currentStep > stepNumber;
            
            return (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  active
                    ? "bg-blue-600"
                    : completed
                    ? "bg-gray-400"
                    : "bg-gray-200"
                }`}
              />
            );
          })}
        </div>
        <div className="text-sm text-gray-600">
          {steps[currentStep - 1]?.label} ({currentStep}/{steps.length})
        </div>
      </div>
    </div>
  );
}
