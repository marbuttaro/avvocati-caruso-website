import { newsItems } from '../data/newsData.js';
import { professionals } from '../data/professionals.js';

export const SITE_URL = 'https://carusoavvocati.it';
export const SITE_NAME = 'Caruso Avvocati';
export const SOCIAL_IMAGE = `${SITE_URL}/social/caruso-avvocati.png`;
export const articleDate = (date) => date.split('/').reverse().join('-');
export const personSlug = (name) => name.toLowerCase().replaceAll(' ', '-');

export const pages = [
  { path: '/', label: 'Home', title: 'Caruso Avvocati | Studio legale a Pozzuoli', description: 'Studio legale a Pozzuoli, fondato nel 1988. Assistenza in diritto penale, civile, commerciale, navigazione e compliance 231 per privati e imprese.' },
  { path: '/lo-studio', label: 'Lo studio', title: 'Lo studio legale a Pozzuoli dal 1988 | Caruso Avvocati', description: 'Fondato da Giuseppe Caruso nel 1988, lo studio di Pozzuoli assiste persone e imprese in tutta Italia, con esperienza nel diritto penale e dell’economia.', type: 'AboutPage' },
  { path: '/team', label: 'I professionisti', title: 'Gli avvocati dello studio | Caruso Avvocati, Pozzuoli', description: 'Conosci gli avvocati di Caruso Avvocati: formazione, esperienze e ambiti di attività dei professionisti dello studio legale di Pozzuoli.', type: 'AboutPage' },
  { path: '/aree-competenza', label: 'Aree di competenza', title: 'Aree di competenza dello studio | Caruso Avvocati', description: 'Diritto penale, civile, commerciale, navigazione e compliance 231: gli ambiti di assistenza di Caruso Avvocati per persone e imprese, a Pozzuoli e in Italia.', type: 'CollectionPage' },
  { path: '/diritto-penale', label: 'Diritto penale', title: 'Avvocati penalisti a Pozzuoli | Caruso Avvocati', description: 'Consulenza e difesa penale per persone e imprese: reati tributari, finanziari, ambientali e contro la PA. Contatta lo studio Caruso Avvocati a Pozzuoli.', service: 'Consulenza e difesa in diritto penale' },
  { path: '/diritto-civile', label: 'Diritto civile', title: 'Diritto civile a Pozzuoli | Caruso Avvocati', description: 'Assistenza in diritto civile a Pozzuoli: contratti, responsabilità e contenzioso per privati e imprese. Conosci le attività dello studio Caruso Avvocati.', service: 'Consulenza e assistenza in diritto civile' },
  { path: '/diritto-commerciale', label: 'Diritto commerciale a Pozzuoli', title: 'Diritto commerciale e contratti | Caruso Avvocati', description: 'Caruso Avvocati assiste imprese italiane e straniere in contratti commerciali, accordi e contenzioso. Studio a Pozzuoli, con attività in tutta Italia.', service: 'Consulenza e assistenza in diritto commerciale' },
  { path: '/diritto-della-navigazione', label: 'Diritto della navigazione', title: 'Diritto marittimo e navigazione | Caruso Avvocati', description: 'Assistenza in diritto marittimo e della navigazione: sinistri, contratti di trasporto e assicurazioni. Contatta lo studio Caruso Avvocati a Pozzuoli.', service: 'Consulenza in diritto marittimo e della navigazione' },
  { path: '/compliance-231', label: 'Compliance 231', title: 'Compliance e modelli organizzativi 231 | Caruso Avvocati', description: 'Assistenza alle imprese per modelli organizzativi 231, valutazione dei rischi e organismi di vigilanza. Conosci le attività di Caruso Avvocati a Pozzuoli.', service: 'Compliance e modelli organizzativi D.Lgs. 231/2001' },
  { path: '/contatti', label: 'Contatti', title: 'Contatti e appuntamenti a Pozzuoli | Caruso Avvocati', description: 'Contatta Caruso Avvocati o richiedi un appuntamento. Via Vincenzo Cosenza 31, Pozzuoli. Telefono 081 3032399, email info@carusoavvocati.it.', type: 'ContactPage' },
  { path: '/news', label: 'News', title: 'Notizie e approfondimenti giuridici | Caruso Avvocati', description: 'Leggi gli approfondimenti degli avvocati dello studio Caruso su decisioni giudiziarie, diritto penale e societario, con i riferimenti ai casi trattati.', type: 'CollectionPage' },
  ...newsItems.map(article => ({
    path: article.slug, label: article.title,
    title: article.seoTitle || `${article.title} | ${SITE_NAME}`,
    description: article.description || article.subtitle,
    article,
  })),
];

export function getPage(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return pages.find(page => page.path === path) || {
    path, label: 'Pagina non trovata', title: 'Pagina non trovata | Caruso Avvocati',
    description: 'La pagina richiesta non è disponibile. Consulta le aree di competenza dello studio Caruso Avvocati o contattaci per assistenza.', noindex: true,
  };
}

export function breadcrumbs(page) {
  if (page.path === '/') return [];
  return [pages[0], ...(page.article ? [getPage('/news')] : page.service ? [getPage('/aree-competenza')] : []), page];
}

export function structuredData(page) {
  const url = `${SITE_URL}${page.path}`;
  const organization = {
    '@type': 'LegalService', '@id': `${SITE_URL}/#studio`, name: SITE_NAME,
    url: `${SITE_URL}/`, logo: `${SITE_URL}/social/logo-caruso.png`, image: SOCIAL_IMAGE,
    telephone: '+390813032399', email: 'info@carusoavvocati.it', foundingDate: '1988',
    address: { '@type': 'PostalAddress', streetAddress: 'Via Vincenzo Cosenza 31', addressLocality: 'Pozzuoli', addressRegion: 'NA', postalCode: '80078', addressCountry: 'IT' },
    geo: { '@type': 'GeoCoordinates', latitude: 40.8233438, longitude: 14.1204631 },
    areaServed: { '@type': 'Country', name: 'Italia' },
  };
  const graph = [organization, {
    '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME,
    alternateName: 'Studio Legale Caruso Avvocati', url: `${SITE_URL}/`, inLanguage: 'it-IT', publisher: { '@id': organization['@id'] },
  }, {
    '@type': page.type || 'WebPage', '@id': `${url}#webpage`, url, name: page.title,
    description: page.description, inLanguage: 'it-IT', isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': organization['@id'] }, ...(page.path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  }];
  const trail = breadcrumbs(page);
  if (trail.length) graph.push({
    '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: `${SITE_URL}${item.path}` })),
  });
  if (page.service) graph.push({ '@type': 'Service', '@id': `${url}#service`, name: page.service, serviceType: page.label, url, description: page.description, provider: { '@id': organization['@id'] } });
  if (page.path === '/team') graph.push(...professionals.map(person => ({
    '@type': 'Person', '@id': `${SITE_URL}/team#${personSlug(person.name)}`,
    name: person.name, honorificPrefix: 'Avv.', jobTitle: 'Avvocato', url: `${SITE_URL}/team#${personSlug(person.name)}`,
    image: `${SITE_URL}${person.image}`, description: person.role,
    ...(person.email ? { email: person.email } : {}),
  })));
  if (page.article) {
    const authorName = page.article.author;
    graph.push({
      '@type': 'BlogPosting', '@id': `${url}#article`, url, headline: page.article.pageTitle || page.article.title,
      description: page.description, datePublished: articleDate(page.article.date), inLanguage: 'it-IT', articleSection: page.article.category,
      author: { '@type': 'Person', name: authorName, url: `${SITE_URL}/team#${personSlug(authorName)}` },
      publisher: { '@id': organization['@id'] }, mainEntityOfPage: { '@id': `${url}#webpage` }, image: SOCIAL_IMAGE,
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function renderSeoHead(page) {
  const canonical = `${SITE_URL}${page.path}`;
  const meta = (name, value, property = false) => `<meta data-seo ${property ? 'property' : 'name'}="${name}" content="${escapeHtml(value)}">`;
  return [
    `<title data-seo>${escapeHtml(page.title)}</title>`, meta('description', page.description),
    meta('robots', page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'),
    meta('application-name', SITE_NAME), meta('apple-mobile-web-app-title', SITE_NAME),
    ...(!page.noindex ? [`<link data-seo rel="canonical" href="${escapeHtml(canonical)}">`] : []),
    ...Object.entries({ 'og:site_name': SITE_NAME, 'og:locale': 'it_IT', 'og:type': page.article ? 'article' : 'website', 'og:title': page.title, 'og:description': page.description, 'og:url': canonical, 'og:image': SOCIAL_IMAGE, 'og:image:width': '1200', 'og:image:height': '630', 'og:image:type': 'image/png', 'og:image:alt': 'Caruso Avvocati — Studio legale a Pozzuoli' }).map(([name, value]) => meta(name, value, true)),
    ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': page.title, 'twitter:description': page.description, 'twitter:image': SOCIAL_IMAGE, 'twitter:image:alt': 'Caruso Avvocati — Studio legale a Pozzuoli' }).map(([name, value]) => meta(name, value)),
    ...(page.article ? [meta('article:published_time', articleDate(page.article.date), true), meta('article:section', page.article.category, true)] : []),
    ...(!page.noindex ? [`<script data-seo type="application/ld+json">${JSON.stringify(structuredData(page)).replace(/</g, '\\u003c')}</script>`] : []),
  ].join('\n');
}
