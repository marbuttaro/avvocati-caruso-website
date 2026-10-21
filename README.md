# Caruso Avvocati

Sito React/Vite pubblicato su Vercel, progetto `sito-web`.

## SEO e pubblicazione

La build genera HTML per le pagine istituzionali e robots.txt. Homepage, news e
sitemap sono servite dal server con il JSON aggiornato, anche prima di JavaScript.
Le pagine restano interattive con l'idratazione React. Eseguire `npm run build`
prima di `npm test`: i test SEO controllano anche i file pubblicabili in `dist`.

- Sitemap da inviare a Google e Bing: https://carusoavvocati.it/sitemap.xml
- `npm run check:seo`: verifica HTTP, metadati e routing del sito in produzione.
- `npm run optimize:assets`: rigenera le immagini WebP, le icone e l'anteprima social.
- [Rapporto SEO e manutenzione](docs/SEO.md): modifiche, verifiche e attività esterne.

## Privacy e cookie

Il banner iubenda si configura dalla dashboard del sito `carusoavvocati.it`
(site ID `4704993`, policy ID `13388967`). `index.html` carica lo script unificato
all'inizio della pagina; colori, testi e impostazioni del banner sono gestiti
remotamente. `public/privacy-init.js` collega i cambiamenti di consenso a React.

Titolare del trattamento: Alfredo Caruso, Via Vincenzo Cosenza 31,
80078 Pozzuoli (NA), Italia; email `info@carusoavvocati.it`.
I dati sono configurati nell'informativa pubblica iubenda.

I link pubblici sono in `src/privacy/consent.js`, nel footer e accanto ai moduli.
La mappa Google viene creata solo con consenso alla categoria Esperienza (3) e
rimossa quando il consenso viene revocato. Senza iubenda disponibile resta il
collegamento esterno a Google Maps. Le preferenze si riaprono dal footer.

Il piano Essentials non permette clausole personalizzate. Le informazioni su
Resend ed Ergonet integrano l'informativa nei moduli (`ContactPrivacy.jsx`).
L'informativa iubenda include contatti, Google Maps, Vercel e iubenda.

Le credenziali `IUBENDA_USER` e `IUBENDA_PASS` sono riservate all'accesso alla
dashboard: restano nel `.env` ignorato da Git, senza prefisso `VITE_` e senza
caricamento su Vercel. Gli identificativi nel codice sono pubblici.

Verifica dopo una modifica: `npm run build && npm test`, poi prova in un browser
senza consensi precedenti rifiuto, accettazione, revoca, ricaricamento e navigazione
interna. Prima del consenso non devono partire richieste verso Google Maps.

## Richieste via email

I moduli contatti e appuntamenti inviano richieste a `POST /api/contact`.
Il server usa Resend per inviare alla casella configurata in `CONTACT_TO_EMAIL`;
il campo `Reply-To` contiene l'indirizzo del visitatore. Gli appuntamenti sono
richieste da confermare, senza prenotazione automatica di un calendario.

Per lavorare in locale, copia `.env.example` in `.env` **solo se `.env` non esiste**,
inserisci la chiave Resend e avvia `npm run dev`. Vite esegue anche l'endpoint locale.
Riavvia il server dopo ogni modifica al `.env`.

- `RESEND_API_KEY`: chiave con permesso di invio sul dominio verificato.
- `RESEND_FROM_EMAIL`: `Caruso Avvocati <sito@carusoavvocati.it>`.
- `CONTACT_TO_EMAIL`: `info@carusoavvocati.it`.

In Vercel configura le stesse variabili negli ambienti Production e Preview.
La chiave deve restare lato server: non usare il prefisso `VITE_`.
`.env` e `.env.*` sono esclusi da Git; `.env.example` contiene solo esempi senza segreti.

La posta in entrata resta nella casella Ergonet esistente. Non abilitare Resend
Receiving e non sostituire gli MX del dominio principale per questa integrazione.
Lo stato positivo del modulo indica l'accettazione da parte di Resend; la consegna
finale può essere controllata nei log Resend. Ogni richiesta invia due email in
un'unica chiamata batch: la notifica allo studio e una conferma di ricezione al
visitatore. Le risposte alla conferma arrivano a `CONTACT_TO_EMAIL`. Per gli
appuntamenti, la conferma include data e ora proposte e chiarisce che occorre
attendere il ricontatto dello studio. Il testo del messaggio del visitatore non
viene riportato nella conferma. I tentativi ripetuti usano la stessa chiave di
idempotenza per entrambe le email.

Verifiche: `npm test`, `npm run build`. Per provare l'invio senza scrivere allo
studio, avvia temporaneamente il server con `CONTACT_TO_EMAIL=delivered@resend.dev`
e usa `delivered@resend.dev` anche come email del visitatore.
Le richieste hanno validazione server, limite di dimensione, controllo dell'origine,
honeypot e idempotenza sui tentativi ripetuti. Questi controlli non sostituiscono
un rate limit condiviso o le regole anti-abuso del firewall Vercel.

## Dashboard news

Accesso: https://carusoavvocati.it/admin. L’account amministratore usa
`ADMIN_USERNAME`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET`, presenti nel `.env`
locale ignorato da Git e configurati come segreti nell’ambiente Production di Vercel.
Le credenziali non devono avere il prefisso `VITE_`. Password di almeno 16 caratteri
e segreto di sessione casuale di almeno 32 caratteri; la rotazione di uno dei due
invalida le sessioni precedenti dopo il deploy. Le sessioni durano 8 ore e usano
cookie HttpOnly, Secure in produzione e SameSite Strict. L’accesso ammette fino a
8 tentativi per IP in finestre di 15 minuti, con contatori persistenti su Blob.

La dashboard permette ricerca, creazione, anteprima, modifica ed eliminazione
degli articoli. Oltre a titolo (240 caratteri) e testo (100.000 caratteri), sono
disponibili sottotitolo (1.000 caratteri), ente emittente (300 caratteri) e categoria
(100 caratteri), tutti facoltativi e su una sola riga. La categoria si seleziona
tra quelle esistenti oppure si crea durante il salvataggio dell’articolo. Spazi
ripetuti e differenze di maiuscole non creano duplicati; le categorie restano
disponibili anche quando non sono più associate ad articoli. L’ente emittente usa
il campo storico `court`, mantenendo i dati degli articoli d’esempio.
La data italiana viene assegnata alla pubblicazione. Il testo è semplice, senza
HTML, immagini o allegati, con paragrafi e a capo mantenuti. L’eliminazione richiede
conferma e rimuove l’articolo anche dalla sitemap. Le modifiche non richiedono deploy.

Non c’è un database: lo store privato Vercel Blob `caruso-news` conserva un solo
oggetto JSON in `news/articles.json`, con `version`, `nextId`, `articles` e
`categories` (elenco aggiunto automaticamente al primo salvataggio). Gli
articoli esistenti sono migrati da `src/data/news.json` solo all’inizializzazione;
i deploy successivi non sovrascrivono il file. Le scritture condizionate all’ETag
impediscono che due salvataggi simultanei si sovrascrivano. Se compare un conflitto,
“Ricarica l’elenco” aggiorna la revisione mantenendo il testo aperto. Gli ID non
vengono riutilizzati; il 3 resta riservato al vecchio redirect verso `/news/1`.

`GET /api/news` espone gli articoli pubblici; `/api/admin` richiede una sessione
per lettura e scrittura editoriali. Homepage, elenco news, singoli articoli e
sitemap vengono generati con i dati correnti da `/api/page`; gli articoli eliminati
restituiscono HTTP 404. I guasti dello storage restituiscono 503 senza ripristinare
contenuti vecchi. `/admin` è escluso dall’indicizzazione e dalla sitemap.

In locale `npm run dev` usa `.data/news.json`, ignorato da Git, inizializzato con
gli articoli originali. Non scrive nello store di produzione. Il percorso può essere
sostituito con `NEWS_FILE`. Gli ambienti Preview non hanno credenziali editoriali
né accesso allo store di produzione: per abilitarli serve uno store separato e le
variabili dedicate; il percorso previsto è `preview/articles.json`.

Per verificare: `npm run build && npm test`. I test coprono CRUD, persistenza,
concorrenza, sessioni, validazione, CSRF, HTML pubblico e sitemap aggiornati.
