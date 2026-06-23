import React, { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import TiltedCard from '../components/TiltedCard/TiltedCard';
import ImageTrail from '../components/ImageTrail/ImageTrail';
import SplitText from '../components/SplitText/SplitText';
import { newsItems } from '../data/newsData';
import './Home.css';

const tickerItems = ['Consulenza', 'Difesa in giudizio', 'Compliance'];

const services = [
  { id: '01', title: 'Diritto Penale',           slug: '/diritto-penale' },
  { id: '02', title: 'Diritto Civile',            slug: '/aree-competenza' },
  { id: '03', title: 'Diritto Commerciale',       slug: '/aree-competenza' },
  { id: '04', title: 'Diritto della Navigazione', slug: '/aree-competenza' },
  { id: '05', title: 'Compliance 231',            slug: '/aree-competenza' },
];



const faqItems = [
  {
    q: 'È possibile impugnare un contratto già firmato?',
    a: 'Sì, in determinati casi un contratto già firmato può essere impugnato per vizi del consenso, illiceità dell\'oggetto o della causa, o per mancanza dei requisiti di forma previsti dalla legge. È fondamentale agire tempestivamente, poiché i termini di prescrizione variano a seconda del tipo di vizio contestato.',
  },
  {
    q: 'Quando è necessario avviare una pratica di successione?',
    a: 'La pratica successoria deve essere avviata entro dodici mesi dal decesso del de cuius per evitare sanzioni fiscali. Include la dichiarazione di successione, la valutazione dei beni ereditari e, se necessario, la rinuncia all\'eredità in caso di debiti superiori all\'attivo.',
  },
  {
    q: 'Quali vantaggi offre una consulenza legale preventiva per le imprese?',
    a: 'La consulenza preventiva consente di individuare e gestire i rischi prima che si trasformino in controversie. Attraverso l\'analisi di contratti, assetti societari, procedure aziendali e profili di compliance, è possibile ridurre costi, responsabilità e potenziali contenziosi futuri.',
  },
  {
    q: 'Come tutelarsi in caso di controversia commerciale?',
    a: 'In presenza di una controversia commerciale è opportuno raccogliere tutta la documentazione contrattuale e le comunicazioni intercorse, procedere con una messa in mora formale e valutare se ricorrere alla mediazione obbligatoria o all\'azione giudiziale, in base all\'entità del danno e ai tempi stimati.',
  },
];

const professionals = [
  {
    id: 0, prefix: 'Avv.', name: 'Alfredo Caruso',
    img: '/assets/prof-luca.jpg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia.',
  },
  {
    id: 1, prefix: 'Avv.', name: 'Marco Ferretti',
    img: '/assets/prof-mario.jpg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia.',
  },
  {
    id: 2, prefix: 'Avv.ssa', name: 'Laura Bianchi',
    img: '/assets/prof-giulia.jpg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia.',
  },
  {
    id: 3, prefix: 'Avv.ssa', name: 'Giulia Romano',
    img: '/assets/prof-elena.jpg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis fermentum odio, sit amet sollicitudin ipsum fringilla a. Nullam varius justo et gravida lacinia.',
  },
];

function NewsSlider() {
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const onMouseDown = (e) => {
    dragging.current = true;
    startX.current = e.pageX;
    startScroll.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
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
    <div
      ref={trackRef}
      className="news-v5-track"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {newsItems.map((item) => (
        <div key={item.id} className="news-v5-card">
          <div className="news-v5-card-header">
            <span className="news-v5-date">{item.date}</span>
            <div className="news-v5-header-line" />
            <img src="/assets/logotipo.svg" alt="" className="news-v5-icon" />
          </div>
          <a href={item.slug} className="news-v5-card-title-link"><h3 className="news-v5-card-title serif">{item.title}</h3></a>
          <a href={item.slug} className="news-v5-link">Leggi l'articolo</a>
        </div>
      ))}
    </div>
  );
}

const SIZE_OPACITY = { sm: 0.42, md: 0.68, lg: 1 };
function StudioRisponde() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <section className="faq-v5">
      <div className="faq-v5-inner">
        <div className="faq-v5-left">
          <h2 className="faq-v5-title serif">Lo Studio<br />risponde</h2>
          <p className="faq-v5-subtitle">
            Risposte chiare alle domande più frequenti su diritto penale, civile, societario e compliance.
          </p>
        </div>
        <div className="faq-v5-right">
          {faqItems.map((item, i) => (
            <div key={i} className="faq-item" onClick={() => toggle(i)}>
              <div className="faq-item-header">
                <span className="faq-item-question serif">{item.q}</span>
                <img
                  src={openIdx === i ? '/assets/minus.svg' : '/assets/plus.svg'}
                  alt=""
                  className="faq-item-icon"
                />
              </div>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="faq-item-answer">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SLIDE_EASE = [0.16, 1, 0.3, 1];

function ProfessionistiSlider() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const n = professionals.length;

  const navigate = (d) => {
    setDir(d);
    setActiveIdx(i => (i + d + n) % n);
  };

  // Left→right: [sm=idx+2, md=idx+1, lg=idx]
  // On next (+1): md grows→lg (layout), sm shifts→md (layout), old lg fades out, new sm enters from left
  const visiblePhotos = [
    { key: (activeIdx + 2) % n, prof: professionals[(activeIdx + 2) % n], size: 'sm' },
    { key: (activeIdx + 1) % n, prof: professionals[(activeIdx + 1) % n], size: 'md' },
    { key: activeIdx,            prof: professionals[activeIdx],            size: 'lg' },
  ];

  const active = professionals[activeIdx];

  return (
    <section className="prof-v5">
      <div className="prof-v5-layout">
        <div className="prof-v5-left">
          <h2 className="prof-v5-title serif">I professionisti</h2>
          <div className="prof-v5-photos">
            <AnimatePresence mode="popLayout" initial={false}>
              {visiblePhotos.map(({ key, prof, size }) => (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, x: dir > 0 ? -40 : 40 }}
                  animate={{ opacity: SIZE_OPACITY[size], x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.28, ease: 'easeOut' } }}
                  transition={{ duration: 0.65, ease: SLIDE_EASE }}
                  className={`prof-v5-photo prof-v5-photo--${size}`}
                >
                  <img src={prof.img} alt={prof.name} draggable="false" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="prof-v5-info">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="prof-v5-info-inner"
            >
              <span className="prof-v5-prefix serif">{active.prefix}</span>
              <h3 className="prof-v5-name serif">{active.name}</h3>
              <p className="prof-v5-bio">{active.bio}</p>
            </motion.div>
          </AnimatePresence>
          <div className="prof-v5-arrows">
            <button onClick={() => navigate(-1)} className="prof-arrow-btn" aria-label="Precedente">
              <img src="/assets/arrow.svg" alt="" style={{ transform: 'scaleX(-1)' }} />
            </button>
            <button onClick={() => navigate(1)} className="prof-arrow-btn" aria-label="Successivo">
              <img src="/assets/arrow.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
              {svc.slug === '/diritto-penale' && (
                <Link
                  to={svc.slug}
                  className={`btn-scopri${hoveredIdx === i ? ' visible' : ''}`}
                  tabIndex={hoveredIdx === i ? 0 : -1}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  Scopri di più
                </Link>
              )}
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

const TIME_SLOTS = [];
for (let h = 9; h < 18; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2,'0')}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2,'0')}:30`);
}
TIME_SLOTS.push('18:00');

function ContactSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="contatti" className="contact-section-new">
      <div className="container">
        <div className="contact-tab-row">
          <button
            className={`ct-tab serif${activeTab === 0 ? ' ct-tab-active' : ''}`}
            onClick={() => setActiveTab(0)}
          >Contattaci</button>
          <button
            className={`ct-tab serif${activeTab === 1 ? ' ct-tab-active' : ''}`}
            onClick={() => setActiveTab(1)}
          >Prenota un appuntamento</button>
        </div>

        <div className="contact-body-new">
          <img src="/assets/pattern-contatti.svg" className="contact-section-pattern" aria-hidden="true" />

          <div className="contact-body-inner">
            <div className="contact-info-figma">
              <AnimatePresence mode="wait">
                {activeTab === 0 ? (
                  <motion.div key="t0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <h2 className="serif">Hai bisogno di<br/>una consulenza<br/>legale?</h2>
                    <p className="sans">Siamo a disposizione per rispondere<br/>alle vostre esigenze legali. Compilate<br/>il modulo per richiedere un primo<br/>colloquio.</p>
                  </motion.div>
                ) : (
                  <motion.div key="t1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <h2 className="serif">Incontra<br/>i nostri<br/>professionisti</h2>
                    <p className="sans">Prenota una consulenza dedicata<br/>per approfondire il tuo caso e<br/>ricevere assistenza qualificata.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="contact-divider-figma"></div>

            <div className="contact-form-figma">
              <AnimatePresence mode="wait">
                {activeTab === 0 ? (
                  <motion.form key="fc" className="figma-form-new" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                    <div className="form-row-2">
                      <div className="input-group"><label className="serif">Nome</label><input type="text" placeholder="Mario" /></div>
                      <div className="input-group"><label className="serif">Cognome</label><input type="text" placeholder="Rossi" /></div>
                    </div>
                    <div className="form-row-1"><div className="input-group"><label className="serif">Indirizzo Mail</label><input type="email" placeholder="mariorossi@gmail.com" /></div></div>
                    <div className="form-row-1"><div className="input-group"><label className="serif">Messaggio</label><textarea placeholder="Scrivi qui il tuo messaggio..." rows="4" /></div></div>
                    <div className="form-submit-row"><button type="submit" className="btn-navy-light mt-3">Contatta lo studio</button></div>
                  </motion.form>
                ) : (
                  <motion.form key="fb" className="figma-form-new" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
                    <div className="form-row-2">
                      <div className="input-group"><label className="serif">Nome</label><input type="text" placeholder="Mario" /></div>
                      <div className="input-group"><label className="serif">Cognome</label><input type="text" placeholder="Rossi" /></div>
                    </div>
                    <div className="form-row-1"><div className="input-group"><label className="serif">Indirizzo Mail</label><input type="email" placeholder="mariorossi@gmail.com" /></div></div>
                    <div className="form-row-2">
                      <div className="input-group">
                        <label className="serif">Data</label>
                        <div className="select-wrap"><input type="date" className="custom-select" /><img src="/assets/arrow-down.svg" alt="" className="select-arrow" /></div>
                      </div>
                      <div className="input-group">
                        <label className="serif">Ora</label>
                        <div className="select-wrap">
                          <select className="custom-select"><option value="">seleziona la fascia oraria</option>{TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}</select>
                          <img src="/assets/arrow-down.svg" alt="" className="select-arrow" />
                        </div>
                      </div>
                    </div>
                    <div className="form-submit-row"><button type="submit" className="btn-navy-light mt-3">Contatta lo studio</button></div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Home = () => {
  const heroRef   = useRef(null);
  const studioRef = useRef(null);
  const location  = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;
    if (!sectionId) return;
    const t = setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(t);
  }, [location.state]);

  // Set studio sticky bottom so it stays visible exactly while hero scrolls over it
  useLayoutEffect(() => {
    const setBottom = () => {
      if (studioRef.current) {
        const offset = 180;
        const b = window.innerHeight - studioRef.current.offsetHeight - offset;
        studioRef.current.style.bottom = `${b}px`;
      }
    };
    setBottom();
    window.addEventListener('resize', setBottom);
    return () => window.removeEventListener('resize', setBottom);
  }, []);

  // Track hero scrolling off: progress 0 = hero at top, 1 = hero fully gone
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  // Studio overlay fades from opaque → transparent as hero scrolls away
  const studioOverlayOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  // Studio inner content rises as hero scrolls off (parallax: starts 120px lower)
  const studioContentY = useTransform(heroScroll, [0, 1], [120, 0]);

  return (
    <div className="home-v3">

      {/* ── CodyHouse Revealing Hero ─────────────────────────────────────────
          DOM order: hero  FIRST  (z-index 2, scrolls away normally)
                     studio SECOND (sticky bottom, z-index 1, revealed underneath)
      ─────────────────────────────────────────────────────────────────────── */}

      {/* 1. Hero — first in DOM, z-index 2, scrolls off to reveal studio */}
      <section ref={heroRef} className="hero-v5">
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

      {/* 2. Studio — sticky (bottom set via JS), z-index 1, overlay fades as hero scrolls off */}
      <section id="studio" ref={studioRef} className="studio-v5 section-padding bg-cream">
        <motion.div className="studio-reveal-overlay" style={{ opacity: studioOverlayOpacity }} aria-hidden="true" />
        <motion.div style={{ y: studioContentY }}>
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
          </div>
          <StudioSlider />
        </motion.div>
      </section>

      {/* 3. All sections after studio — z-index 2 to render above sticky studio */}
      <div className="content-over-hero">

        <ProfessionistiSlider />

        {/* News Section */}
        <section id="news" className="news-v5 section-padding bg-cream">
          <h2 className="news-v5-title serif">News</h2>
          <NewsSlider />
        </section>

        {/* Full-width photo */}
        <img src="/assets/foto.png" alt="" className="foto-full" />

        {/* Lo Studio Risponde — FAQ */}
        <StudioRisponde />

        {/* Pattern separator */}
        <img src="/assets/pattern.svg" alt="" className="pattern-separator" aria-hidden="true" />

        {/* Dove Siamo */}
        <section className="dove-siamo-section bg-cream">
          <div className="container dove-siamo-grid">
            <div className="dove-siamo-left">
              <h2 className="dove-siamo-title serif">Dove siamo</h2>
              <div className="dove-siamo-divider" />
              <div className="dove-siamo-contacts sans">
                <p>Via degli Olmi, 45 Napoli (NA)</p>
                <p>info@avvocaticaruso.it</p>
                <p>081 9047656</p>
              </div>
            </div>
            <div className="dove-siamo-photo-wrap">
              <img src="/assets/dove-siamo.png" alt="Studio Legale Caruso" className="dove-siamo-photo" />
            </div>
          </div>
        </section>

        {/* Contacts & Footer Bridge */}
        <ContactSection />

      </div>{/* end content-over-hero */}
    </div>
  );
};

export default Home;
