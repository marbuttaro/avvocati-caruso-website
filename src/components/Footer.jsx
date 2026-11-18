import React from 'react';
import { privacyUrl, cookieUrl, openCookiePreferences } from '../privacy/consent';
import './Footer.css';

const LINKEDIN_URL = 'https://www.linkedin.com/company/caruso-avvocati/';

// Lo stesso logo compare in due punti: a destra del menu su desktop, sotto i contatti su tablet e mobile.
// Il CSS ne mostra sempre uno solo.
const LinkedInLink = ({ className }) => (
  <a
    className={`footer-linkedin ${className}`}
    href={LINKEDIN_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Caruso Avvocati su LinkedIn (si apre in una nuova scheda)"
    title="LinkedIn"
  >
    <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  </a>
);

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
              <p>Via Vincenzo Cosenza 31<span className="address-separator"> – </span><br className="address-break" />80078 Pozzuoli (NA)</p>
              <p><a href="mailto:info@carusoavvocati.it">info@carusoavvocati.it</a></p>
              <p><a href="tel:+390813032399">081 3032399</a></p>
            </div>
            <LinkedInLink className="footer-linkedin--mobile" />
          </div>

          <div className="footer-v3-line footer-v3-line--mobile"></div>

          {/* Nav Links Column */}
          <div className="footer-v3-links">
            <ul className="footer-links-large serif">
              <li><a href="/team">I professionisti</a></li>
              <li><a href="/lo-studio">Lo Studio</a></li>
              <li><a href="/news">News</a></li>
            </ul>
            <LinkedInLink className="footer-linkedin--desktop" />
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
