import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Resetta lo scroll a 0 ad ogni cambio di rotta (navigazione tramite link/pulsanti). */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
