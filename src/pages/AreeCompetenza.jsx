import React from 'react';
import './AreeCompetenza.css';
import { Scale, FileText, Briefcase, Anchor, ChevronRight } from 'lucide-react';

const aree = [
  {
    id: 'penale',
    title: 'Diritto Penale',
    icon: <Scale size={40} className="area-icon" />,
    image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      'Reati contro la Pubblica Amministrazione',
      'Reati Urbanistici',
      'Reati Finanziari',
      'Reati Societari',
      'Reati contro la Persona',
      'Altre casistiche in ambito penale'
    ]
  },
  {
    id: 'civile',
    title: 'Diritto Civile',
    icon: <FileText size={40} className="area-icon" />,
    image: 'https://images.unsplash.com/photo-1505664124738-02ceeb607064?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      'Contrattualistica',
      'Successioni e Donazioni',
      'Responsabilità Civile',
      'Diritti Reali'
    ]
  },
  {
    id: 'commerciale',
    title: 'Diritto Commerciale',
    icon: <Briefcase size={40} className="area-icon" />,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      'Diritto Societario',
      'Operazioni Straordinarie',
      'Crisi d\'Impresa',
      'Contratti Commerciali'
    ]
  },
  {
    id: 'navigazione',
    title: 'Diritto della Navigazione',
    icon: <Anchor size={40} className="area-icon" />,
    image: 'https://images.unsplash.com/photo-1542382103-68f700c283af?auto=format&fit=crop&q=80&w=800',
    subcategories: [
      'Contratti di Utilizzazione della Nave',
      'Sinistri Marittimi',
      'Portualità',
      'Diritto Doganale e dei Trasporti'
    ]
  }
];

const AreeCompetenza = () => {
  return (
    <div className="aree-page">
      <header className="page-header">
        <div className="container text-center">
          <h1>Aree di Competenza</h1>
          <div className="divider mx-auto" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
          <p className="header-subtitle">Assistenza altamente specializzata per ogni ambito del diritto.</p>
        </div>
      </header>

      <section className="section areas-section">
        <div className="container">
          <div className="areas-grid">
            {aree.map((area) => (
              <div key={area.id} className="area-card">
                <div className="area-image-wrapper">
                  <div className="area-image-overlay"></div>
                  <img src={area.image} alt={area.title} className="area-image" />
                  <div className="area-icon-container">
                    {area.icon}
                  </div>
                </div>
                <div className="area-content">
                  <h3 className="area-title">{area.title}</h3>
                  <ul className="subcategories-list">
                    {area.subcategories.map((sub, idx) => (
                      <li key={idx}>
                        <ChevronRight size={16} className="bullet-icon"/>
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AreeCompetenza;
