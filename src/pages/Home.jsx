import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import TiltedCard from '../components/TiltedCard/TiltedCard';
import ImageTrail from '../components/ImageTrail/ImageTrail';
import './Home.css';

const Home = () => {
  return (
    <div className="home-v3">
      {/* Hero Section Figma Style */}
      <section className="hero-v3">
        <div className="hero-v3-bg">
          <img src="/assets/hero-main.jpg" alt="Legal Excellence" />
          <img src="/assets/overlay.svg" alt="" className="hero-v3-overlay-img" />
        </div>
        <div className="container hero-v3-content">
          <div className="hero-v3-left">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-v3-main-title"
            >
              <span className="serif">Studio Legale</span><br />
              <span className="caruso-light">CARUSO</span>
            </motion.h1>
          </div>
          <div className="hero-v3-right">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hero-v3-tagline-box"
            >
              <p className="hero-v3-tagline serif">
                Eccellenza e serietà nella<br />tutela dei vostri diritti.
              </p>
              <button className="btn-navy mt-4">Contatta lo studio</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lo Studio Section */}
      <section className="studio-section section-padding bg-cream">
        <div className="container grid-2">
          <div className="studio-title-col">
            <h2 className="section-title-v3 serif-italic">Lo studio</h2>
          </div>
          <div className="studio-text-col">
            <p className="mb-4">
              Fondato su decenni di esperienza, lo Studio Caruso si evolve costantemente 
              per rispondere alla complessità del panorama giuridico contemporaneo. 
              Non ci limitiamo alla consulenza: costruiamo strategie di difesa proattive.
            </p>
            <p>
              Il nostro approccio unisce rigore accademico e pragmatismo operativo per risolvere 
              le sfide legali più complesse, con una dedizione particolare al dettaglio e alla 
              relazione di fiducia con il cliente.
            </p>
          </div>
        </div>
      </section>

      {/* I Professionisti Preview */}
      <section className="professionals-preview section-padding bg-blue">
        <div className="container">
          <h2 className="section-title-v3 serif-italic text-white mb-5">I professionisti</h2>
          <div className="prof-grid-v3">
            {[
              { name: 'Avv. Alfredo Caruso', role: 'Avvocato penalista', img: '/assets/prof-mario.jpg' },
              { name: 'Avv. Alfredo Caruso', role: 'Avvocato penalista', img: '/assets/prof-luca.jpg' },
              { name: 'Avv. Alfredo Caruso', role: 'Avvocato penalista', img: '/assets/prof-giulia.jpg' },
              { name: 'Avv. Alfredo Caruso', role: 'Avvocato penalista', img: '/assets/portrait-smile-business-man-with-confidence-pride-corporate-career-office-face-arms-crossed-happy-professional-lawyer-attorney-employee-suit-company-australia.jpg' }
            ].map((prof, i) => (
              <div key={i} className="prof-card-v3">
                <div className="prof-img-wrapper">
                  <TiltedCard
                    imageSrc={prof.img}
                    altText={prof.name}
                    captionText={prof.name}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={18}
                    scaleOnHover={1.2}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={false}
                    imageStyle={i === 3 ? { transform: 'scale(1.8)', transformOrigin: 'center 40%' } : {}}
                  />
                </div>
                <div className="prof-info-v3">
                  <h4 className="prof-name-v3 serif">{prof.name}</h4>
                  <p className="prof-role-v3 serif-italic">{prof.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <a href="/team" className="link-more serif-italic">Vedi tutto il team →</a>
          </div>
        </div>
      </section>

      {/* Aree di Competenza Preview FIGMA STYLE */}
      <section className="areas-preview section-padding bg-cream overflow-hidden">
        <div className="container">
          <div className="areas-list-v3 staggered-layout">
            {[
              { id: '01', title: 'Diritto Penale', img: '/assets/services/scott-graham-OQMZwNd3ThU-unsplash.jpg' },
              { id: '02', title: 'Diritto Civile', img: '/assets/services/close-up-businesswoman-joining-team.jpg' },
              { id: '03', title: 'Diritto Commerciale', img: '/assets/services/close-up-businessman-signing-lease-agreement-carcreated-with-generative-ai-technology.jpg' },
              { id: '04', title: 'Diritto della Navigazione', img: '/assets/services/gaetan-marceau-caron-BEKde68fePU-unsplash.jpg' },
              { id: '05', title: 'Compliance 231', img: '/assets/services/carrie-allen-www-carrieallen-com-1H1LBKvD7ew-unsplash.jpg' }
            ].map((area, i, arr) => (
              <div key={i} className={`area-item-v3 stagger-${i + 1}`}>
                <ImageTrail items={Array(10).fill(area.img)} variant={1}>
                  <div className="area-line-top"></div>
                  <div className="area-content-v3">
                    <span className="area-id serif">{area.id}</span>
                    <h3 className="area-title-v3 serif">{area.title}</h3>
                    <ArrowUpRight className="area-arrow" size={32} />
                  </div>
                  {i === arr.length - 1 && <div className="area-line-bottom"></div>}
                </ImageTrail>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts & Footer Bridge */}
      <section className="contact-v3 section-padding bg-navy">
        <div className="container contact-container-figma">
          <div className="contact-info-figma">
            <h2 className="serif">Hai bisogno di<br/>una consulenza<br/>legale?</h2>
            <p className="sans">Siamo a disposizione per rispondere<br/>alle vostre esigenze legali. Compilate<br/>il modulo per richiedere un primo<br/>colloquio.</p>
          </div>
          
          <div className="contact-divider-figma"></div>
          
          <div className="contact-form-figma">
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
                  <input type="text" placeholder="Scrivi qui il tuo messaggio..." />
                </div>
              </div>
              <div className="form-submit-row">
                <button type="submit" className="btn-navy-light mt-3">Contatta lo studio</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
