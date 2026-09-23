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
  const seenTitles = new Set(article ? [article.title] : []);
  const otherNews = newsItems.filter(item => {
    if (item.id === currentId || seenTitles.has(item.title)) return false;
    seenTitles.add(item.title);
    return true;
  }).slice(0, 3);

  if (!article) return <Navigate to="/" replace />;

  const currentIndex = newsItems.findIndex(item => item.id === currentId);
  const prevArticle = newsItems[(currentIndex - 1 + newsItems.length) % newsItems.length];
  const nextArticle = newsItems[(currentIndex + 1) % newsItems.length];

  const rawParagraphs = article.content.split('\n\n').filter(p => p.trim() !== '');
  const isAuthorLine = (p) => /^Avv\./.test(p.trim());
  const hasAuthorLine = rawParagraphs.length > 0 && isAuthorLine(rawParagraphs[rawParagraphs.length - 1]);
  const authorLine = hasAuthorLine ? rawParagraphs[rawParagraphs.length - 1] : null;
  const paragraphs = hasAuthorLine ? rawParagraphs.slice(0, -1) : rawParagraphs;
  const split = Math.ceil(paragraphs.length / 2);
  const topParagraphs = paragraphs.slice(0, split);
  const bottomParagraphs = paragraphs.slice(split);

  return (
    <div className="single-news-page bg-cream">
      <section className="single-news-section">
        <div className="container">
          <div className="single-news-article-nav">
            <Link to={prevArticle.slug} className="single-news-article-nav-link serif">
              <span className="single-news-article-nav-arrow">&lt;</span> Indietro
            </Link>
            <Link to={nextArticle.slug} className="single-news-article-nav-link serif">
              Prossimo <span className="single-news-article-nav-arrow">&gt;</span>
            </Link>
          </div>

          <div className="news-article-layout">

            {/* COLONNA SINISTRA — articolo */}
            <motion.article
              className="news-article-main"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <h1 className="single-news-title serif">{article.pageTitle || article.title}</h1>
              {article.subtitle && (
                <p className="single-news-subtitle serif">{article.subtitle}</p>
              )}
              <span className="single-news-date">{article.date}</span>

              <div className="single-news-content sans">
                {topParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>

              {bottomParagraphs.length > 0 && (
                <div className="single-news-content sans">
                  {bottomParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              )}

              {authorLine && (
                <p className="single-news-author sans">{authorLine}</p>
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
