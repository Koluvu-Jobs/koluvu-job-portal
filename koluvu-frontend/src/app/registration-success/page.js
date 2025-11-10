"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function RegistrationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/auth/login/employee");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful! 🎉
          </h1>
          <p className="text-gray-600">
            Your account has been created successfully. Please check your email
            for verification.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Next Steps:</strong>
            <br />
            1. Check your email for verification code
            <br />
            2. Verify your email address
            <br />
            3. Login to your account
          </p>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Redirecting to login page in 3 seconds...
        </div>

        <button
          onClick={() => router.push("/auth/login/employee")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login Now
        </button>
      </div>
    </div>
  );
}
