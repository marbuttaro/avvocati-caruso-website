import SiteImage from '../components/SiteImage';
import React, { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import './Team.css';

import { professionals } from '../data/professionals.js';
import { personSlug } from '../seo/site.js';


const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function AccordionItem({ prof, index }) {
  const [open, setOpen] = useState(false);
  const interactive = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);

  return (
    <motion.div
      className="accordion-item" id={personSlug(prof.name)}
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.12 }}
    >
      <div className="accordion-separator" />

      <div className="accordion-main">

        {/* Colonna sinistra — tutta cliccabile */}
        <div className="accordion-left" onClick={(event) => { if (!event.target.closest('button, a')) setOpen(!open); }}>
          <span className="accordion-prefix serif">{prof.prefix}</span>
          <h2 className="accordion-name serif">{prof.name}</h2>

          {/* Specializzazione — subito sotto il nome */}
          <span className="accordion-role">{prof.role.toUpperCase()}</span>

          {/* Icona + label */}
          <button
            className="accordion-toggle"
            aria-label={`${open ? 'Chiudi' : 'Leggi'} la biografia di ${prof.name}`}
            aria-expanded={open} aria-controls={`bio-${prof.id}`} onClick={() => setOpen(!open)}
          >
            <SiteImage src={open ? '/assets/close-team.svg' : '/assets/plus-team.svg'} alt="" />
            {!open && <span className="accordion-toggle-label">Approfondisci</span>}
          </button>

          <motion.div
            className="accordion-bio-motion"
            id={`bio-${prof.id}`}
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
            inert={interactive && !open}
          >
            <div className="accordion-bio sans">
              {prof.bio.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              {prof.email && <p className="accordion-email">Contatti: <a href={`mailto:${prof.email}`}>{prof.email}</a></p>}
            </div>
          </motion.div>
        </div>

        {/* Colonna destra: foto sempre visibile */}
        <div className="accordion-photo-wrap">
          <SiteImage src={prof.image} alt={prof.name} className="accordion-photo" />
        </div>

      </div>
    </motion.div>
  );
}

const Team = () => {
  return (
    <div className="team-page bg-cream">
      <section className="team-section">
        <div className="container">

          <motion.div
            className="team-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="team-title serif">I professionisti</h1>
            <p className="team-description sans">
              Un team di professionisti con una solida esperienza nei diversi ambiti del
              diritto, uniti da un approccio condiviso fondato sulla competenza,
              sull'aggiornamento costante e sulla collaborazione interdisciplinare.
            </p>
          </motion.div>

          <motion.div
            className="team-accordion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {professionals.map((prof, index) => (
              <AccordionItem key={prof.id} prof={prof} index={index} />
            ))}
            <div className="accordion-separator" />
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Team;
