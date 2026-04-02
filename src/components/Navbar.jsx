import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar-v2 ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-v2-container">
        <Link to="/" className="brand-v2">
          <span className="serif italic">Caruso</span> <span className="sans">Legal</span>
        </Link>
        
        <div className="nav-v2-desktop">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Protagonisti</Link>
          <Link to="/aree-competenza" className={location.pathname === '/aree-competenza' ? 'active' : ''}>Competenze</Link>
          <Link to="/team" className={location.pathname === '/team' ? 'active' : ''}>Team</Link>
          <a href="#contatti" className="nav-cta-btn">Prenota</a>
        </div>

        <button className="mobile-toggle-v2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-menu-v2"
          >
            <div className="mobile-links-v2">
              <Link to="/">Protagonisti</Link>
              <Link to="/aree-competenza">Competenze</Link>
              <Link to="/team">Team</Link>
              <Link to="#contatti" className="mobile-cta-v2">Prenota</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
