import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import CompanyOverview from './pages/CompanyOverview';
import Vision from './pages/Vision';
import History from './pages/History';
import GroupCompanies from './pages/GroupCompanies';
import NationalNetwork from './pages/NationalNetwork';
import LogisticsService from './pages/LogisticsService';
import Contact from './pages/Contact';
import Talent from './pages/Talent';
import CompliancePage from './pages/CompliancePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/company/overview" element={<CompanyOverview />} />
            <Route path="/company/vision" element={<Vision />} />
            <Route path="/company/history" element={<History />} />
            <Route path="/company/group" element={<GroupCompanies />} />
            <Route path="/company/network" element={<NationalNetwork />} />
            <Route path="/logistics" element={<LogisticsService />} />
            <Route path="/compliance" element={<CompliancePage title="준법경영" />} />
            <Route path="/compliance/ceo-message" element={<CompliancePage title="CEO 메시지" />} />
            <Route path="/compliance/ethics" element={<CompliancePage title="준법 및 윤리경영 실천" />} />
            <Route path="/compliance/sales-code" element={<CompliancePage title="영업사원의 윤리강령" />} />
            <Route path="/compliance/cp" element={<CompliancePage title="자율준수 프로그램(CP)" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact/talent" element={<Talent />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
