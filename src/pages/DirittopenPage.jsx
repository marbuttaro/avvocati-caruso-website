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
  'Difesa in giudizio',
  'Assistenza stragiudiziale',
  'Consulenza preventiva',
  'Gestione di controlli e accertamenti',
  'Valutazione dei rischi penali',
];

const areas = [
  {
    title: 'Reati contro la Pubblica Amministrazione',
    desc: 'Assistenza nei procedimenti relativi a condotte illecite nei rapporti con la Pubblica Amministrazione.',
  },
  {
    title: 'Colpa professionale',
    desc: 'Tutela e difesa dei professionisti coinvolti in procedimenti per responsabilità penale nell\'esercizio della propria attività.',
  },
  {
    title: 'Reati urbanistici ed edilizi',
    desc: 'Assistenza nelle controversie relative alla disciplina edilizia ed urbanistica.',
  },
  {
    title: 'Reati tributari',
    desc: 'Consulenza e difesa in materia di reati tributari, finanziari e connessi alla tutela dell\'ambiente.',
  },
];

const DirittopenPage = () => {
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
            Difesa, consulenza<br />e tutela nei<br />procedimenti penali
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
                alt="Diritto Penale"
                className="dp-hero-img"
              />
            </motion.div>

            <div className="dp-hero-right">
              <motion.p className="dp-intro sans" variants={fadeUp}>
                Da oltre trent'anni lo Studio offre assistenza e consulenza in
                materia penale, con una consolidata esperienza nella gestione
                dei procedimenti e nella prevenzione dei rischi di
                responsabilità. L'attività si sviluppa tanto in ambito
                giudiziale quanto stragiudiziale, affiancando persone fisiche
                e giuridiche in ogni fase delle loro esigenze legali.
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

export default DirittopenPage;
