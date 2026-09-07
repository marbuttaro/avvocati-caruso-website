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
  'Valutazione dei rischi legali',
  'Assistenza nel contenzioso',
  'Negoziazione e consulenza',
  'Assistenza nelle controversie',
  'Consulenza preventiva',
];

const areas = [
  {
    title: 'Contrattualistica',
    desc: 'Assistenza nella redazione, revisione e negoziazione dei contratti e nella definizione dei rapporti tra le parti.',
  },
  {
    title: 'Contenzioso civile',
    desc: 'Difesa e rappresentanza nelle controversie di natura contrattuale ed extracontrattuale, in ogni fase del giudizio.',
  },
  {
    title: 'Responsabilità civile',
    desc: 'Consulenza e assistenza nelle controversie relative a danni e responsabilità derivanti dalla violazione di obblighi giuridici.',
  },
  {
    title: 'Consulenza preventiva',
    desc: 'Analisi dei rischi legali connessi a operazioni e rapporti contrattuali, per supportare il cliente nell\'assunzione di decisioni consapevoli.',
  },
];

const DirittoCivilePage = () => {
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
            Tutela e soluzioni,<br />oltre il contenzioso
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
                src="/assets/services/close-up-businessman-signing-lease-agreement-carcreated-with-generative-ai-technology.jpg"
                alt="Diritto Civile"
                className="dp-hero-img"
              />
            </motion.div>

            <div className="dp-hero-right">
              <motion.p className="dp-intro sans" variants={fadeUp}>
                Lo Studio assiste persone fisiche e imprese nella gestione del
                contenzioso civile, sia contrattuale che extracontrattuale,
                curando la difesa dell'assistito in ogni fase del giudizio.
                Parallelamente, offre un'attività di consulenza e assistenza
                stragiudiziale nella redazione e nella negoziazione della
                contrattualistica, con l'obiettivo di prevenire l'insorgere
                di controversie attraverso una definizione chiara e ponderata
                dei rapporti giuridici tra le parti.
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
                <h3 className="dp-area-card-title serif">{area.title}</h3>
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

export default DirittoCivilePage;
