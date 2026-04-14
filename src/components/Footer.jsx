import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-v3 bg-footer">
      <div className="container footer-v3-inner">
        <div className="footer-v3-main">
          <div className="footer-v3-brand">
            <img src="/assets/logo-completo.svg" alt="Studio Legale Caruso" className="footer-logo-img" />
            <p className="mt-4 opacity-60">Eccellenza legale, rigore professionale e innovazione strategica dal 1990.</p>
          </div>
          
          <div className="footer-v3-grid">
            <div className="footer-v3-col">
              <h4 className="footer-title serif-italic">Navigazione</h4>
              <ul className="footer-links">
                <li><a href="/">Lo studio</a></li>
                <li><a href="/aree-competenza">Competenze</a></li>
                <li><a href="/team">I professionisti</a></li>
                <li><a href="#contatti">Contatti</a></li>
              </ul>
            </div>
            
            <div className="footer-v3-col">
              <h4 className="footer-title serif-italic">Legale</h4>
              <ul className="footer-links">
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
                <li><a href="/legal">Note Legali</a></li>
              </ul>
            </div>

            <div className="footer-v3-col">
              <h4 className="footer-title serif-italic">Ufficio</h4>
              <p className="opacity-60">Roma, Via dei Fori Imperiali 12</p>
              <p className="mt-2 opacity-60">+39 06 9876543</p>
              <p className="opacity-60">segreteria@studiocaruso.it</p>
            </div>
          </div>
        </div>
        
        <div className="footer-v3-bottom">
          <div className="footer-v3-line"></div>
          <div className="footer-v3-copy">
            <span>&copy; {new Date().getFullYear()} Studio Legale Caruso. All Rights Reserved.</span>
            <span className="opacity-40">Design by Figma - Dev by Antigravity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
