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
  'Contrattualistica commerciale',
  'Negoziazione di accordi',
  'Assistenza nel contenzioso',
  'Operazioni societarie',
];

const areas = [
  {
    title: 'Contratti commerciali',
    desc: 'Redazione e negoziazione di contratti e condizioni generali di vendita, anche nell\'ambito di specifici settori di attività.',
  },
  {
    title: 'Contenzioso commerciale',
    desc: 'Assistenza nella gestione delle controversie contrattuali ed extracontrattuali connesse all\'attività d\'impresa.',
  },
  {
    title: 'Rapporti tra imprese',
    desc: 'Consulenza nella strutturazione e nella gestione dei rapporti commerciali, con attenzione alla prevenzione dei rischi legali.',
  },
];

const DirittoCommercialePage = () => {
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
            Affiancare l'impresa<br />nelle scelte e nelle<br />sfide del mercato
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
                src="/assets/services/commerciale.png"
                alt="Diritto Commerciale"
                className="dp-hero-img"
              />
            </motion.div>

            <div className="dp-hero-right">
              <motion.p className="dp-intro sans" variants={fadeUp}>
                Nell'ambito del diritto commerciale, lo Studio assiste imprese
                e operatori economici, sia italiani che stranieri, nella
                redazione e nella negoziazione di contrattualistica nazionale
                e internazionale, con particolare attenzione alla
                strutturazione di condizioni generali di vendita e di
                contratti di settore.
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

export default DirittoCommercialePage;
