import React from 'react';

export const metadata = {
  title: 'Subscription',
};

export default function SubscriptionLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  );
}
