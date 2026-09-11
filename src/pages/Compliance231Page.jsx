import React from 'react';
import { motion } from 'framer-motion';
import { ContactSection } from './Home';
import './DirittopenPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const activities = [
  'Difesa dell\'ente in giudizio',
  'Predisposizione e aggiornamento del MOG',
  'Supporto all\'ODV',
  'Formazione 231 per dipendenti',
];

const areas = [
  {
    title: 'Risk assessment',
    desc: 'Individuazione e valutazione dei rischi-reato specifici dell\'attività e del settore in cui opera l\'impresa.',
  },
  {
    title: 'Modelli di Organizzazione,\nGestione e Controllo',
    desc: 'Predisposizione e aggiornamento dei Modelli 231 in funzione della struttura e dei rischi aziendali.',
    wide: true,
  },
  {
    title: 'Organismo di Vigilanza',
    desc: 'Supporto all\'Organismo di Vigilanza nello svolgimento delle proprie funzioni e nella verifica dell\'efficacia dei presidi adottati.',
  },
  {
    title: 'Compliance e formazione',
    desc: 'Definizione dei presidi di prevenzione e formazione del personale sui principi e sulle procedure di compliance.',
  },
  {
    title: 'Procedimenti 231',
    desc: 'Assistenza e difesa dell\'ente e delle persone fisiche coinvolte nei procedimenti relativi alla responsabilità amministrativa.',
  },
];

const Compliance231Page = () => {
  return (
    <div className="dp-page">

      {/* ── Hero: titolo a piena larghezza ─────────────────── */}
      <section className="dp-title-section bg-cream">
        <div className="container">
          <motion.h1
            className="dp-title serif"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            Anticipare il rischio,<br />costruire valore
          </motion.h1>
        </div>
      </section>

      {/* ── Hero body: foto + testo ─────────────────────────── */}
      <section className="dp-body-section bg-cream">
        <div className="container">
          <motion.div
            className="dp-hero-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >

            <motion.div className="dp-hero-left" variants={fadeUp}>
              <img
                src="/assets/services/compliance.png"
                alt="Compliance 231"
                className="dp-hero-img"
              />
            </motion.div>

            <div className="dp-hero-right">
              <motion.p className="dp-intro sans" variants={fadeUp}>
                In materia di responsabilità amministrativa degli enti ai sensi
                del D.Lgs. 231/2001, lo Studio affianca le imprese sia nella
                fase patologica — assumendo la difesa dell'ente e delle
                persone fisiche coinvolte nei relativi procedimenti — sia,
                soprattutto, in una prospettiva di prevenzione.
              </motion.p>
              <motion.div className="dp-activities" variants={fadeUp}>
                <h3 className="dp-activities-title serif">Attività principali</h3>
                <ul className="dp-activities-list sans">
                  {activities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ── Aree di intervento ───────────────────────────────── */}
      <section className="dp-areas-section section-padding bg-cream">
        <div className="container">
          <motion.h2
            className="dp-areas-title serif"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            Aree di intervento
          </motion.h2>
          <motion.div
            className="dp-areas-grid"
            style={{ '--dp-areas-cols': areas.length === 4 ? 2 : Math.min(areas.length, 3) }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {areas.map((area, i) => (
              <motion.div key={i} className="dp-area-card" variants={fadeUp}>
                <div className="dp-area-header">
                  <div className="dp-area-divider" />
                  <img
                    src="/assets/logotipo-orange.svg"
                    alt=""
                    className="dp-area-icon"
                    aria-hidden="true"
                  />
                </div>
                <h3 className={`dp-area-card-title serif${area.wide ? ' dp-area-card-title--wide' : ''}`}>{area.title}</h3>
                <p className="dp-area-desc sans">{area.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contatti ─────────────────────────────────────────── */}
      <ContactSection />

    </div>
  );
};

export default Compliance231Page;
