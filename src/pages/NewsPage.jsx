import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { newsItems } from '../data/newsData';
import './NewsPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const NewsPage = () => {
  const { id } = useParams();
  const currentId = parseInt(id);
  const article = newsItems.find(item => item.id === currentId);
  const otherNews = newsItems.filter(item => item.id !== currentId).slice(0, 3);

  if (!article) return <Navigate to="/" replace />;

  const paragraphs = article.content.split('\n\n').filter(p => p.trim() !== '');
  const split = Math.ceil(paragraphs.length / 2);
  const topParagraphs = paragraphs.slice(0, split);
  const bottomParagraphs = paragraphs.slice(split);

  return (
    <div className="single-news-page bg-cream">
      <section className="single-news-section">
        <div className="container">
          <div className="news-article-layout">

            {/* COLONNA SINISTRA — articolo */}
            <motion.article
              className="news-article-main"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <h1 className="single-news-title serif">{article.title}</h1>
              <span className="single-news-date">{article.date}</span>

              <div className="single-news-content sans">
                {topParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>

              <div className="news-article-img-wrap">
                <img
                  src={article.image || '/assets/foto-singola-news.png'}
                  alt=""
                  className="news-article-img"
                />
              </div>

              {bottomParagraphs.length > 0 && (
                <div className="single-news-content sans">
                  {bottomParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              )}
            </motion.article>

            {/* COLONNA DESTRA — altre news */}
            <motion.aside
              className="news-article-sidebar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <h2 className="sidebar-title serif">Altre news</h2>
              <div className="sidebar-divider" />

              <div className="sidebar-news-list">
                {otherNews.map(item => (
                  <Link to={item.slug} className="sidebar-news-card" key={item.id}>
                    <div className="sidebar-card-header">
                      <span className="sidebar-card-date">{item.date}</span>
                      <div className="sidebar-card-line" />
                      <img src="/assets/logotipo-dark.svg" alt="" className="sidebar-card-icon" />
                    </div>
                    <p className="sidebar-card-title serif">{item.title}</p>
                    <span className="sidebar-card-link serif">Leggi l'articolo</span>
                  </Link>
                ))}
              </div>
            </motion.aside>

          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
