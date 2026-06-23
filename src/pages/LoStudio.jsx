import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoStudio.css';
import './Home.css';

const faqItems = [
  {
    q: 'È possibile impugnare un contratto già firmato?',
    a: "Sì, in determinati casi un contratto già firmato può essere impugnato per vizi del consenso, illiceità dell'oggetto o della causa, o per mancanza dei requisiti di forma previsti dalla legge. È fondamentale agire tempestivamente, poiché i termini di prescrizione variano a seconda del tipo di vizio contestato.",
  },
  {
    q: 'Quando è necessario avviare una pratica di successione?',
    a: "La pratica successoria deve essere avviata entro dodici mesi dal decesso del de cuius per evitare sanzioni fiscali. Include la dichiarazione di successione, la valutazione dei beni ereditari e, se necessario, la rinuncia all'eredità in caso di debiti superiori all'attivo.",
  },
  {
    q: 'Quali vantaggi offre una consulenza legale preventiva per le imprese?',
    a: "La consulenza preventiva consente di individuare e gestire i rischi prima che si trasformino in controversie. Attraverso l'analisi di contratti, assetti societari, procedure aziendali e profili di compliance, è possibile ridurre costi, responsabilità e potenziali contenziosi futuri.",
  },
  {
    q: 'Come tutelarsi in caso di controversia commerciale?',
    a: "In presenza di una controversia commerciale è opportuno raccogliere tutta la documentazione contrattuale e le comunicazioni intercorse, procedere con una messa in mora formale e valutare se ricorrere alla mediazione obbligatoria o all'azione giudiziale, in base all'entità del danno e ai tempi stimati.",
  },
];

const LoStudio = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <div className="lo-studio-page bg-cream">
      <section className="lo-studio-section">
        <div className="container lo-studio-grid">

          <motion.div
            className="lo-studio-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="lo-studio-title serif">Lo studio</h1>
            <div className="lo-studio-divider" />
            <div className="lo-studio-text sans">
              <p>
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
          </motion.div>

          <motion.div
            className="lo-studio-photo-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          >
            <img src="/assets/dove-siamo.png" alt="Studio Legale Caruso" className="lo-studio-photo" />
          </motion.div>

        </div>
      </section>

      <section className="lo-studio-dove-siamo">
        <div className="container lo-studio-grid">
          <div className="lo-studio-left">
            <h2 className="lo-studio-title serif">Dove siamo</h2>
            <div className="lo-studio-divider" />
            <div className="lo-studio-contacts sans">
              <p>Via degli Olmi, 45 Napoli (NA)</p>
              <p>info@avvocaticaruso.it</p>
              <p>081 9047656</p>
            </div>
          </div>
        </div>
      </section>

      <img src="/assets/pattern.svg" alt="" className="lo-studio-pattern-sep" aria-hidden="true" />

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
    </div>
  );
};

export default LoStudio;
