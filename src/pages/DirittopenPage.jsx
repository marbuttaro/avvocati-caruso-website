import React from 'react';
import { motion } from 'framer-motion';
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
  'Consulenza e pareri in materia penale',
  'Assistenza durante indagini e accertamenti',
  'Difesa nei procedimenti penali',
  'Impugnazioni e procedimenti cautelari',
  'Assistenza a persone indagate/imputate',
];

const areas = [
  {
    title: 'Reati contro la Pubblica Amministrazione',
    desc: 'Assistenza e difesa in procedimenti relativi a reati che coinvolgono rapporti con enti pubblici e pubblici ufficiali, con particolare attenzione alla tutela di imprese, amministratori e professionisti.',
  },
  {
    title: 'Reati Urbanistici ed Edilizi',
    desc: 'Consulenza e difesa in materia di violazioni urbanistiche, edilizie e paesaggistiche, con supporto nelle fasi investigative e nei procedimenti connessi a interventi edilizi e attività immobiliari.',
  },
  {
    title: 'Reati Finanziari',
    desc: 'Assistenza in procedimenti riguardanti illeciti di natura economica e finanziaria, con un approccio multidisciplinare che integra competenze giuridiche e analisi della documentazione contabile.',
  },
  {
    title: 'Reati Societari',
    desc: 'Tutela di amministratori, dirigenti, soci e società coinvolti in procedimenti relativi alla gestione aziendale e agli obblighi previsti dalla normativa societaria.',
  },
  {
    title: 'Reati contro\nla Persona',
    desc: 'Difesa e assistenza in procedimenti riguardanti fatti lesivi dell\'integrità fisica, morale e personale, sia dalla parte della difesa sia a tutela delle persone offese.',
  },
  {
    title: 'Altri Reati',
    desc: 'Lo Studio presta assistenza anche in ulteriori ambiti del diritto penale, offrendo una valutazione preliminare del caso e individuando il percorso difensivo più adeguato alle circostanze specifiche.',
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
                Difendiamo i nostri clienti con una solida conoscenza tecnica e
                una consolidata esperienza nelle aule di giustizia. Il nostro
                approccio combina preparazione accademica e pragmatismo
                operativo per garantire una tutela efficace in ogni fase del
                procedimento penale.
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
      <section className="contact-v3 bg-navy dp-contact">
        <img src="/assets/pattern-contatti.svg" className="contact-section-pattern" aria-hidden="true" />
        <div className="container contact-container-figma">
          <motion.div 
            className="contact-info-figma"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="serif">Hai bisogno di<br />una consulenza<br />legale?</h2>
            <p className="sans">Siamo a disposizione per rispondere alle vostre esigenze legali. Compilate il modulo per richiedere un primo colloquio.</p>
          </motion.div>
          <div className="contact-divider-figma"></div>
          <motion.div 
            className="contact-form-figma"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <form className="figma-form-new">
              <div className="form-row-2">
                <div className="input-group">
                  <label className="serif">Nome</label>
                  <input type="text" placeholder="Mario" />
                </div>
                <div className="input-group">
                  <label className="serif">Cognome</label>
                  <input type="text" placeholder="Rossi" />
                </div>
              </div>
              <div className="form-row-1">
                <div className="input-group">
                  <label className="serif">Indirizzo Mail</label>
                  <input type="email" placeholder="mariorossi@gmail.com" />
                </div>
              </div>
              <div className="form-row-1">
                <div className="input-group">
                  <label className="serif">Messaggio</label>
                  <textarea placeholder="Scrivi qui il tuo messaggio..." rows="4" />
                </div>
              </div>
              <div className="form-submit-row">
                <button type="submit" className="btn-navy-light mt-3">Contatta lo studio</button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default DirittopenPage;
