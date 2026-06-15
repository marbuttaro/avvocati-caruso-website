import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { newsItems } from '../data/newsData';
import './NewsPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const NewsPage = () => {
  const { id } = useParams();
  const article = newsItems.find(item => item.id === parseInt(id));

  if (!article) {
    return <Navigate to="/" replace />;
  }

  // Dividiamo il contenuto in paragrafi in base ai ritorni a capo doppi
  const paragraphs = article.content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="single-news-page bg-cream">
      <section className="single-news-section section-padding">
        <div className="container single-news-container">
          
          <motion.div 
            className="single-news-back"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link to="/" className="back-link serif">← Torna alla Home</Link>
          </motion.div>

          <motion.div 
            className="single-news-header"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <span className="single-news-date">{article.date}</span>
            <div className="single-news-header-line" />
            <img src="/assets/logotipo-dark.svg" alt="" className="single-news-icon" />
          </motion.div>

          <motion.h1 
            className="single-news-title serif"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {article.title}
          </motion.h1>

          <motion.div 
            className="single-news-content sans"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default NewsPage;
