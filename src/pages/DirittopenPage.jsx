import React from 'react';
import './DirittopenPage.css';

const activities = [
  'Consulenza e pareri in materia penale',
  'Assistenza durante indagini e accertamenti',
  'Difesa nei procedimenti penali',
  'Impugnazioni e procedimenti cautelari',
  'Assistenza a persone indagate/imputate',
];

const areas = [
  {
    title: 'Reati contro la Pubblica Amministrazione',
    desc: 'Assistenza e difesa in procedimenti relativi a reati che coinvolgono rapporti con enti pubblici e pubblici ufficiali, con particolare attenzione alla tutela di imprese, amministratori e professionisti.',
  },
  {
    title: 'Reati Urbanistici ed Edilizi',
    desc: 'Consulenza e difesa in materia di violazioni urbanistiche, edilizie e paesaggistiche, con supporto nelle fasi investigative e nei procedimenti connessi a interventi edilizi e attività immobiliari.',
  },
  {
    title: 'Reati Finanziari',
    desc: 'Assistenza in procedimenti riguardanti illeciti di natura economica e finanziaria, con un approccio multidisciplinare che integra competenze giuridiche e analisi della documentazione contabile.',
  },
  {
    title: 'Reati Societari',
    desc: 'Tutela di amministratori, dirigenti, soci e società coinvolti in procedimenti relativi alla gestione aziendale e agli obblighi previsti dalla normativa societaria.',
  },
  {
    title: 'Reati contro\nla Persona',
    desc: 'Difesa e assistenza in procedimenti riguardanti fatti lesivi dell\'integrità fisica, morale e personale, sia dalla parte della difesa sia a tutela delle persone offese.',
  },
  {
    title: 'Altri Reati',
    desc: 'Lo Studio presta assistenza anche in ulteriori ambiti del diritto penale, offrendo una valutazione preliminare del caso e individuando il percorso difensivo più adeguato alle circostanze specifiche.',
  },
];

const DirittopenPage = () => {
  return (
    <div className="dp-page">

      {/* ── Hero: titolo a piena larghezza ─────────────────── */}
      <section className="dp-title-section bg-cream">
        <div className="container">
          <h1 className="dp-title serif">
            Difesa, consulenza<br />e tutela nei<br />procedimenti penali
          </h1>
        </div>
      </section>

      {/* ── Hero body: foto + testo ─────────────────────────── */}
      <section className="dp-body-section bg-cream">
        <div className="container">
          <div className="dp-hero-grid">

            <div className="dp-hero-left">
              <img
                src="/assets/services/close-up-businessman-signing-lease-agreement-carcreated-with-generative-ai-technology.jpg"
                alt="Diritto Penale"
                className="dp-hero-img"
              />
            </div>

            <div className="dp-hero-right">
              <p className="dp-intro sans">
                Difendiamo i nostri clienti con una solida conoscenza tecnica e
                una consolidata esperienza nelle aule di giustizia. Il nostro
                approccio combina preparazione accademica e pragmatismo
                operativo per garantire una tutela efficace in ogni fase del
                procedimento penale.
              </p>
              <div className="dp-activities">
                <h3 className="dp-activities-title serif">Attività principali</h3>
                <ul className="dp-activities-list sans">
                  {activities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Aree di intervento ───────────────────────────────── */}
      <section className="dp-areas-section section-padding bg-cream">
        <div className="container">
          <h2 className="dp-areas-title serif">Aree di intervento</h2>
          <div className="dp-areas-grid">
            {areas.map((area, i) => (
              <div key={i} className="dp-area-card">
                <div className="dp-area-header">
                  <div className="dp-area-divider" />
                  <img
                    src="/assets/logotipo-orange.svg"
                    alt=""
                    className="dp-area-icon"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="dp-area-card-title serif">{area.title}</h3>
                <p className="dp-area-desc sans">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contatti ─────────────────────────────────────────── */}
      <section className="contact-v3 bg-navy dp-contact">
        <img src="/assets/pattern-contatti.svg" className="contact-section-pattern" aria-hidden="true" />
        <div className="container contact-container-figma">
          <div className="contact-info-figma">
            <h2 className="serif">Hai bisogno di<br />una consulenza<br />legale?</h2>
            <p className="sans">Siamo a disposizione per rispondere alle vostre esigenze legali. Compilate il modulo per richiedere un primo colloquio.</p>
          </div>
          <div className="contact-divider-figma"></div>
          <div className="contact-form-figma">
            <form className="figma-form-new">
              <div className="form-row-2">
                <div className="input-group">
                  <label className="serif">Nome</label>
                  <input type="text" placeholder="Mario" />
                </div>
                <div className="input-group">
                  <label className="serif">Cognome</label>
                  <input type="text" placeholder="Rossi" />
                </div>
              </div>
              <div className="form-row-1">
                <div className="input-group">
                  <label className="serif">Indirizzo Mail</label>
                  <input type="email" placeholder="mariorossi@gmail.com" />
                </div>
              </div>
              <div className="form-row-1">
                <div className="input-group">
                  <label className="serif">Messaggio</label>
                  <textarea placeholder="Scrivi qui il tuo messaggio..." rows="4" />
                </div>
              </div>
              <div className="form-submit-row">
                <button type="submit" className="btn-navy-light mt-3">Contatta lo studio</button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DirittopenPage;
