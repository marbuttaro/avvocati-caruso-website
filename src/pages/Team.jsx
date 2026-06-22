import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Team.css';

const professionals = [
  {
    id: 1,
    prefix: 'Avv.',
    name: 'Alfredo Caruso',
    role: 'Avvocato Penalista',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia. Ut sem ligula, fringilla eget tempor vel, tincidunt at magna. Quisque fermentum ante nec pellentesque luctus. Quisque vehicula nunc sed dui semper egestas.',
    image: '/assets/prof-alfredo.jpg',
  },
  {
    id: 2,
    prefix: 'Avv.',
    name: 'Marco Ferretti',
    role: 'Avvocato Civilista',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia. Ut sem ligula, fringilla eget tempor vel, tincidunt at magna. Quisque fermentum ante nec pellentesque luctus.',
    image: '/assets/prof-mario.jpg',
  },
  {
    id: 3,
    prefix: 'Avv.ssa',
    name: 'Laura Bianchi',
    role: 'Avvocato Commercialista',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia. Ut sem ligula, fringilla eget tempor vel, tincidunt at magna. Quisque fermentum ante nec pellentesque luctus.',
    image: '/assets/prof-giulia.jpg',
  },
  {
    id: 4,
    prefix: 'Avv.ssa',
    name: 'Giulia Romano',
    role: 'Avvocato Marittimista',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia. Ut sem ligula, fringilla eget tempor vel, tincidunt at magna. Quisque fermentum ante nec pellentesque luctus.',
    image: '/assets/prof-elena.jpg',
  },
  {
    id: 5,
    prefix: 'Avv.',
    name: 'Marco Ferrari',
    role: 'Avvocato Penalista',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia. Ut sem ligula, fringilla eget tempor vel, tincidunt at magna. Quisque fermentum ante nec pellentesque luctus.',
    image: '/assets/prof-marco.jpg',
  },
];

function AccordionItem({ prof }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-separator" />

      <div className="accordion-main">

        {/* Colonna sinistra — tutta cliccabile */}
        <div className="accordion-left" onClick={() => setOpen(!open)}>
          <span className="accordion-prefix serif">{prof.prefix}</span>
          <h2 className="accordion-name serif">{prof.name}</h2>

          {/* Icona sotto il nome */}
          <button
            className="accordion-toggle"
            aria-label={open ? 'Chiudi' : 'Apri'}
          >
            <img src={open ? '/assets/close-team.svg' : '/assets/plus-team.svg'} alt="" />
          </button>

          {/* Bio animata */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="bio"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <p className="accordion-bio sans">{prof.bio}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Specializzazione — sempre visibile, subito sopra la linea */}
          <span className="accordion-role">{prof.role.toUpperCase()}</span>
        </div>

        {/* Colonna destra: foto sempre visibile */}
        <div className="accordion-photo-wrap">
          <img src={prof.image} alt={prof.name} className="accordion-photo" />
        </div>

      </div>
    </div>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis
              fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo
              et gravida lacinia. Ut sem ligula, fringilla eget tempor vel, tincidunt at
              magna. Quisque fermentum ante nec pellentesque luctus. Quisque vehicula nunc
              sed dui semper egestas.
            </p>
          </motion.div>

          <motion.div
            className="team-accordion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {professionals.map((prof) => (
              <AccordionItem key={prof.id} prof={prof} />
            ))}
            <div className="accordion-separator" />
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Team;
