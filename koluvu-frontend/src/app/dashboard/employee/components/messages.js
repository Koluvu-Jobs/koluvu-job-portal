// src/app/main/dashboard/employee/components/messages.js

"use client";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@koluvu/styles/employee/dashboard.module.css";

export default function Messages({ isOpen, onClose, onMessageRead }) {
  const messages = [
    {
      id: 1,
      sender: "HR Team",
      subject: "Interview Schedule",
      time: "1 hour ago",
    },
    { id: 2, sender: "Recruiter", subject: "Job Offer", time: "3 hours ago" },
    { id: 3, sender: "Manager", subject: "Follow-up", time: "1 day ago" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.messagePanel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.messageHeader}>
            <h3 className={styles.cardTitle}>Messages</h3>
            <button onClick={onClose} className={styles.closeButton}>
              ×
            </button>
          </div>
          <div className={styles.messageList}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={styles.messageItem}
                whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                onClick={() => onMessageRead(message.id)}
              >
                <p className={styles.messageSender}>{message.sender}</p>
                <p className={styles.messageSubject}>{message.subject}</p>
                <span className={styles.messageTime}>{message.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
