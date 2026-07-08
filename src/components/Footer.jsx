import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <picture>
        <source media="(max-width: 640px)" srcSet="/assets/pattern-separator-mobile.svg" />
        <img src="/assets/pattern.svg" alt="" className="pattern-separator footer-pattern-top" aria-hidden="true" />
      </picture>
      <footer className="footer-v3 bg-footer">
      <div className="container footer-v3-inner">
        <div className="footer-v3-main">
          {/* Brand Column */}
          <div className="footer-v3-brand-stack">
            <picture>
              <source media="(max-width: 640px)" srcSet="/assets/logo-lettering.svg" />
              <img src="/assets/logo-completo.svg" alt="Caruso Avvocati" className="footer-logo-complete" />
            </picture>
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

          <div className="footer-v3-line footer-v3-line--mobile"></div>

          {/* Nav Links Column */}
          <div className="footer-v3-links">
            <ul className="footer-links-large serif">
              <li><a href="/team">I professionisti</a></li>
              <li><a href="/lo-studio">Lo Studio</a></li>
              <li><a href="/#news">News</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-v3-bottom">
          <div className="footer-v3-line footer-v3-line--desktop"></div>
          <div className="footer-policy-row">
            <div className="policy-links">
              <a href="/cookies">Cookie policy</a>
              <a href="/privacy">Privacy policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
      <picture>
        <source media="(max-width: 640px)" srcSet="/assets/pattern-separator-mobile.svg" />
        <img src="/assets/pattern.svg" alt="" className="pattern-separator footer-pattern-bottom" aria-hidden="true" />
      </picture>
    </>
  );
};

export default Footer;
