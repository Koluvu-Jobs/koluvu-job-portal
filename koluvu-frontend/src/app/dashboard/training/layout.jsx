// src/app/dashboard/training/layout.jsx
export default function TrainingDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: 0, marginTop: "calc(-1 * var(--header-height))" }}>
      {children}
    </div>
  );
}
