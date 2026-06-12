import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const openDropdown = () => {
    clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  const isHome = location.pathname === '/';
  const competenzeActive =
    location.pathname.startsWith('/aree-competenza') ||
    location.pathname.startsWith('/diritto-penale');

  return (
    <nav className={`navbar-v3 ${scrolled ? 'scrolled' : ''} ${!isHome && !scrolled ? 'page-style' : ''}`}>
      <div className="container nav-v3-container">
        <Link to="/" className="brand-v3-new">
          <img
            src={scrolled || !isHome ? '/assets/logotipo-dark.svg' : '/assets/logotipo.svg'}
            alt="Studio Legale Caruso"
            className="logo-img"
          />
        </Link>

        <div className="nav-v3-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Lo studio</Link>

          {/* Competenze + dropdown */}
          <div
            className={`nav-dropdown-wrap${competenzeActive ? ' active' : ''}`}
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
          >
            <Link
              to="/aree-competenza"
              className={location.pathname === '/aree-competenza' ? 'active' : ''}
            >
              Competenze
            </Link>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="nav-dropdown-menu"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={openDropdown}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    to="/diritto-penale"
                    className={location.pathname === '/diritto-penale' ? 'active' : ''}
                  >
                    Diritto Penale
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/team" className={location.pathname === '/team' ? 'active' : ''}>I professionisti</Link>
          <a href="#contatti" className="nav-cta-v3">Contatti</a>
        </div>

        <button className="mobile-toggle-v3" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu-v3"
          >
            <div className="mobile-links-v3">
              <Link to="/">Lo studio</Link>
              <Link to="/aree-competenza">Competenze</Link>
              <Link to="/diritto-penale" className="mobile-sublink">— Diritto Penale</Link>
              <Link to="/team">I professionisti</Link>
              <a href="#contatti">Contatti</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
