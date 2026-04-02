import React from 'react';
import './Team.css';

const professionals = [
  {
    id: 1,
    name: 'Avv. Mario Rossi',
    role: 'Partner',
    area: 'Diritto Penale',
    bio: 'Specializzato in reati societari e finanziari, con oltre 20 anni di esperienza nel foro di Milano. Autore di numerose pubblicazioni in materia tributaria.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    name: 'Avv. Giulia Bianchi',
    role: 'Partner',
    area: 'Diritto Civile',
    bio: 'Esperta in contrattualistica d\'impresa e successioni complesse. Assiste primari gruppi industriali italiani ed esteri.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    name: 'Avv. Luca Verdi',
    role: 'Senior Associate',
    area: 'Diritto Commerciale',
    bio: 'Focus su M&A e operazioni straordinarie. Precedente esperienza internazionale in primari studi di Londra e New York.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    name: 'Avv. Elena Neri',
    role: 'Senior Associate',
    area: 'Diritto della Navigazione',
    bio: 'Consulente legale per compagnie armatoriali e referenze portuali. Profonda conoscenza del diritto doganale marittimo.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 5,
    name: 'Avv. Marco Ferrari',
    role: 'Associate',
    area: 'Diritto Penale',
    bio: 'Master in Criminologia e Diritto Penale dell\'Economia. Segue principalmente casi di reati contro la Pubblica Amministrazione.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 6,
    name: 'Avv. Sofia Russo',
    role: 'Associate',
    area: 'Diritto Civile',
    bio: 'Si occupa prevalentemente di contenzioso civile, con un focus particolare sui diritti reali e la responsabilità medica.',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=400'
  }
];

const Team = () => {
  return (
    <div className="team-page">
      <header className="page-header">
        <div className="container text-center">
          <h1>I Professionisti</h1>
          <div className="divider mx-auto" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
          <p className="header-subtitle">Un team multidisciplinare ed esperto al vostro fianco.</p>
        </div>
      </header>

      <section className="section team-section">
        <div className="container">
          <div className="team-grid">
            {professionals.map((prof) => (
              <div key={prof.id} className="team-member">
                <div className="member-image-container">
                  <img src={prof.image} alt={prof.name} className="member-image" />
                  <div className="member-bio-overlay">
                    <p className="bio-text">{prof.bio}</p>
                  </div>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{prof.name}</h3>
                  <p className="member-area">{prof.area}</p>
                  <p className="member-role">{prof.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
