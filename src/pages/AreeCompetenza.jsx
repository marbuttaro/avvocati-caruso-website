import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, Briefcase, Anchor, ChevronRight } from 'lucide-react';
import './AreeCompetenza.css';

const aree = [
  {
    id: 'penale',
    title: 'Diritto Penale',
    icon: <Scale size={48} />,
    image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&q=80&w=1200',
    description: 'Difesa penale specializzata per reati societari, finanziari e contro la Pubblica Amministrazione.',
    subcategories: [
      'Reati contro la Pubblica Amministrazione',
      'Reati Urbanistici e Ambientali',
      'Reati Finanziari e Tributari',
      'Reati Societari',
      'Reati contro la Persona'
    ]
  },
  {
    id: 'civile',
    title: 'Diritto Civile',
    icon: <FileText size={48} />,
    image: 'https://images.unsplash.com/photo-1505664124738-02ceeb607064?auto=format&fit=crop&q=80&w=1200',
    description: 'Assistenza strategica in ambito contrattuale, successorio e di responsabilità civile.',
    subcategories: [
      'Contrattualistica d\'Impresa',
      'Successioni e Donazioni',
      'Responsabilità Civile e Medica',
      'Diritti Reali'
    ]
  },
  {
    id: 'commerciale',
    title: 'Diritto Commerciale',
    icon: <Briefcase size={48} />,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    description: 'Consulenza per operazioni straordinarie, M&A e gestione della crisi d\'impresa.',
    subcategories: [
      'Diritto Societario e Governance',
      'M&A e Operazioni Straordinarie',
      'Crisi d\'Impresa e Ristrutturazioni',
      'Contratti Commerciali Internazionali'
    ]
  },
  {
    id: 'navigazione',
    title: 'Diritto della Navigazione',
    icon: <Anchor size={48} />,
    image: 'https://images.unsplash.com/photo-1542382103-68f700c283af?auto=format&fit=crop&q=80&w=1200',
    description: 'Tutela legale nel settore marittimo, portuale e marittimo-doganale.',
    subcategories: [
      'Contratti di Utilizzazione della Nave',
      'Sinistri Marittimi e Assicurazioni',
      'Diritto Portuale e Doganale',
      'Trasporti e Logistica'
    ]
  }
];

const AreeCompetenza = () => {
  return (
    <div className="aree-v2">
      <header className="aree-header section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h5 className="section-subtitle">Deep Expertise</h5>
            <h1 className="hero-title">Aree di <br/><span className="serif italic">Competenza</span></h1>
            <p className="max-w-md mt-4">Un approccio multidisciplinare che unisce rigore accademico e pragmatismo operativo per risolvere le sfide legali più complesse.</p>
          </motion.div>
        </div>
      </header>

      <section className="aree-list-section">
        {aree.map((area, index) => (
          <div key={area.id} id={area.id} className={`aree-row ${index % 2 !== 0 ? 'row-reverse' : ''}`}>
            <div className="aree-image-col">
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                viewport={{ once: true }}
                className="overflow-hidden h-full"
              >
                <img src={area.image} alt={area.title} className="aree-bg-img" />
              </motion.div>
            </div>
            <div className="aree-content-col section-padding">
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="aree-icon-box mb-4">
                  {area.icon}
                </div>
                <h2 className="aree-title-v2 mb-3">{area.title}</h2>
                <p className="aree-desc-v2 mb-5">{area.description}</p>
                
                <h4 className="sub-heading mb-4">Specializzazioni</h4>
                <ul className="aree-sub-list">
                  {area.subcategories.map((sub, idx) => (
                    <li key={idx} className="aree-sub-item">
                      <ChevronRight size={18} className="text-accent" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      <section className="cta-banner section-padding">
        <div className="container text-center">
          <h2 className="section-title">Hai bisogno di consulenza specifica?</h2>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="btn-minimal mt-4"
          >
            Contatta lo studio
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default AreeCompetenza;
