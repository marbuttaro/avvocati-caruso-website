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
          <div className="lo-studio-map-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3019.5!2d14.2681!3d40.8518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDUxJzA2LjUiTiAxNMKwMTYnMDUuMiJF!5e0!3m2!1sit!2sit!4v1"
              className="lo-studio-map-iframe"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio Legale Caruso - Mappa"
            />
          </div>
        </div>
      </section>

      <img src="/assets/pattern.svg" alt="" className="lo-studio-pattern-sep" aria-hidden="true" />
    </div>
  );
};

export default LoStudio;
