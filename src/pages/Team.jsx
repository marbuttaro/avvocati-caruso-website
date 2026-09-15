import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Team.css';

const professionals = [
  {
    id: 1,
    prefix: 'Avv.',
    name: 'Giuseppe Caruso',
    role: 'Fondatore',
    bio: [
      "L'Avv. Giuseppe Caruso, abilitato al patrocinio innanzi alle Magistrature Superiori, è il fondatore dello Studio, del quale guida l'attività dal 1988. Laureato nel 1984, con lode, presso l'Università degli Studi di Napoli Federico II, con una tesi in Diritto Processuale Penale relatore il Chiarissimo Prof. Nicola Carulli, ha costruito nel corso di quattro decenni una solida e riconosciuta esperienza nella difesa di persone fisiche e persone giuridiche.",
      "È stato componente del direttivo della Camera Penale di Napoli dal 2010 al 2014, e ha ricoperto nell'anno 2010, il ruolo di Presidente di sottocommissione per l'esame di abilitazione all'esercizio della professione forense nel Distretto della Corte di Appello di Napoli. Relatore a numerosi convegni di settore, ha contribuito nel tempo alla diffusione e all'approfondimento di tematiche di diritto penale sostanziale e processuale presso platee di colleghi e professionisti.",
      "Nel corso della propria carriera ha assunto incarichi difensivi di particolare rilievo, tra i quali la difesa di esponenti politici nell'ambito dei procedimenti di Tangentopoli, di appartenenti alle forze dell'ordine coinvolti in vicende di criminalità organizzata, e di funzionari pubblici di vertice in procedimenti per reati contro la pubblica amministrazione e contro la fede pubblica nonché di imprenditori per reati tributari.",
      'Presso il suo studio si sono formati numerosi professionisti che oggi operano con successo nell’ambito del diritto penale.',
    ],
    image: '/assets/prof-giuseppe-caruso.jpg',
  },
  {
    id: 2,
    prefix: 'Avv.',
    name: 'Alfredo Caruso',
    role: 'Diritto Penale – Compliance 231 – MOG 231',
    bio: [
      'Laureato nel 2017 presso l\'Università degli Studi di Napoli Federico II, con una tesi dal titolo "Delitti in tema di criminalità mafiosa tra legge e giudice: rapporto tra norme e interpretazione giurisprudenziale riguardo alle principali figure criminose", relatore il Chiarissimo Prof. Avv. Vincenzo Maiello, ha arricchito il proprio percorso di studi con un\'esperienza all\'estero presso la UNWE di Sofia, nell’ambito del progetto Erasmus+, ed una Summer School "Introduction to U.S. law" presso la George Washington University (Washington D.C.)',
      'Sin dal conseguimento della laurea si è dedicato all\'approfondimento della disciplina della responsabilità amministrativa degli enti ai sensi del D.Lgs. 231/2001 e, più in generale, del diritto penale dell\'economia, conseguendo nel 2018 un Master di II livello in Diritto Penale dell\'Economia presso l\'Università Cattolica del Sacro Cuore di Milano con una tesi in Diritto Penale Finanziario dal titolo "Risvolti penalistici del trading ad alta frequenza (HFT) nella configurazione del reato di insider trading". Ha svolto la pratica forense presso un primario studio legale milanese specializzato in diritto penale ambientale, maturando così una solida formazione tecnica in un settore di crescente rilevanza applicativa.',
      'Dal 2020 collabora con lo Studio Caruso. Abilitato all’esercizio della professione forense dal 2022, fornisce consulenza e assistenza legale in giudizio a persone fisiche e giuridiche in materia di reati tributari, finanziari, contro la pubblica amministrazione e ambientali. Dal 2024 è membro supplente del Collegio di Garanzia di + Europa nonché componente dell\'Osservatorio Doppio Binario e Giusto Processo dell\'Unione delle Camere Penali Italiane, coordinato dagli Avv. Cesare Placanica e Maria Teresa Zampogna; nell\'ambito di tale attività ha approfondito in particolare la tematica dei sequestri di dispositivi informatici, materia sulla quale ha tenuto relazioni in occasione di convegni e incontri di approfondimento.',
    ],
    image: '/assets/prof-alfredo-caruso.jpg',
  },
  {
    id: 3,
    prefix: 'Avv.',
    name: 'Erika Ferone',
    role: 'Diritto Penale – Diritto di Impresa – Compliance',
    bio: [
      'Laureata nel 2018 presso l\'Università degli Studi di Napoli Federico II, con una tesi in Diritto Processuale Penale dal titolo “Il Caso Garlasco e la regola dell’oltre ogni ragionevole dubbio” relatore Chiarissimo Prof.ssa Clelia Iasevoli.',
      'Nell’anno 2020 ha conseguito il Master di II livello in Diritto di Impresa presso l’Università Luiss Guido Carli - con una tesi in Diritto Penale dell’Economia dal titolo “Il D.lgs 231/2001 e la Direttiva Europea 1371 del 2017” - nel corso del quale ha approfondito i principali settori giuridici di riferimento per le attività aziendali quali il diritto societario e fallimentare, la contrattualistica di impresa, gli appalti pubblici, il diritto finanziario, il diritto tributario ed il diritto industriale e della concorrenza.',
      'Dal 2018 ha svolto la pratica forense presso lo studio degli Avv. Ettore Stravino-Avv. Carlo De Pascale in Napoli, e dal 2023 al 2025 ha svolto anche attività di supporto legale presso un\'azienda operante nel settore aerospaziale, occupandosi di contrattualistica e gestione amministrativa, maturando così un\'esperienza professionale articolata tra la dimensione forense e quella dell\'in-house legal. Ha conseguito l’abilitazione all\'esercizio della professione forense nel mese di novembre 2021.',
      'Dal 2025 collabora con lo Studio Caruso, con un focus particolare su reati contro la persona e reati tributari e sul diritto di impresa.',
    ],
    image: '/assets/prof-erika-ferone.jpg',
  },
  {
    id: 4,
    prefix: 'Avv.',
    name: 'Adriano Caruso',
    role: 'Of Counsel – Diritto Civile – Diritto del Lavoro – Diritto di Famiglia – Responsabilità professionale',
    bio: [
      'Laureato nel 2002 presso l’Università degli Studi di Napoli Federico II, l\'Avv. Adriano Caruso, è specializzato in diritto civile e diritto processuale civile.',
      'In qualità di Of-counsel, integra l’offerta professionale fornendo alla clientela dello Studio consulenza stragiudiziale ed assistenza giudiziale nei settori del recupero crediti, risarcimento del danno, responsabilità professionale, responsabilità medica, responsabilità extracontrattuale, diritto del lavoro, contrattualistica, diritti reali, diritto di famiglia, procedure concorsuali e codice del consumo.',
      'Negli anni ha maturato una solida esperienza nella difesa di Società di capitali in procedimenti civili.',
    ],
    image: '/assets/prof-adriano-caruso.jpg',
  },
  {
    id: 5,
    prefix: 'Avv.',
    name: 'Francesco Conte',
    role: 'Of Counsel – Diritto Commerciale – Diritto Amministrativo – Diritto Assicurativo – Diritto dei Trasporti – Diritto Marittimo',
    bio: [
      'Laureato nel 2017 presso l\'Università degli Studi di Napoli Federico II, con una tesi in Diritto Amministrativo dal titolo "Il giusto procedimento amministrativo", relatore Prof. Fiorenzo Liguori, ha arricchito il proprio percorso di studi con un\'esperienza all\'estero presso l’Università di Varsavia nell’ambito del progetto Erasmus+.',
      'Nel 2018 ha conseguito un Master di II livello in European Affairs and Policies presso lo European College di Parma, con una tesi dal titolo “Gli appalti pubblici europei e l\'aggregazione della domanda pubblica", relatore il Prof. Paolo De Caterini (LUISS). Nel 2024 ha conseguito il Master in Diritto del Commercio Internazionale presso il Sole 24 Ore Business School.',
      'Abilitato all\'esercizio della professione forense nel 2023, l\'Avv. Conte collabora con primari studi legali internazionali e si occupa prevalentemente di diritto civile, amministrativo, commerciale, dei trasporti e marittimo. Nell\'ambito dell\'attività giudiziale e stragiudiziale, assiste imprese e operatori economici nella redazione e negoziazione di contrattualistica, sia in ambito nazionale che internazionale, curando in particolare la strutturazione di condizioni generali di vendita internazionali e contratti di trasporto.',
      'Gestisce il contenzioso contrattuale ed extracontrattuale e fornisce consulenza specialistica in materia di diritto assicurativo, con un focus specifico sul ramo marittimo, occupandosi di fattispecie quali collisioni, salvataggi e sinistri marittimi in generale.',
      'In qualità di Of Counsel dello Studio Caruso, integra l\'offerta assistenziale dello stesso portando una competenza trasversale fondamentale per le imprese clienti.',
    ],
    image: '/assets/prof-francesco-conte.jpg',
  },
];

function AccordionItem({ prof, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="accordion-item"
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.12 }}
    >
      <div className="accordion-separator" />

      <div className="accordion-main">

        {/* Colonna sinistra — tutta cliccabile */}
        <div className="accordion-left" onClick={() => setOpen(!open)}>
          <span className="accordion-prefix serif">{prof.prefix}</span>
          <h2 className="accordion-name serif">{prof.name}</h2>

          {/* Icona sotto il nome */}
          <button
            className="accordion-toggle"
            aria-label={open ? 'Chiudi' : 'Apri'}
          >
            <img src={open ? '/assets/close-team.svg' : '/assets/plus-team.svg'} alt="" />
            {!open && <span className="accordion-toggle-label">Approfondisci</span>}
          </button>

          {/* Bio animata */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="bio"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="accordion-bio sans">
                  {prof.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Specializzazione — sempre visibile, subito sopra la linea */}
          <span className="accordion-role">{prof.role.toUpperCase()}</span>
        </div>

        {/* Colonna destra: foto sempre visibile */}
        <div className="accordion-photo-wrap">
          <img src={prof.image} alt={prof.name} className="accordion-photo" />
        </div>

      </div>
    </motion.div>
  );
}

const Team = () => {
  return (
    <div className="team-page bg-cream">
      <section className="team-section">
        <div className="container">

          <motion.div
            className="team-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="team-title serif">I professionisti</h1>
            <p className="team-description sans">
              Un team di professionisti con una solida esperienza nei diversi ambiti del
              diritto, uniti da un approccio condiviso fondato sulla competenza,
              sull'aggiornamento costante e sulla collaborazione interdisciplinare.
            </p>
          </motion.div>

          <motion.div
            className="team-accordion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {professionals.map((prof, index) => (
              <AccordionItem key={prof.id} prof={prof} index={index} />
            ))}
            <div className="accordion-separator" />
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Team;
