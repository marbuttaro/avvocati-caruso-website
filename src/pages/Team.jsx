import SiteImage from '../components/SiteImage';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Team.css';

import { professionals } from '../data/professionals.js';
import { personSlug } from '../seo/site.js';


function AccordionItem({ prof, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="accordion-item" id={personSlug(prof.name)}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.12 }}
    >
      <div className="accordion-separator" />

      <div className="accordion-main">

        {/* Colonna sinistra — tutta cliccabile */}
        <div className="accordion-left">
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

          <div id={`bio-${prof.id}`} hidden={!open} className="accordion-bio sans">
            {prof.bio.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            {prof.email && <p className="accordion-email">Contatti: <a href={`mailto:${prof.email}`}>{prof.email}</a></p>}
          </div>
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
            initial={false}
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
            initial={false}
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
