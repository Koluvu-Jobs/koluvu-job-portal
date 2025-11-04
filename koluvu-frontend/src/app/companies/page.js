//  src/app/componies/page.js

import CompanyDirectory from './components/CompanyDirectory';
import Header from '@koluvu/components/Header/Header';
import Footer from '@koluvu/components/Footer/Footer';
import styles from '@koluvu/styles/components/company/company-page.module.css';

export default function CompanyDirectoryPage() {
  return (
    <div className={`${styles.pageContainer} bg-gray-50`}>
      <Header className="bg-white shadow-sm" />
      <main className="flex-1">
        <CompanyDirectory />
      </main>
      <Footer className="bg-white border-t" />
    </div>
  );
}
