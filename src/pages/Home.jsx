import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Scale, FileText, Briefcase, Anchor } from 'lucide-react';
import './Home.css';

const fadingMessages = [
  "Eccellenza e serietà nella tutela dei vostri diritti.",
  "La competenza al servizio del cliente.",
  "Soluzioni legali su misura per ogni esigenza.",
  "Affidabilità istituzionale dal 1990."
];

const Home = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  const [fade, setFade] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % fadingMessages.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const practiceAreas = [
    { title: 'Diritto Penale', icon: <Scale />, link: '/aree-competenza#penale' },
    { title: 'Diritto Civile', icon: <FileText />, link: '/aree-competenza#civile' },
    { title: 'Diritto Commerciale', icon: <Briefcase />, link: '/aree-competenza#commerciale' },
    { title: 'Diritto della Navigazione', icon: <Anchor />, link: '/aree-competenza#navigazione' },
  ];

  return (
    <div className="home-v2">
      {/* Hero Section */}
      <section className="hero-v2">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hero-text-wrapper"
          >
            <h1 className="hero-title">
              Studio Legale <br />
              <span className="accent-text italic">Caruso</span>
            </h1>
            <div className="hero-bottom-grid">
              <div className="hero-description-container">
                <p className={`hero-description ${fade ? 'fade-in' : 'fade-out'}`}>
                  {fadingMessages[currentMessageIndex]}
                </p>
                <div className="hero-subtext">
                  Eccellenza, proattività e serietà nella tutela dei vostri diritti. 
                  Un approccio sartoriale per ogni sfida legale.
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="hero-cta-circle"
              >
                <a href="#contatti">
                  <span>Inizia Qui</span>
                  <ArrowUpRight size={24} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section - Asymmetric Layout */}
      <section className="philosophy-section section-padding">
        <div className="container asymmetric-grid">
          <div className="philosophy-image-col">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="image-reveal-wrapper"
            >
              <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200" alt="Legal Excellence" />
            </motion.div>
          </div>
          <div className="philosophy-text-col">
            <h2 className="section-subtitle">Oltre il Parere Legale</h2>
            <h3 className="section-title">Una visione <span className="serif italic">dinamica</span> della giustizia.</h3>
            <p className="mb-4">
              Fondato su decenni di esperienza, lo Studio Caruso si evolve costantemente 
              per rispondere alla complessità del panorama giuridico contemporaneo. 
              Non ci limitiamo alla consulenza: costruiamo strategie di difesa proattive.
            </p>
            <button className="btn-minimal">Scopri la nostra storia</button>
          </div>
        </div>
      </section>

      {/* Interactive Practice Areas List */}
      <section className="practice-areas-v2 section-padding">
        <div className="container">
          <h2 className="section-title text-center mb-5">Aree di <span className="serif">Competenza</span></h2>
          <div className="practice-list">
            {practiceAreas.map((area, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="practice-item"
              >
                <a href={area.link} className="practice-link">
                  <div className="practice-info">
                    <span className="practice-num">0{index + 1}</span>
                    <h4 className="practice-name">{area.title}</h4>
                  </div>
                  <div className="practice-action">
                    <span className="practice-tag">Dettagli</span>
                    <ArrowUpRight className="practice-arrow" />
                  </div>
                </a>
                <div className="practice-line"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridge Call to Actions */}
      <section className="bridge-section">
        <div className="bridge-grid">
          <a href="/team" className="bridge-card team-bridge">
            <div className="bridge-overlay"></div>
            <div className="bridge-content">
              <h4>Incontra i Professionisti</h4>
              <p>Il cuore pulsante della nostra eccellenza.</p>
              <span className="bridge-link-text">Vedi il Team →</span>
            </div>
          </a>
          <a href="#prenota" className="bridge-card booking-bridge">
            <div className="bridge-overlay"></div>
            <div className="bridge-content">
              <h4>Consulenza Specializzata</h4>
              <p>Pianifica un incontro conoscitivo.</p>
              <span className="bridge-link-text">Prenota Ora →</span>
            </div>
          </a>
        </div>
      </section>

      {/* Refined Booking Form */}
      <section id="contatti" className="booking-v2 section-padding">
        <div className="container split-layout">
          <div className="booking-info">
            <h2 className="section-title">Contatti & Prenotazioni</h2>
            <p className="mb-4">Ogni richiesta viene analizzata con la massima attenzione. <br/>Riceverete una conferma entro 24 ore lavorative dal nostro team di segreteria.</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="label">Ufficio</span>
                <p>Roma, Via dei Fori Imperiali 12</p>
              </div>
              <div className="contact-item">
                <span className="label">Contatto Diretto</span>
                <p>+39 06 9876543 <br/> segreteria@studiocaruso.it</p>
              </div>
            </div>
          </div>
          <div className="booking-form-wrapper">
            <form className="minimal-form">
              <div className="form-row">
                <input type="text" placeholder="Nome" required />
                <input type="email" placeholder="Email" required />
              </div>
              <div className="form-row">
                <select>
                  <option value="" disabled selected>Seleziona l'Area Legale</option>
                  <option>Penale</option>
                  <option>Civile</option>
                  <option>Commerciale</option>
                  <option>Navigazione</option>
                </select>
              </div>
              <textarea placeholder="Il tuo quesito (breve descrizione)" rows="4"></textarea>
              <div className="consent-box">
                <input type="checkbox" id="privacy" required />
                <label htmlFor="privacy">Accetto il trattamento dei dati personali</label>
              </div>
              <button type="submit" className="btn-minimal w-full">Invia Richiesta</button>
              <p className="disclaimer mt-3">* La prenotazione è soggetta ad accettazione dello studio.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
