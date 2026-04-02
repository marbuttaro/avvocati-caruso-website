import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Team.css';

const professionals = [
  {
    id: 1,
    name: 'Avv. Mario Caruso',
    role: 'Founder & Senior Partner',
    area: 'Diritto Penale & Commerciale',
    bio: 'Fondatore dello studio, con oltre 30 anni di esperienza nel patrocinio avanti alle Giurisdizioni Superiori. Esperto in diritto penale dell\'economia e compliance societaria.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    name: 'Avv. Giulia Bianchi',
    role: 'Partner',
    area: 'Diritto Civile',
    bio: 'Specializzata in successioni internazionali e contrattualistica d\'impresa. Guida il dipartimento civile con un approccio pragmatico e orientato al risultato.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    name: 'Avv. Luca Verdi',
    role: 'Senior Associate',
    area: 'Diritto Commerciale',
    bio: 'Focus su operazioni di M&A e ristrutturazione del debito. Ha maturato una significativa esperienza in studi legali internazionali tra Milano e Londra.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 4,
    name: 'Avv. Elena Neri',
    role: 'Senior Associate',
    area: 'Diritto della Navigazione',
    bio: 'Esperta riconosciuta in diritto marittimo e portuale. Assiste primarie compagnie armatoriali e operatori della logistica doganale.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 5,
    name: 'Avv. Marco Ferrari',
    role: 'Associate',
    area: 'Diritto Penale',
    bio: 'Si occupa di reati contro la Pubblica Amministrazione e diritto penale ambientale. Segue con dedizione la tutela delle persone giuridiche.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 6,
    name: 'Avv. Sofia Russo',
    role: 'Associate',
    area: 'Diritto Civile',
    bio: 'Specializzata in responsabilità civile e diritti reali. Unisce competenza tecnica e una spiccata attitudine alla risoluzione stragiudiziale delle controversie.',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=600'
  }
];

const Team = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="team-v2">
      <header className="team-header section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h5 className="section-subtitle">Our Talent</h5>
            <h1 className="hero-title">I <br/><span className="serif italic">Professionisti</span></h1>
            <p className="max-w-md mt-4">Un team coeso, guidato dall'eccellenza e dalla passione per la giustizia, pronto ad affrontare ogni sfida legale con determinazione.</p>
          </motion.div>
        </div>
      </header>

      <section className="team-grid-section section-padding">
        <div className="container">
          <div className="team-v2-grid">
            {professionals.map((prof, index) => (
              <motion.div 
                key={prof.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="team-v2-card"
                onMouseEnter={() => setHoveredId(prof.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="team-v2-image-wrapper">
                  <motion.img 
                    src={prof.image} 
                    alt={prof.name} 
                    className="team-v2-img"
                    animate={{ scale: hoveredId === prof.id ? 1.05 : 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <AnimatePresence>
                    {hoveredId === prof.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="team-v2-bio-overlay"
                      >
                       <p className="team-v2-bio-text">{prof.bio}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="team-v2-info">
                  <h3 className="team-v2-name">{prof.name}</h3>
                  <p className="team-v2-area">{prof.area}</p>
                  <p className="team-v2-role">{prof.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="join-team section-padding">
        <div className="container text-center">
          <h2 className="section-title">Vuoi unirti al nostro team?</h2>
          <p className="mb-5">Siamo sempre alla ricerca di nuovi talenti carichi di passione e rigore professionale.</p>
          <button className="btn-minimal">Lavora con noi</button>
        </div>
      </section>
    </div>
  );
};

export default Team;
