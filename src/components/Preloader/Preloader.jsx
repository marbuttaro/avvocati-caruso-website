import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import LogoLettering from './LogoLettering';
import './Preloader.css';

const FLY_DURATION = 0.9;

const backdropVariants = {
  visible: { y: 0 },
  exit: { y: '-100%', transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } },
};

const hintVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.6, duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [flyState, setFlyState] = useState(null);
  const triggeredRef = useRef(false);
  const logoWrapRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!visible) return;

    document.documentElement.classList.add('preloader-lock');

    const triggerExit = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;

      const fromEl = logoWrapRef.current;
      const toEl = document.querySelector('.logo-img');
      if (fromEl && toEl) {
        const from = fromEl.getBoundingClientRect();
        const to = toEl.getBoundingClientRect();
        setFlyState({
          from: { top: from.top, left: from.left, width: from.width, height: from.height },
          to: { top: to.top, left: to.left, width: to.width, height: to.height },
        });
      }

      setExiting(true);

      const delay = reduceMotion ? 300 : FLY_DURATION * 1000;
      setTimeout(() => {
        document.documentElement.classList.remove('preloader-lock');
        setVisible(false);
      }, delay);
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
  }, [visible, reduceMotion]);

  if (!visible) return null;

  const logoStyle = flyState
    ? {
        position: 'fixed',
        top: flyState.from.top,
        left: flyState.from.left,
        width: flyState.from.width,
        height: flyState.from.height,
        margin: 0,
      }
    : undefined;

  return (
    <>
      <AnimatePresence>
        {!exiting && (
          <motion.div
            className="preloader-backdrop"
            variants={backdropVariants}
            initial="visible"
            animate="visible"
            exit="exit"
            transition={reduceMotion ? { duration: 0.3 } : undefined}
          />
        )}
      </AnimatePresence>

      <div className="preloader-logo-stage" aria-hidden={flyState ? 'true' : undefined}>
        <motion.div
          ref={logoWrapRef}
          className="preloader-logo-shared"
          style={logoStyle}
          animate={
            flyState
              ? {
                  top: flyState.to.top,
                  left: flyState.to.left,
                  width: flyState.to.width,
                  height: flyState.to.height,
                }
              : undefined
          }
          transition={{ duration: reduceMotion ? 0.3 : FLY_DURATION, ease: [0.76, 0, 0.24, 1] }}
          role="img"
          aria-label="Studio Legale Caruso Avvocati"
        >
          <LogoLettering className="preloader-logo" />
        </motion.div>
      </div>

      <AnimatePresence>
        {!exiting && (
          <motion.div className="preloader-hint" variants={hintVariants} initial="hidden" animate="visible" exit="exit">
            <span className="preloader-hint-text sans">Scorri per iniziare</span>
            <span className="preloader-hint-arrow" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Preloader;
