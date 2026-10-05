import { Link } from 'react-router-dom';

export default function NotFound() {
  return <section className="seo-content-page container">
    <p>Errore 404</p><h1 className="serif">Pagina non trovata</h1>
    <p>La pagina richiesta non è disponibile. Puoi consultare le aree di competenza o contattare lo studio.</p>
    <p><Link to="/aree-competenza">Aree di competenza</Link> · <Link to="/contatti">Contatti</Link> · <Link to="/">Torna alla pagina iniziale</Link></p>
  </section>;
}
