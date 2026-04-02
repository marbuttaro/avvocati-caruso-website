import React, { useState, useEffect } from 'react';
import './Home.css';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const fadingMessages = [
  "Eccellenza e serietà nella tutela dei vostri diritti.",
  "La competenza al servizio del cliente.",
  "Soluzioni legali su misura per ogni esigenza.",
  "Affidabilità istituzionale dal 1990."
];

const Home = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out

      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % fadingMessages.length);
        setFade(true); // Start fading in
      }, 500); // 500ms delay for the fade out transition

    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content text-center">
          <h2 className={`fading-text ${fade ? 'fade-in' : 'fade-out'}`}>
            {fadingMessages[currentMessageIndex]}
          </h2>
          <p className="hero-subtitle">Proattività, competenza e stretto rapporto fiduciario.</p>
        </div>
      </section>

      {/* Lo Studio Section */}
      <section className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Lo Studio</h2>
              <div className="divider"></div>
              <p className="mb-3">
                Lo Studio Legale Caruso offre assistenza e consulenza legale qualificata. 
                Siamo formati da un team di professionisti di comprovata esperienza, specializzati 
                nelle diverse aree del diritto per fornire una tutela a 360 gradi.
              </p>
              <p className="mb-4">
                La dedizione e il massimo impegno per la causa del cliente sono i nostri valori fondamentali, 
                accompagnati da un rigoroso aggiornamento professionale e dall'utilizzo delle più moderne tecnologie.
              </p>
              <ul className="values-list">
                <li><CheckCircle2 color="var(--color-highlight)" size={20} /> Metodo Sartoriale e Personalizzato</li>
                <li><CheckCircle2 color="var(--color-highlight)" size={20} /> Massima Trasparenza Preventiva</li>
                <li><CheckCircle2 color="var(--color-highlight)" size={20} /> Tutela in Sede Stragiudiziale e Giudiziale</li>
              </ul>
            </div>
            <div className="about-image-container">
               {/* Un'immagine fittizia istituzionale */}
               <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800" alt="Studio Legale Caruso" className="about-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget */}
      <section className="section booking-section">
        <div className="container text-center">
          <h2>Richiedi un Appuntamento</h2>
          <div className="divider mx-auto"></div>
          <p className="mb-5 booking-disclaimer">
            La richiesta di prenotazione deve essere necessariamente condizionata ad accettazione da parte dello Studio.
          </p>

          <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input type="text" placeholder="Nome e Cognome *" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email *" required />
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Telefono *" required />
            </div>
            <div className="form-group">
              <select required>
                <option value="" disabled selected>Seleziona l'area di interesse *</option>
                <option value="penale">Diritto Penale</option>
                <option value="civile">Diritto Civile</option>
                <option value="commerciale">Diritto Commerciale</option>
                <option value="navigazione">Diritto della Navigazione</option>
                <option value="altro">Altro</option>
              </select>
            </div>
            <div className="form-group full-width">
              <textarea placeholder="Descrizione sommaria preliminare del quesito" rows="4"></textarea>
            </div>
            <div className="form-group full-width text-center">
              <button type="submit" className="btn btn-submit">Invia Richiesta di Prenotazione <ArrowRight size={18} style={{marginLeft: '8px', verticalAlign: 'middle'}} /></button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
