# Caruso Avvocati

Sito React/Vite pubblicato su Vercel, progetto `sito-web`.

## SEO e pubblicazione

La build genera HTML completo per ogni URL, sitemap XML e robots.txt.
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

Prima del primo deploy: completare il campo del titolare nella dashboard con
il nome o la ragione sociale confermati dallo studio. Le clausole e il banner
sono salvati; il passaggio «Website owner and contact info» è ancora da completare.

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
