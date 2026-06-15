import React from 'react';
import { motion } from 'framer-motion';
import './NewsPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const newsItems = [
  { id: 1, date: '8/06/2026', title: 'Via libera alla riforma forense: cambia l\'accesso alla professione legale', slug: '/news' },
  { id: 2, date: '8/06/2026', title: 'Nuove norme sulla responsabilità d\'impresa: cosa cambia per le PMI', slug: '/news' },
  { id: 3, date: '8/06/2026', title: 'Diritto della navigazione: aggiornamenti normativi del 2026', slug: '/news' },
  { id: 4, date: '8/06/2026', title: 'Compliance 231: la nuova guida operativa per gli enti', slug: '/news' },
  { id: 5, date: '8/06/2026', title: 'Riforma del processo civile: tempi più brevi per le cause commerciali', slug: '/news' },
  { id: 6, date: '15/06/2026', title: 'Intelligenza artificiale e diritto d\'autore: le nuove direttive europee', slug: '/news' },
];

const NewsPage = () => {
  return (
    <div className="news-page bg-cream">
      <section className="news-page-section section-padding">
        <div className="container">
          <motion.h1 
            className="news-page-title serif"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            News
          </motion.h1>

          <motion.div 
            className="news-page-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {newsItems.map((item) => (
              <motion.div key={item.id} className="news-page-card" variants={fadeUp}>
                <div className="news-page-card-header">
                  <span className="news-page-date">{item.date}</span>
                  <div className="news-page-header-line" />
                  <img src="/assets/logotipo-dark.svg" alt="" className="news-page-icon" />
                </div>
                <h3 className="news-page-card-title serif">{item.title}</h3>
                <a href={item.slug} className="news-page-link">Leggi l'articolo</a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
