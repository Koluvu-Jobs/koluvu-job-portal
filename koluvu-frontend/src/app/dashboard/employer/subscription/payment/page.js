// src/app/dashboard/employer/subscription/payment/page.js

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCreditCard, FaUniversity, FaWallet, FaLock } from "react-icons/fa";

const PaymentPage = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingDetails, setBillingDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan");
    const storedBilling = localStorage.getItem("userDetails");
    if (storedPlan && storedBilling) {
      setSelectedPlan(JSON.parse(storedPlan));
      setBillingDetails(JSON.parse(storedBilling));
    } else {
      router.replace("/dashboard/employer/subscription/review");
    }
  }, [router]);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const match = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    return !match
      ? ""
      : [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D+/g, "");
    const match = cleaned.match(/(\d{0,2})(\d{0,2})/);
    return !match ? "" : match[2] ? `${match[1]}/${match[2]}` : match[1];
  };

  const handleCardChange = (field, value) => {
    let formattedValue = value;
    if (field === "number") formattedValue = formatCardNumber(value);
    if (field === "expiry") formattedValue = formatExpiry(value);
    if (field === "cvv") formattedValue = value.replace(/\D/g, "").slice(0, 3);
    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const validatePayment = () => {
    if (paymentMethod === "card") {
      const { number, expiry, cvv, name } = cardDetails;
      if (!number || !expiry || !cvv || !name) {
        setError("Please fill in all card details.");
        return false;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        setError("Please enter a valid UPI ID.");
        return false;
      }
    } else if (paymentMethod === "netbanking") {
      if (!selectedBank) {
        setError("Please select a bank.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handlePayment = () => {
    if (!validatePayment()) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      localStorage.setItem(
        "paymentSummary",
        JSON.stringify({
          method: paymentMethod,
          details:
            paymentMethod === "card"
              ? cardDetails
              : paymentMethod === "upi"
              ? { upiId }
              : { selectedBank },
          selectedPlan,
          billingDetails,
        })
      );
      router.push("/dashboard/employer/subscription/success");
    }, 2000);
  };

  const goBackToReview = () =>
    router.push("/dashboard/employer/subscription/review");
  if (!selectedPlan || !billingDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Payment</h1>
        <p className="text-gray-600 mb-6">
          Complete your subscription payment securely.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              {["card", "netbanking", "upi"].map((method) => (
                <label
                  key={method}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 mb-2"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="mr-3"
                  />
                  {method === "card" && (
                    <FaCreditCard className="mr-3 text-blue-600" />
                  )}
                  {method === "netbanking" && (
                    <FaUniversity className="mr-3 text-green-600" />
                  )}
                  {method === "upi" && (
                    <FaWallet className="mr-3 text-purple-600" />
                  )}
                  <span>
                    {method === "card"
                      ? "Credit/Debit Card"
                      : method === "upi"
                      ? "UPI"
                      : "Net Banking"}
                  </span>
                </label>
              ))}
            </div>

            {/* Inputs */}
            {paymentMethod === "card" && (
              <div className="border rounded-lg p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={(e) => handleCardChange("number", e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  maxLength={19}
                />
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardChange("expiry", e.target.value)}
                    className="w-1/2 border px-3 py-2 rounded-md"
                    maxLength={5}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardChange("cvv", e.target.value)}
                    className="w-1/2 border px-3 py-2 rounded-md"
                    maxLength={3}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardDetails.name}
                  onChange={(e) => handleCardChange("name", e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="border rounded-lg p-6">
                <input
                  type="text"
                  placeholder="UPI ID (e.g. name@bank)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="border rounded-lg p-6">
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="">Select Bank</option>
                  <option value="sbi">SBI</option>
                  <option value="hdfc">HDFC</option>
                  <option value="icici">ICICI</option>
                  <option value="axis">Axis</option>
                </select>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>{selectedPlan.title} Plan</span>
                <span className="font-medium">₹{selectedPlan.price - 49}+49</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-blue-600">
                  ₹{selectedPlan.price - 49}+49
                </span>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Billing Details</h3>
              <p>
                <strong>Name:</strong> {billingDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {billingDetails.email}
              </p>
              <p>
                <strong>Company:</strong> {billingDetails.company}
              </p>
              <p>
                <strong>Address:</strong> {billingDetails.address}
              </p>
            </div>

            <div className="text-sm text-gray-500 flex items-center">
              <FaLock className="mr-2" />
              Your payment is encrypted and secure.
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="flex justify-between mt-8">
          <button
            onClick={goBackToReview}
            disabled={processing}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {processing ? "Processing..." : `Pay ₹${selectedPlan.price - 49}+49`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
