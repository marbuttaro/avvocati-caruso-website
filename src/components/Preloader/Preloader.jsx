import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import LogoLettering from './LogoLettering';
import './Preloader.css';

const panelVariants = {
  visible: { y: 0 },
  exit: { y: '-100%', transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } },
};

const logoWrapVariants = {
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 0.4, ease: 'easeIn' } },
};

const hintVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.6, duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const triggeredRef = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!visible) return;

    document.documentElement.classList.add('preloader-lock');

    const triggerExit = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      setExiting(true);
    };

    const onWheel = (e) => {
      e.preventDefault();
      triggerExit();
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      triggerExit();
    };
    const onKeyDown = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) triggerExit();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [visible]);

  const handleExitComplete = () => {
    document.documentElement.classList.remove('preloader-lock');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!exiting && (
        <motion.div
          className="preloader"
          variants={panelVariants}
          initial="visible"
          animate="visible"
          exit="exit"
          transition={reduceMotion ? { duration: 0.3 } : undefined}
        >
          <motion.div
            className="preloader-logo-wrap"
            variants={logoWrapVariants}
            initial="visible"
            animate="visible"
            exit="exit"
            role="img"
            aria-label="Studio Legale Caruso Avvocati"
          >
            <LogoLettering className="preloader-logo" />
          </motion.div>
          <motion.div className="preloader-hint" variants={hintVariants} initial="hidden" animate="visible" exit="exit">
            <span className="preloader-hint-text sans">Scorri per iniziare</span>
            <span className="preloader-hint-arrow" aria-hidden="true" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
