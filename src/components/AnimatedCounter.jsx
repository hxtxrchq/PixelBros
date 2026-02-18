import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ number, label, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // Parse the number string to extract suffixes and numeric value
  const parseNumber = (str) => {
    const hasPlus = str.includes('+');
    const hasMillion = str.includes('M');
    const hasPercent = str.includes('%');
    const hasK = str.includes('K');
    const hasX = str.includes('x');

    let numStr = str.replace(/[^\d.-]/g, '');
    let parsedNum = parseFloat(numStr);

    if (hasMillion) parsedNum = parsedNum * 1000000;
    if (hasK) parsedNum = parsedNum * 1000;

    return {
      originalValue: parsedNum,
      prefix: '',
      suffix: hasMillion
        ? hasPlus
          ? 'M+'
          : 'M'
        : hasK
          ? hasPlus
            ? 'K+'
            : 'K'
          : hasPercent
            ? '%'
            : hasX
              ? 'x'
              : hasPlus
                ? '+'
                : '',
      hasDecimal: str.includes('.'),
      originalStr: str,
    };
  };

  const { originalValue, prefix, suffix, hasDecimal } = parseNumber(number);

  // Format display value for output
  const formatDisplay = (value) => {
    if (suffix === 'M' || suffix === 'M+') {
      return (value / 1000000).toFixed(1);
    } else if (suffix === 'K' || suffix === 'K+') {
      return (value / 1000).toFixed(0);
    } else if (hasDecimal) {
      return value.toFixed(1);
    } else {
      return Math.round(value).toString();
    }
  };

  // IntersectionObserver to detect when element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2; // 2 seconds
    const fps = 60;
    const frames = duration * fps;
    let currentFrame = 0;

    const interval = setInterval(() => {
      currentFrame++;
      const progress = Math.min(currentFrame / frames, 1);
      
      // Easing function: easeOut cubic for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(originalValue * easedProgress);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayValue(originalValue);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [isVisible, originalValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-5xl md:text-6xl font-display font-bold text-[#1F1F1F] mb-3">
        <span>{formatDisplay(displayValue)}</span>
        {suffix && <span className="text-[#B3262E]">{suffix}</span>}
      </div>
      <div className="text-sm md:text-base text-[#4A4A4A] font-medium">{label}</div>
    </motion.div>
  );
};

export default AnimatedCounter;
