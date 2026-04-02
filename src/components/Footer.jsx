import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-v2">
      <div className="container footer-v2-grid">
        <div className="footer-v2-brand">
          <h3 className="serif italic">Caruso Legal</h3>
          <p className="mt-4 max-w-xs">Eccellenza legale, rigore professionale e innovazione strategica per la tutela dei vostri interessi.</p>
        </div>
        
        <div className="footer-v2-links">
          <div className="footer-col">
            <h5>Navigazione</h5>
            <a href="/">Home</a>
            <a href="/aree-competenza">Competenze</a>
            <a href="/team">Team</a>
            <a href="#contatti">Contatti</a>
          </div>
          
          <div className="footer-col">
            <h5>Legale</h5>
            <a href="/privacy">Privacy Policy</a>
            <a href="/cookies">Cookie Policy</a>
            <a href="/legal">Note Legali</a>
          </div>

          <div className="footer-col">
            <h5>Ufficio</h5>
            <p>Roma, Via dei Fori Imperiali 12</p>
            <p className="mt-2">+39 06 9876543</p>
            <p>segreteria@studiocaruso.it</p>
          </div>
        </div>
      </div>
      
      <div className="footer-v2-bottom container">
        <div className="footer-line"></div>
        <div className="footer-copy">
          <span>&copy; {new Date().getFullYear()} Studio Legale Caruso. All Rights Reserved.</span>
          <span>Progettato con <span className="text-accent">Impeccable</span> Design.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
