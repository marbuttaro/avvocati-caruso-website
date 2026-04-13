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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <nav className={`navbar-v3 ${scrolled ? 'scrolled' : ''} ${!isHome && !scrolled ? 'page-style' : ''}`}>
      <div className="container nav-v3-container">
        <Link to="/" className="brand-v3-new">
          <span className="serif">Caruso</span>
        </Link>
        
        <div className="nav-v3-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Lo studio</Link>
          <Link to="/aree-competenza" className={location.pathname === '/aree-competenza' ? 'active' : ''}>Competenze</Link>
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
