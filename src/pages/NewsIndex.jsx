import { Link } from 'react-router-dom';
import { newsItems } from '../data/newsData.js';
import { articleDate } from '../seo/site.js';

export default function NewsIndex() {
  return <section className="seo-content-page container">
    <h1 className="serif">Notizie e approfondimenti giuridici</h1>
    <p>Decisioni giudiziarie e casi trattati dai professionisti di Caruso Avvocati.</p>
    {newsItems.map(article => <article key={article.id} className="news-index-entry">
      <time dateTime={articleDate(article.date)}>{article.date}</time> · {article.category}
      <h2 className="serif"><Link to={article.slug}>{article.pageTitle || article.title}</Link></h2>
      <p>{article.subtitle}</p>
      <Link to={article.slug}>Leggi l’approfondimento</Link>
    </article>)}
  </section>;
}
