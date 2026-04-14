import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-v3 bg-footer">
      <div className="container footer-v3-inner">
        <div className="footer-v3-main">
          {/* Brand Column */}
          <div className="footer-v3-brand-stack">
            <div className="footer-logo-box">
              <img src="/assets/logotipo.svg" alt="" className="footer-icon-only" />
              <div className="footer-brand-text">
                <span className="caruso-light">CARUSO</span>
                <span className="avvocati-tag">AVVOCATI</span>
              </div>
            </div>
          </div>
          
          {/* Contacts Column */}
          <div className="footer-v3-contacts">
            <h4 className="footer-title serif">Contatti</h4>
            <div className="contact-details sans">
              <p>Via degli Olmi, 45 Napoli (NA)</p>
              <p>info@avvocaticaruso.it</p>
              <p>081 9047656</p>
            </div>
          </div>

          {/* Nav Links Column */}
          <div className="footer-v3-links">
            <ul className="footer-links-large serif">
              <li><a href="/team">Il Team</a></li>
              <li><a href="/">Lo Studio</a></li>
              <li><a href="/news">News</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-v3-bottom">
          <div className="footer-v3-line"></div>
          <div className="footer-policy-row">
            <div className="policy-links">
              <a href="/cookies">Cookie policy</a>
              <a href="/privacy">Privacy policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
