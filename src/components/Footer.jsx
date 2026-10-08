import React from 'react';
import { privacyUrl, cookieUrl, openCookiePreferences } from '../privacy/consent';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <div className="pattern-separator footer-pattern-top" aria-hidden="true" />
      <footer className="footer-v3 bg-footer">
      <div className="container footer-v3-inner">
        <div className="footer-v3-main">
          {/* Brand Column */}
          <div className="footer-v3-brand-stack">
            <picture>
              <source width="179" height="71" media="(max-width: 640px)" srcSet="/assets/logo-lettering.svg" />
              <img src="/assets/logo-completo.svg" alt="Caruso Avvocati" className="footer-logo-complete" width={177} height={121} />
            </picture>
          </div>

          {/* Contacts Column */}
          <div className="footer-v3-contacts">
            <h2 className="footer-title serif">Contatti</h2>
            <div className="contact-details sans">
              <p>Via Vincenzo Cosenza 31 – 80078 Pozzuoli (NA)</p>
              <p><a href="mailto:info@carusoavvocati.it">info@carusoavvocati.it</a></p>
              <p><a href="tel:+390813032399">081 3032399</a></p>
            </div>
          </div>

          <div className="footer-v3-line footer-v3-line--mobile"></div>

          {/* Nav Links Column */}
          <div className="footer-v3-links">
            <ul className="footer-links-large serif">
              <li><a href="/team">I professionisti</a></li>
              <li><a href="/lo-studio">Lo Studio</a></li>
              <li><a href="/news">News</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-v3-bottom">
          <div className="footer-v3-line footer-v3-line--desktop"></div>
          <div className="footer-policy-row">
            <div className="policy-links">
              <a href={cookieUrl} target="_blank" rel="noopener noreferrer">Cookie policy</a>
              <a href={privacyUrl} target="_blank" rel="noopener noreferrer">Privacy policy</a>
              <button type="button" onClick={openCookiePreferences}>Gestisci preferenze cookie</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
      <div className="pattern-separator footer-pattern-bottom" aria-hidden="true" />
    </>
  );
};

export default Footer;
