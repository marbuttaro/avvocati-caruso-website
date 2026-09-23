import React from 'react';
import { motion } from 'framer-motion';
import './LoStudio.css';

const LoStudio = () => {
  return (
    <div className="lo-studio-page bg-cream">
      <section className="lo-studio-section">
        <div className="container lo-studio-grid">

          <motion.div
            className="lo-studio-photo-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          >
            <img src="/assets/dove-siamo.png" alt="Studio Legale Caruso" className="lo-studio-photo" />
          </motion.div>

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
                Fondato nel 1988 dall'Avvocato Giuseppe Caruso, lo Studio vanta quattro decenni
                di attività nel settore del diritto penale, con una consolidata esperienza in
                materia di reati contro la pubblica amministrazione, reati contro la fede pubblica,
                reati contro l'amministrazione della giustizia, reati tributari, colpa professionale,
                reati ambientali ed urbanistici.
              </p>
              <p>
                Nel corso degli anni, lo Studio ha ampliato il proprio ambito di intervento
                affiancando alle competenze tradizionali una crescente attenzione al diritto
                penale dell'economia e della finanza, nonché alla responsabilità da reato degli
                enti ai sensi del D.Lgs. 231/2001 — settori che richiedono un approccio
                multidisciplinare e una costante attività di aggiornamento normativo e
                giurisprudenziale.
              </p>
              <p>
                Un elemento distintivo del metodo di lavoro è l'attenzione costante all'evoluzione
                della giurisprudenza dell'Unione Europea e alle sue ricadute pratiche
                nell'ordinamento interno, con l'obiettivo di offrire un'assistenza legale sempre
                allineata agli standard più elevati, anche in chiave comparata e sovranazionale.
              </p>
              <p>
                Consapevoli che la domanda di servizi legali raramente si riferisce ad un'unica
                area del diritto, operiamo in stretta sinergia con professionisti di comprovata
                esperienza nel diritto civile, commerciale, societario, della navigazione e
                assicurativo, garantendo un supporto integrato e coordinato su tutti i fronti
                rilevanti per il cliente.
              </p>
              <p>
                Lo Studio si avvale inoltre di una rete selezionata di consulenti esterni —
                tecnici, periti e specialisti di settore — a garanzia di un'assistenza rigorosa
                anche per gli aspetti scientifici delle controversie.
              </p>
              <p>
                Lo Studio opera su tutto il territorio nazionale.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <section className="lo-studio-dove-siamo">
        <div className="container lo-studio-grid">
          <div className="lo-studio-left">
            <h2 className="lo-studio-title serif">Dove siamo</h2>
            <div className="lo-studio-divider" />
            <div className="lo-studio-contacts sans">
              <p>Via Vincenzo Cosenza 31 – 80078 Pozzuoli (NA)</p>
              <p>info@carusoavvocati.it</p>
              <p>081 3032399</p>
            </div>
          </div>
          <div className="lo-studio-map-wrap">
            <iframe
              src="https://www.google.com/maps?q=40.8233438,14.1204631&z=16&output=embed"
              className="lo-studio-map-iframe"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio Legale Caruso - Mappa"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default LoStudio;
