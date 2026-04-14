import { motion } from 'framer-motion';
import React from 'react';

const SplitText = ({ 
  text = '', 
  className = '', 
  delay = 0.05, 
  duration = 0.5,
  ease = [0.22, 1, 0.36, 1], // easeOutQuart
  onAnimationComplete
}) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: i * 0.1 },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: ease,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: duration,
        ease: ease,
      },
    },
  };

  return (
    <motion.h2
      style={{ display: 'flex', flexWrap: 'wrap' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
      onAnimationComplete={onAnimationComplete}
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.h2>
  );
};

export default SplitText;
