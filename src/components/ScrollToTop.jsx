import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Resetta lo scroll a 0 ad ogni cambio di rotta (navigazione tramite link/pulsanti). */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => {
        let id;
        try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
