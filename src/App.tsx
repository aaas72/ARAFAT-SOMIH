import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEO from './components/SEO';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import PhotoDetail from './pages/PhotoDetail';
import Awards from './pages/Awards';
import { LanguageProvider } from './context/LanguageContext';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppRoutes = () => {
  const { pathname } = useLocation();
  const isPhotoDetail = pathname.startsWith('/work/') && pathname.split('/').length === 3;

  return (
    <>
      <SEO />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:id" element={<PhotoDetail />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isPhotoDetail && <Footer />}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
