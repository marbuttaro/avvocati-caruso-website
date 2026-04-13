import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, Briefcase, Anchor, ChevronRight } from 'lucide-react';
import './AreeCompetenza.css';

const aree = [
  {
    id: '01',
    title: 'Diritto Penale',
    icon: <Scale size={48} />,
    image: '/assets/studio-bg.jpg',
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
    id: '02',
    title: 'Diritto Civile',
    icon: <FileText size={48} />,
    image: '/assets/hero-main.jpg',
    description: 'Assistenza strategica in ambito contrattuale, successorio e di responsabilità civile.',
    subcategories: [
      'Contrattualistica d\'Impresa',
      'Successioni e Donazioni',
      'Responsabilità Civile e Medica',
      'Diritti Reali'
    ]
  },
  {
    id: '03',
    title: 'Diritto Commerciale',
    icon: <Briefcase size={48} />,
    image: '/assets/footer-bg.jpg',
    description: 'Consulenza per operazioni straordinarie, M&A e gestione della crisi d\'impresa.',
    subcategories: [
      'Diritto Societario e Governance',
      'M&A e Operazioni Straordinarie',
      'Crisi d\'Impresa e Ristrutturazioni',
      'Contratti Commerciali Internazionali'
    ]
  },
  {
    id: '04',
    title: 'Diritto della Navigazione',
    icon: <Anchor size={48} />,
    image: '/assets/studio-bg.jpg',
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
    <div className="aree-v3-page bg-cream">
      <header className="aree-header-v3 section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="section-title-v3 serif-italic"
          >
            Aree di competenza
          </motion.h1>
          <p className="max-w-md mt-4 opacity-70">
            Un approccio multidisciplinare che unisce rigore accademico e pragmatismo operativo.
          </p>
        </div>
      </header>

      <section className="aree-list-section-v3">
        {aree.map((area, index) => (
          <div key={area.id} className="aree-row-v3">
            <div className="container">
              <div className="area-line-top"></div>
              <div className="aree-content-v3-grid section-padding">
                <div className="aree-num-col">
                  <span className="serif area-v3-num">{area.id}</span>
                </div>
                <div className="aree-text-col">
                  <h2 className="aree-title-v3 serif mb-4">{area.title}</h2>
                  <p className="aree-desc-v3 mb-5 serif-italic">{area.description}</p>
                  
                  <h4 className="sub-heading-v3 serif-italic mb-3">Specializzazioni</h4>
                  <ul className="aree-v3-sublist">
                    {area.subcategories.map((sub, idx) => (
                      <li key={idx} className="aree-v3-subitem">
                        <ChevronRight size={16} className="text-navy" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="aree-image-col-v3">
                  <div className="aree-v3-img-frame">
                    <img src={area.image} alt={area.title} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AreeCompetenza;
