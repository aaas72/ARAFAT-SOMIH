import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  const navItems = t.common.nav;

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsAtTop(true);
        setIsVisible(true);
      } else {
        setIsAtTop(false);
        if (currentScrollY > lastScrollY) {
          setIsVisible(false); // Scrolling down
        } else {
          setIsVisible(true); // Scrolling up
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 w-full z-50 transition-colors duration-500 ${isAtTop && !isMobileMenuOpen
          ? 'bg-transparent border-transparent'
          : 'bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          }`}
      >
        <div className="container mx-auto flex justify-between items-center py-5 px-6 lg:px-0">
          <Link to="/" className="text-xl lg:text-2xl font-black text-white italic tracking-tighter hover:text-lime-400 transition-colors">
            {t.common.footer.branding}
          </Link>

          <div className="hidden lg:flex gap-10">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `font-epilogue font-black uppercase tracking-tighter text-sm transition-all duration-300 relative group ${isActive ? 'text-lime-400' : 'text-white/80 hover:text-lime-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.name}
                    {(isActive) && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 w-full h-[2px] bg-lime-400"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex text-white hover:text-lime-400 transition-colors duration-300 active:scale-90 items-center gap-1 group"
            >
              <span className="material-symbols-outlined text-xl lg:text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>language</span>
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">
                {locale === 'en' ? 'AR' : 'EN'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-lime-400 transition-colors duration-300 active:scale-90 z-[60]"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-12 p-10 lg:hidden"
          >
            {navItems.map((item, idx) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `font-epilogue text-5xl font-black uppercase tracking-tighter transition-all duration-300 ${
                    isActive ? 'text-lime-400' : 'text-white hover:text-lime-400'
                  }`
                }
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  {item.name}
                </motion.span>
              </NavLink>
            ))}

            <motion.button 
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-white/40 hover:text-lime-400 transition-colors mt-8"
            >
              <span className="material-symbols-outlined">language</span>
              <span className="font-bold text-xs tracking-widest uppercase">
                {locale === 'en' ? 'Arabic' : 'English'}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
