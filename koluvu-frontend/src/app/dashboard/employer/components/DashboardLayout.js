// src/app/main/dashboard/employer/components/DashboardLayout.js
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function DashboardLayout({ children, activeTab }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
