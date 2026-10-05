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

Per collegare le informative Iubenda, impostare gli URL pubblici
`VITE_IUBENDA_PRIVACY_URL` e `VITE_IUBENDA_COOKIE_URL` e ricostruire il sito.
Questo mostra i link alle informative; l'integrazione del consenso e del blocco
preventivo di eventuali servizi esterni va effettuata separatamente con Iubenda.

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
