// src/app/dashboard/employer/verification/page.js

"use client";

import { useState } from "react";
import { useAuth } from "@koluvu/hooks/useAuth";
import { motion } from "framer-motion";
import styles from "@koluvu/styles/employer/verification/verification.module.css";
// import { completeProfile } from "@koluvu/api/verificationService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function VerificationPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(
    user?.profileComplete || false
  );

  const handleProfileCompletion = async () => {
    if (verificationStatus) return;
    if (!user || !user.id) {
      toast.error("User not logged in or user ID not available.");
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call the verification API
      // const response = await completeProfile(user.id);
      const response = { success: true }; // Temporary mock response

      if (response.success) {
        updateUser({ profileComplete: true });
        setVerificationStatus(true);
        toast.success("Verification successful! Your profile is now verified.");
        router.refresh();
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (error) {
      console.error("Error completing profile:", error);
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.verificationContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.verificationContent}
      >
        <h2 className={styles.mainTitle}>
          {verificationStatus
            ? "🎉 Your Profile is Verified!"
            : "✅ Why Get a Verified Employer Badge?"}
        </h2>

        {!verificationStatus && (
          <>
            <p className={styles.priceText}>One-Time Payment: ₹49/- Only</p>
            <p className={styles.subText}>
              Because Perception is Everything in today's digital hiring space.
            </p>
          </>
        )}

        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>
            {verificationStatus
              ? "🏅 Your Verified Status"
              : "🏅 What is the Verified Badge?"}
          </h3>
          <p className={styles.cardText}>
            {verificationStatus
              ? "Your company profile now displays the Verified Employer Badge, showing job seekers your identity and authenticity have been confirmed by Koluvu. This badge enhances your credibility and trustworthiness."
              : "The Verified Employer Badge is a special mark displayed on your company profile that shows job seekers your identity and authenticity have been confirmed by Koluvu. It's a symbol of credibility, trust, and transparency."}
          </p>
        </div>

        <div className={styles.benefitsSection}>
          <h3 className={styles.benefitsTitle}>
            {verificationStatus
              ? "✨ Enjoy These Benefits"
              : "🌟 Benefits of Being Verified"}
          </h3>
          <ul className={styles.benefitsList}>
            <li>
              <strong>Gain Job Seeker Trust Instantly:</strong> Job seekers are
              more likely to apply to verified employers.
            </li>
            <li>
              <strong>Stand Out from the Competition:</strong> Helps your job
              posts stand out with more visibility.
            </li>
            <li>
              <strong>Build Stronger Relationships:</strong> Shows your
              commitment to transparent hiring.
            </li>
            <li>
              <strong>Promote a Professional Brand Image:</strong> Sends the
              right first impression to job seekers.
            </li>
            <li>
              <strong>Reduce Drop-offs:</strong> Builds confidence and improves
              hiring funnel efficiency.
            </li>
          </ul>
        </div>

        {verificationStatus ? (
          <div className={styles.lifetimeCard}>
            <h4 className={styles.lifetimeTitle}>🎯 Verified for Life</h4>
            <p className={styles.lifetimeText}>
              Your one-time payment of ₹49/- has unlocked lifetime verification
              benefits. No renewals, no monthly fees - just continuous
              credibility for your employer brand.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.jobSeekerCard}>
              <h4 className={styles.jobSeekerTitle}>
                💬 What Job Seekers Will See:
              </h4>
              <p className={styles.jobSeekerText}>
                "This employer is verified by Koluvu – trusted and reviewed for
                authenticity."
              </p>
            </div>

            <div className={styles.lifetimeCard}>
              <h4 className={styles.lifetimeTitle}>
                🛡 One-Time Verification – Lifetime Value
              </h4>
              <p className={styles.lifetimeText}>
                You only need to pay ₹49/- once to unlock the badge and all its
                associated benefits — no renewals, no monthly fees.
              </p>
            </div>
          </>
        )}

        <div className={styles.ctaSection}>
          <button
            className={styles.verifyButton}
            disabled={verificationStatus || loading}
            onClick={handleProfileCompletion}
          >
            {loading ? (
              <>
                <span className={styles.loadingSpinner} />
                Processing Payment...
              </>
            ) : verificationStatus ? (
              "🎉 Profile Verified"
            ) : (
              "Pay ₹49 to Get Verified"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
