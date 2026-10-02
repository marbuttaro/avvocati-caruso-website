# Caruso Avvocati

Sito React/Vite pubblicato su Vercel, progetto `sito-web`.

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
finale può essere controllata nei log Resend. Nessuna email automatica viene
inviata al visitatore.

Verifiche: `npm test`, `npm run build`. Per provare l'invio senza scrivere allo
studio, avvia temporaneamente il server con `CONTACT_TO_EMAIL=delivered@resend.dev`.
Le richieste hanno validazione server, limite di dimensione, controllo dell'origine,
honeypot e idempotenza sui tentativi ripetuti. Questi controlli non sostituiscono
un rate limit condiviso o le regole anti-abuso del firewall Vercel.
