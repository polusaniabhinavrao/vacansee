import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SupabaseBanner from './components/common/SupabaseBanner';
import AppRoutes from './routes/AppRoutes';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <JobProvider>
          <BrowserRouter>
            <ScrollToTop />
            <SupabaseBanner />
            <Navbar />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <AppRoutes />
            </main>
            <Footer />
          </BrowserRouter>
        </JobProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
