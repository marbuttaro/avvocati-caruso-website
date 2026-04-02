import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-col">
          <h3>Studio Legale Caruso</h3>
          <p>La vostra tutela legale, la nostra priorità.</p>
        </div>
        <div className="footer-col">
          <h4>Sede</h4>
          <p>Via Roma, 123<br />00100 Roma (RM)<br />Italia</p>
        </div>
        <div className="footer-col">
          <h4>Contatti</h4>
          <p>Email: segreteria@studiocaruso.it<br />Tel: +39 06 1234567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Studio Legale Caruso. Tutti i diritti riservati. <br/><small>Progettato con stile e dedizione.</small></p>
      </div>
    </footer>
  );
};

export default Footer;
