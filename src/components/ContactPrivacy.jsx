import { privacyUrl } from '../privacy/consent';

export default function ContactPrivacy() {
  return <div className="contact-privacy">
    <p>Usiamo i tuoi dati per rispondere alla richiesta e gestire l’eventuale appuntamento.{' '}
      <a href={privacyUrl} target="_blank" rel="noopener noreferrer">Informativa privacy</a>
    </p>
    <details>
      <summary>Come vengono inviate le richieste</summary>
      <p>Nome, cognome, email, messaggio e, per gli appuntamenti, data e ora proposte
        vengono trasmessi allo studio tramite Resend (Plus Five Five, Inc., Stati Uniti).
        Lo stesso servizio invia l’email di conferma. La casella email dello studio
        è ospitata da Ergonet S.r.l. (Italia).</p>
      <p>Resend tratta i dati anche negli Stati Uniti. Per i dettagli sui servizi:{' '}
        <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">privacy di Resend</a>,{' '}
        <a href="https://resend.com/legal/dpa" target="_blank" rel="noopener noreferrer">accordo sul trattamento dei dati di Resend</a> e{' '}
        <a href="https://www.ergonet.it/wp-content/uploads/2024/06/informativa-privacy.pdf" target="_blank" rel="noopener noreferrer">privacy di Ergonet (PDF)</a>.
      </p>
    </details>
  </div>;
}
