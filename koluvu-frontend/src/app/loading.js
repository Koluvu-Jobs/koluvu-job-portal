// app/some-route/loading.js
"use client";

import React from 'react';
import Lottie from 'lottie-react';
import sandyLoadingAnimation from '@koluvu/components/Loading/Sandy-Loading.json';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-64 h-64">
        <Lottie 
          animationData={sandyLoadingAnimation} 
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}
