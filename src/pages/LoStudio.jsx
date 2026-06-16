import React from 'react';
import { motion } from 'framer-motion';
import './LoStudio.css';

const LoStudio = () => {
  return (
    <div className="lo-studio-page bg-cream">
      <section className="lo-studio-section">
        <div className="container lo-studio-grid">

          {/* Colonna sinistra — titolo e contatti */}
          <motion.div
            className="lo-studio-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="lo-studio-title serif">Dove siamo</h1>
            <div className="lo-studio-divider" />
            <div className="lo-studio-contacts sans">
              <p>Via degli Olmi, 45 Napoli (NA)</p>
              <p>info@avvocaticaruso.it</p>
              <p>081 9047656</p>
            </div>
          </motion.div>

          {/* Colonna destra — foto */}
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
    </div>
  );
};

export default LoStudio;
