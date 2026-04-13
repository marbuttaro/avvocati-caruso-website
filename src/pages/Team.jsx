import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Team.css';

const professionals = [
  {
    id: 1,
    name: 'Avv. Alfredo Caruso',
    role: 'Founder & Senior Partner',
    area: 'Diritto Penale & Commerciale',
    bio: 'Fondatore dello studio, con oltre 30 anni di esperienza nel patrocinio avanti alle Giurisdizioni Superiori. Esperto in diritto penale dell\'economia e compliance societaria.',
    image: '/assets/prof-mario.jpg'
  },
  {
    id: 2,
    name: 'Avv. Giulia Bianchi',
    role: 'Partner',
    area: 'Diritto Civile',
    bio: 'Specializzata in successioni internazionali e contrattualistica d\'impresa. Guida il dipartimento civile con un approccio pragmatico e orientato al risultato.',
    image: '/assets/prof-giulia.jpg'
  },
  {
    id: 3,
    name: 'Avv. Luca Verdi',
    role: 'Senior Associate',
    area: 'Diritto Commerciale',
    bio: 'Focus su operazioni di M&A e ristrutturazione del debito. Ha maturato una significativa esperienza in studi legali internazionali tra Milano e Londra.',
    image: '/assets/prof-luca.jpg'
  },
  {
    id: 4,
    name: 'Avv. Elena Neri',
    role: 'Senior Associate',
    area: 'Diritto della Navigazione',
    bio: 'Esperta riconosciuta in diritto marittimo e portuale. Assiste primarie compagnie armatoriali e operatori della logistica doganale.',
    image: '/assets/prof-elena.jpg'
  },
  {
    id: 5,
    name: 'Avv. Marco Ferrari',
    role: 'Associate',
    area: 'Diritto Penale',
    bio: 'Si occupa di reati contro la Pubblica Amministrazione e diritto penale ambientale. Segue con dedizione la tutela delle persone giuridiche.',
    image: '/assets/prof-marco.jpg'
  }
];

const Team = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="team-v3-page bg-blue">
      <header className="team-header-v3 section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="section-title-v3 serif-italic text-white"
          >
            I professionisti
          </motion.h1>
          <p className="max-w-md mt-4 text-white opacity-70">
            Un team di esperti dediti all'eccellenza, uniti da una visione moderna della professione legale.
          </p>
        </div>
      </header>

      <section className="team-grid-section-v3 section-padding pb-5">
        <div className="container">
          <div className="prof-grid-v3">
            {professionals.map((prof, index) => (
              <motion.div 
                key={prof.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="prof-card-v3"
                onMouseEnter={() => setHoveredId(prof.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="prof-img-wrapper figma-frame">
                  <img src={prof.image} alt={prof.name} />
                  <AnimatePresence>
                    {hoveredId === prof.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="prof-bio-overlay-v3"
                      >
                        <p className="prof-bio-text-v3 serif-italic">{prof.bio}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="prof-info-v3">
                  <h4 className="prof-name-v3 serif">{prof.name}</h4>
                  <p className="prof-role-v3 serif-italic">{prof.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="join-team-v3 section-padding text-center">
        <div className="container">
          <h2 className="serif-italic text-white mb-4">Lavora con noi</h2>
          <button className="btn-navy-light">Invia CV</button>
        </div>
      </section>
    </div>
  );
};

export default Team;
