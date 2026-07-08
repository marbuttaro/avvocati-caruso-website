import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './Preloader.css';

const FULL_TEXT = 'CARUSO\nAVVOCATI';
const TYPING_SPEED = 85;
const HOLD_AFTER_TYPING = 700;
const EXIT_DURATION = 0.9;

const backdropVariants = {
  visible: { y: 0 },
  exit: { y: '-100%', transition: { duration: EXIT_DURATION, ease: [0.76, 0, 0.24, 1] } },
};

const logoVariants = {
  visible: { y: 0, opacity: 1 },
  exit: { y: '-40%', opacity: 0, transition: { duration: EXIT_DURATION * 0.7, ease: [0.76, 0, 0.24, 1] } },
};

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!visible) return;
    document.documentElement.classList.add('preloader-lock');
  }, [visible]);

  useEffect(() => {
    if (!visible || exiting || typedCount >= FULL_TEXT.length) return;
    if (reduceMotion) {
      setTypedCount(FULL_TEXT.length);
      return;
    }
    const t = setTimeout(() => setTypedCount((c) => c + 1), TYPING_SPEED);
    return () => clearTimeout(t);
  }, [typedCount, visible, exiting, reduceMotion]);

  useEffect(() => {
    if (typedCount < FULL_TEXT.length || exiting) return;
    const t = setTimeout(() => setExiting(true), reduceMotion ? 200 : HOLD_AFTER_TYPING);
    return () => clearTimeout(t);
  }, [typedCount, exiting, reduceMotion]);

  const handleExitComplete = () => {
    document.documentElement.classList.remove('preloader-lock');
    setVisible(false);
  };

  if (!visible) return null;

  const displayed = FULL_TEXT.slice(0, typedCount);
  const [line1, line2 = ''] = displayed.split('\n');

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!exiting && (
        <motion.div
          className="preloader-backdrop"
          variants={backdropVariants}
          initial="visible"
          animate="visible"
          exit="exit"
          transition={reduceMotion ? { duration: 0.3 } : undefined}
        >
          <motion.div
            className="preloader-type"
            role="img"
            aria-label="Studio Legale Caruso Avvocati"
            variants={logoVariants}
            initial="visible"
            animate="visible"
            exit="exit"
          >
            <div className="preloader-type-main serif">{line1}</div>
            <div className="preloader-type-sub">{line2}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
