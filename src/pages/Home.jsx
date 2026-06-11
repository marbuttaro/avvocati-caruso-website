import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import TiltedCard from '../components/TiltedCard/TiltedCard';
import ImageTrail from '../components/ImageTrail/ImageTrail';
import SplitText from '../components/SplitText/SplitText';
import './Home.css';

const tickerItems = ['Consulenza', 'Difesa in giudizio', 'Compliance'];

const services = [
  { id: '01', title: 'Diritto Penale',           slug: '/aree-competenza' },
  { id: '02', title: 'Diritto Civile',            slug: '/aree-competenza' },
  { id: '03', title: 'Diritto Commerciale',       slug: '/aree-competenza' },
  { id: '04', title: 'Diritto della Navigazione', slug: '/aree-competenza' },
  { id: '05', title: 'Compliance 231',            slug: '/aree-competenza' },
];

function StudioSlider() {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const onMouseDown = (e) => {
    dragging.current = true;
    startX.current = e.pageX;
    startScroll.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
    setHoveredIdx(null);
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const walk = (e.pageX - startX.current) * 1.5;
    trackRef.current.scrollLeft = startScroll.current - walk;
  };

  const stopDrag = () => {
    dragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  };

  return (
    <div className="studio-slider-root">
      <div
        ref={trackRef}
        className="studio-slider-track"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onScroll={onScroll}
      >
        {services.map((svc, i) => (
          <div
            key={i}
            className="studio-slide-item"
            onMouseEnter={() => { if (!dragging.current) setHoveredIdx(i); }}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span className="slide-num">{svc.id}</span>
            <div style={{ position: 'relative' }}>
              <h3 className="slide-title">{svc.title}</h3>
              <a
                href={svc.slug}
                className={`btn-scopri${hoveredIdx === i ? ' visible' : ''}`}
                tabIndex={hoveredIdx === i ? 0 : -1}
              >
                Scopri di più
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="studio-progress-track">
        <div className="studio-progress-bar" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

const Home = () => {
  return (
    <div className="home-v3">
      {/* Hero Section — Homepage 5 */}
      <section className="hero-v5">
        <img src="/assets/logotipo-watermark.svg" alt="" className="hero-v5-watermark" aria-hidden="true" />
        <div className="hero-v5-ticker-wrap" aria-hidden="true">
          <div className="hero-v5-ticker">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <React.Fragment key={i}>
                <span className="ticker-text serif">{item}</span>
                <img src="/assets/logotipo-orange.svg" alt="" className="ticker-sep" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Lo Studio Section */}
      <section className="studio-v5 section-padding bg-cream">
        <div className="container">
          <div className="studio-v5-top">
            <div className="studio-v5-left">
              <h2 className="studio-v5-title serif">Lo studio</h2>
            </div>
            <div className="studio-v5-right">
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
          <p className="studio-v5-tagline">
            Consulenze legali<br />su misura per imprese e privati.
          </p>
          <StudioSlider />
        </div>
      </section>

      {/* I Professionisti Preview FIGMA STYLE */}
      <section className="professionals-preview section-padding bg-blue overflow-hidden">
        <div className="container relative">
          <div className="prof-header-row">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="section-title-v3-large serif-italic text-white"
            >
              I professionisti
            </motion.h2>
          </div>
          <div className="prof-grid-v3">
            {[
              { name: 'Avv. Alfredo Caruso', role: 'Avvocato penalista', img: '/assets/prof-mario.jpg' },
              { name: 'Avv. Alfredo Caruso', role: 'Avvocato penalista', img: '/assets/prof-luca.jpg' },
              { name: 'Avv. Alfredo Caruso', role: 'Avvocato penalista', img: '/assets/prof-giulia.jpg' },
              { name: 'Avv. Alfredo Caruso', role: 'Avvocato penalista', img: '/assets/prof-last.png' }
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
                    scaleOnHover={1}
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
          <div className="text-center mt-12">
            <a href="/team" className="btn-pill-navy serif">Scopri il nostro Team</a>
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
                <ImageTrail items={[area.img]} variant={1}>
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
