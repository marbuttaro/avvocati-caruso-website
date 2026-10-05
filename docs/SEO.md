# SEO di Caruso Avvocati

Intervento del 5 ottobre 2026. Dominio canonico: **https://carusoavvocati.it**.
Nome del sito: **Caruso Avvocati**. Sede: Via Vincenzo Cosenza 31, 80078 Pozzuoli (NA).

## Sitemap da inviare

**https://carusoavvocati.it/sitemap.xml**

La stessa sitemap va inviata in Google Search Console e in Bing Webmaster Tools.
È generata durante ogni build, contiene 13 URL canonici e viene dichiarata in
`https://carusoavvocati.it/robots.txt`. Non include API, errori, informative ancora
assenti o l'articolo duplicato. Non vengono inventate date `lastmod`: il momento
di una build non prova la data di aggiornamento del contenuto.

In Search Console: selezionare la proprietà del dominio, aprire **Sitemap** e
inviare `sitemap.xml`. In Bing: selezionare il sito, aprire **Sitemaps** e inviare
l'URL completo. Dopo l'invio, controllare lo stato di lettura e ispezionare almeno
home, una pagina di servizio e un articolo. Queste operazioni richiedono gli
account del proprietario e non sono state eseguite dall'integrazione del sito.
Riferimenti: [Google, creazione e invio delle sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[Bing, uso delle sitemap](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/).

## Problemi risolti

| Priorità | Situazione iniziale | Intervento |
|---|---|---|
| P1 | Titolo unico `sito-web`, lingua HTML inglese | Nome del brand, lingua italiana, titoli e descrizioni distinti per URL |
| P1 | Documento iniziale privo dei contenuti React | HTML completo generato per ogni pagina durante la build, con idratazione nel browser |
| P1 | Nessuna sitemap o robots.txt dedicata | Generazione automatica e verifica della corrispondenza con le pagine pubblicate |
| P1 | Rewrite di tutti gli URL sulla home | File HTML distinti, URL senza estensione e vera risposta HTTP 404 per risorse inesistenti |
| P1 | Nessun canonical o dato strutturato | Canonical HTTPS senza www; JSON-LD WebSite, LegalService, WebPage e breadcrumb |
| P2 | `/news/3` replica integralmente `/news/1` | Rimozione del duplicato dalle liste e redirect permanente verso `/news/1` |
| P2 | Nessun archivio news autonomo | Pagina `/news` con collegamenti agli articoli |
| P2 | Biografie disponibili solo dopo un clic e rendering JS | Biografie presenti nel documento, con controlli accessibili; visibili anche senza JS |
| P2 | Home e pagina contatti senza H1 | Un solo H1 per ogni pagina, coerente con contenuto e località |
| P2 | Link privacy/cookie verso pagine inesistenti | Link predisposti per gli URL Iubenda, visibili solo quando configurati |
| P2 | Immagini originali pesanti e font TTF | WebP responsive con dimensioni esplicite; font WOFF2 locali e font-display swap |
| P2 | Preloader che copriva il contenuto iniziale | Rimozione dell'attesa e contenuto iniziale immediatamente leggibile |
| P2 | Pulsante menu mobile senza nome e alcuni contrasti insufficienti | Etichetta accessibile, stato espanso e contrasti corretti |

## URL e contenuti

| URL | Contenuto e obiettivo |
|---|---|
| `/` | Brand, studio legale a Pozzuoli, attività dal 1988 |
| `/lo-studio` | Storia dello studio e attività sul territorio nazionale |
| `/team` | Nomi, biografie, formazione e contatti dei professionisti |
| `/aree-competenza` | Collegamenti alle cinque aree di attività, inclusa compliance 231 |
| `/diritto-penale` | Consulenza e difesa penale |
| `/diritto-civile` | Contratti, responsabilità e contenzioso civile |
| `/diritto-commerciale` | Assistenza commerciale e contrattuale alle imprese |
| `/diritto-della-navigazione` | Diritto marittimo, trasporti e assicurazioni |
| `/compliance-231` | Modelli organizzativi e assistenza alle imprese |
| `/contatti` | Recapiti e richieste di appuntamento |
| `/news` | Archivio degli approfondimenti |
| `/news/1` | Simulazione e interposizione fittizia, autore Adriano Caruso |
| `/news/2` | Vendita di tabacchi, autore Alfredo Caruso |

Titoli e descrizioni sono definiti in `src/seo/site.js`; i metadati degli articoli
sono nel loro record in `src/data/newsData.js`. Le pagine di servizio mantengono
i testi giuridici esistenti. Non sono stati aggiunti risultati professionali,
recensioni, prezzi, premi o affermazioni giuridiche non documentate.

## Metadati e dati strutturati

- `WebSite` indica nome, denominazione alternativa e URL del sito.
- `LegalService` identifica lo studio con sede, telefono, email, coordinate della
  mappa già presente e anno di fondazione riportato nei contenuti.
- `WebPage`, `AboutPage`, `ContactPage` e `CollectionPage` distinguono il ruolo
  delle pagine; `Service` descrive le cinque attività effettivamente presentate.
- `BreadcrumbList` corrisponde al percorso di navigazione visibile.
- `Person` riporta i professionisti già descritti nella pagina team. Gli autori
  degli articoli hanno collegamenti alle rispettive biografie.
- `BlogPosting` usa autore, titolo e data di pubblicazione già disponibili;
  non attribuisce una data di modifica inventata.
- Open Graph e Twitter Card usano descrizioni specifiche e l'immagine di brand
  a 1200 × 630 pixel. Favicon PNG, SVG, icona Apple e manifest riportano il brand.

Il dato strutturato non implica la comparsa di un risultato avanzato. Il nome nei
risultati resta scelto dal motore e può aggiornarsi dopo una nuova scansione:
[Google, nomi dei siti](https://developers.google.com/search/docs/appearance/site-names).
I dati locali seguono i contenuti pubblici dello studio:
[Google, LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business).

## Rendering, URL ed errori

`npm run build` compila il client, produce un bundle server temporaneo e genera
HTML statico mediante React e StaticRouter. Il bundle temporaneo viene eliminato;
Vercel distribuisce i documenti da CDN. Lo stesso contenuto viene servito a
visitatori e crawler: non c'è rilevamento del bot o una versione alternativa per
i motori. Le funzionalità React restano disponibili dopo l'idratazione.

La navigazione interna aggiorna anche canonical, title, descrizione e JSON-LD.
I parametri di campagna non entrano nei canonical. Gli URL esistenti degli articoli
vengono mantenuti, salvo il duplicato. Gli URL sconosciuti mostrano una pagina
404 con `noindex`, senza canonical verso la home. Le API mantengono il proprio
routing e hanno un header `X-Robots-Tag` dedicato.

I domini tecnici `*.vercel.app` hanno un header `noindex`. Le build Preview hanno
anche robots.txt restrittivo e metadati iniziali `noindex`. Il dominio www mantiene
il reindirizzamento al dominio principale già configurato su Vercel.
Riferimenti: [Vite, prerendering](https://vite.dev/guide/ssr#pre-rendering-ssg),
[Vercel, pagina 404 statica](https://vercel.com/kb/guide/custom-404-page).

## Prestazioni e accessibilità

Le 14 immagini raster utilizzate e ottimizzate passano complessivamente da
9.922.230 byte a 639.062 byte considerando la variante WebP più grande: circa
**94% in meno**. Questo confronto riguarda i file, non il peso di una singola
visita. `srcset` e `sizes` permettono al browser di scegliere varianti inferiori;
le immagini sotto la prima schermata sono caricate progressivamente. Gli originali
sono conservati per consentire rigenerazioni future.

I font sono serviti dallo stesso dominio in WOFF2, con `font-display: swap` e
preload dei due caratteri principali. Il subset conserva caratteri latini,
accenti italiani, punteggiatura e simboli; la larghezza non utilizzata del font
variabile viene fissata al valore normale. I cinque WOFF2 passano da 299.092 a
138.776 byte, conservando i pesi variabili. La home ha un'identità testuale leggibile,
senza il preloader a copertura dello schermo. I moduli hanno un'alternativa email
e telefono per chi naviga senza JavaScript. Menu, biografie, link telefonici,
percorso di navigazione e salto al contenuto sono utilizzabili con tecnologie
assistive. Il footer aggiunge collegamenti alle pagine principali e va a capo
correttamente sui dispositivi mobili.

## Verifiche ripetibili

```sh
npm ci
npm run build
npm test
npm run check:seo
```

- 15 test automatici: i 9 dell'invio email e 6 gruppi di controlli SEO, eseguiti
  sulle pagine generate. Controllano metadati univoci, H1, canonical, dati
  strutturati, sitemap, robots, collegamenti interni, frammenti e risorse.
- Browser Chromium: tutte le 13 pagine senza errori di idratazione, aggiornamento
  dei metadati durante la navigazione, biografie apribili, modulo mobile con
  risposta API simulata e contenuto disponibile senza JavaScript.
- `check:seo` verifica sul sito pubblicato status HTTP, pagine, sitemap, robots,
  redirect dell'articolo duplicato, 404 e disponibilità dell'endpoint contatti.
- Workflow GitHub `Build and SEO checks` per push su main e pull request.
- Controllo che `.env` e chiavi non siano presenti nei file Git o nel bundle.

Lighthouse mobile sul dominio pubblico, il 5 ottobre 2026 alle 17:24 CEST,
con limitazione simulata di rete/CPU, dopo l'ottimizzazione finale dei font:

| Misura | Risultato |
|---|---:|
| SEO | 100/100 |
| Accessibilità | 100/100 |
| Best practices | 100/100 |
| Performance | 67/100 |
| First Contentful Paint | 3,6 s |
| Largest Contentful Paint | 6,2 s |
| Total Blocking Time | 70 ms |
| Cumulative Layout Shift | 0 |

Resta margine sulle prestazioni iniziali: il punteggio Performance non è 100.
L'audit segnala CSS che blocca il rendering, JavaScript non utilizzato durante
il primo caricamento e ritardo di visualizzazione dell'elemento LCP. Un ulteriore
intervento può concentrarsi su caricamento del codice e animazioni della prima
schermata. La riduzione dei font è stata verificata nei download reali, ma non
ha modificato il punteggio aggregato di questa misura. Il precedente controllo
locale era 76/100: ambienti diversi non sono un confronto prima/dopo affidabile.
Questi risultati sono diagnostiche di laboratorio, non dati Core Web Vitals di
utenti reali né una prova di posizionamento. Un punteggio automatico di
accessibilità non sostituisce una verifica completa con tecnologie assistive.

Verifica HTTP in produzione completata su tutte le 13 pagine, sitemap e robots;
confermati redirect HTTPS/www/slash finale, redirect del duplicato, risposte 404,
endpoint contatti disponibile, `noindex` sul dominio tecnico Vercel e `.env`
non accessibile. Build e 15 test superati anche nella pipeline GitHub per i
commit `42d55ba` e `bce3e45`.

## Manutenzione e attività esterne

1. Inviare la sitemap a Search Console e Bing Webmaster Tools e verificare la
   proprietà del dominio. Non servono meta tag di verifica inventati.
2. Monitorare indicizzazione, errori, query e Core Web Vitals nei rispettivi
   pannelli. La pubblicazione dei file non garantisce indicizzazione o ranking.
3. Integrare Iubenda, come previsto dal proprietario. Gli URL delle informative
   possono essere configurati con `VITE_IUBENDA_PRIVACY_URL` e
   `VITE_IUBENDA_COOKIE_URL`. Banner, consenso e gestione dei servizi esterni
   richiedono l'integrazione Iubenda vera e propria.
4. Collegare il profilo Google Business ufficiale quando disponibile e mantenere
   sede, nome e telefono coerenti. Non sono stati indovinati profili social,
   orari di apertura, partita IVA o iscrizioni agli albi.
5. Per una nuova pagina aggiungere route e record in `src/seo/site.js`. Per una
   nuova news compilare slug, titolo, `seoTitle`, `description`, data e autore in
   `newsData.js`: sitemap e HTML vengono rigenerati dalla build.
6. Per nuove foto aggiornare l'elenco in `scripts/optimize-assets.mjs`, eseguire
   `npm run optimize:assets` e verificare le varianti generate. I WOFF2 sono
   rigenerabili con `python3 scripts/optimize-fonts.py` dopo aver installato
   `fonttools[woff]`; Alegreya Sans conserva la licenza OFL.
7. Conservare i redirect permanenti quando una pagina cambia indirizzo; evitare
   copie di articoli o pagine locali senza contenuti distinti e verificati.
8. Far verificare ai professionisti gli aggiornamenti sostanziali degli articoli
   giuridici e dichiarare date di revisione soltanto quando effettive.
