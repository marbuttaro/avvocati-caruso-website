import { useSyncExternalStore } from 'react';
import { openCookiePreferences } from '../privacy/consent';
import './ConsentMap.css';

const mapsUrl = 'https://www.google.com/maps?q=40.8233438,14.1204631&z=16';

function subscribe(onChange) {
  window.addEventListener('iubenda:preferences', onChange);
  return () => window.removeEventListener('iubenda:preferences', onChange);
}

function hasMapConsent() {
  return window._iub?.cs?.api?.getPreferences?.()?.purposes?.['3'] === true;
}

export default function ConsentMap({ className = 'dove-siamo-map-iframe' }) {
  const allowed = useSyncExternalStore(subscribe, hasMapConsent, () => false);

  if (allowed) {
    return <iframe
      src={`${mapsUrl}&output=embed`}
      className={className}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer"
      title="Caruso Avvocati, Via Vincenzo Cosenza 31, Pozzuoli"
    />;
  }

  return <div className="map-consent">
    <p className="map-consent-title serif">La mappa di Google</p>
    <p>Per visualizzarla, autorizza i cookie della categoria «Esperienza».</p>
    <button type="button" onClick={openCookiePreferences}>Gestisci preferenze cookie</button>
    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Apri in Google Maps</a>
  </div>;
}
