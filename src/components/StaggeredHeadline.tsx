import { useState, useEffect, useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { HERO_TYPING_PHRASES } from '../data/portfolioData';

interface StaggeredHeadlineProps {
  phrases?: string[];
  className?: string;
}

export default function StaggeredHeadline({
  phrases = HERO_TYPING_PHRASES,
  className = '',
}: StaggeredHeadlineProps) {
  const systemReducedMotion = useReducedMotion();
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isInitialComplete, setIsInitialComplete] = useState(false);
  const uniqueId = useId();

  // Detect and respect prefers-reduced-motion media query dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches || Boolean(systemReducedMotion));

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [systemReducedMotion]);

  const prefixText = 'I build';
  const suffixText = 'that people love to use.';
  const currentPhrase = phrases[currentPhraseIndex] || phrases[0];

  const staggerStep = 0.024; // 24ms between characters for crisp type-in
  const prefixCharCount = prefixText.length;
  const initialPhraseCharCount = phrases[0].length + 2; // includes brackets
  const prefixEndDelay = prefixCharCount * staggerStep;
  const phraseEndDelay = prefixEndDelay + initialPhraseCharCount * staggerStep;

  // Mark initial typing animation complete after full sentence types in
  useEffect(() => {
    if (prefersReduced) {
      setIsInitialComplete(true);
      return;
    }

    const totalInitialDuration = (phraseEndDelay + suffixText.length * staggerStep + 0.2) * 1000;
    const timer = setTimeout(() => {
      setIsInitialComplete(true);
    }, totalInitialDuration);

    return () => clearTimeout(timer);
  }, [prefersReduced, phraseEndDelay, suffixText.length]);

  // Rotate phrases after initial typing completes (only if reduced motion is NOT preferred)
  useEffect(() => {
    if (prefersReduced || !isInitialComplete) return;

    const currentPhraseLen = currentPhrase.length;
    const typeInDuration = currentPhraseLen * 0.028 * 1000;
    const readingPause = 3200; // time to comfortably read the phrase

    const timer = setTimeout(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, typeInDuration + readingPause);

    return () => clearTimeout(timer);
  }, [currentPhraseIndex, isInitialComplete, prefersReduced, phrases.length, currentPhrase.length]);

  // Helper to render words and staggered characters
  const renderStaggeredWords = (
    text: string,
    startDelay: number,
    colorClass = 'text-white'
  ) => {
    const words = text.split(' ');
    let runningCharIndex = 0;

    return words.map((word, wordIdx) => {
      const isLastWord = wordIdx === words.length - 1;
      const wordStartIndex = runningCharIndex;
      runningCharIndex += word.length + 1; // +1 for the space

      return (
        <span
          key={`word-${wordIdx}`}
          className={`inline-block whitespace-nowrap ${isLastWord ? '' : 'mr-[0.28em]'}`}
        >
          {word.split('').map((char, charIdx) => {
            const globalCharIdx = wordStartIndex + charIdx;
            const charDelay = prefersReduced ? 0 : startDelay + globalCharIdx * staggerStep;

            return (
              <motion.span
                key={`char-${globalCharIdx}`}
                className={`inline-block ${colorClass}`}
                initial={prefersReduced ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReduced ? 0 : 0.12,
                  delay: charDelay,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      );
    });
  };

  // Full accessible headline text
  const fullHeadlineText = `${prefixText} [${currentPhrase}] ${suffixText}`;

  return (
    <h1
      id={`hero-headline-${uniqueId}`}
      className={`font-grotesk font-bold tracking-tight text-white uppercase select-none ${className}`}
      aria-label={fullHeadlineText}
    >
      {/* Screen-reader friendly accessible text */}
      <span className="sr-only">{fullHeadlineText}</span>

      {/* Visual structured layout */}
      <span aria-hidden="true" className="block">
        {/* Tier 1: "I BUILD" */}
        <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05]">
          {renderStaggeredWords(prefixText, 0, 'text-white')}
        </span>

        {/* Tier 2: Dynamic bracketed phrase container with CSS Grid permanent height-lock
            All phrases are permanently rendered into the exact same grid cell (col-start-1 row-start-1)
            with the exact same typography, wrapping, and word spans.
            The inactive phrases are invisible (visibility: hidden), which guarantees that CSS Grid
            permanently locks the container height to the tallest phrase across all viewport widths.
            This completely eliminates all vertical layout shifts (CLS = 0) and prevents any page jumping. */}
        <span className="block my-2 sm:my-3.5 text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-[1.2] font-mono-code font-bold tracking-normal normal-case text-[#FF5C00]">
          <span className="grid grid-cols-1 grid-rows-1 items-start w-full">
            {phrases.map((phrase, phraseIdx) => {
              const isActive = phraseIdx === currentPhraseIndex;

              return (
                <span
                  key={`phrase-lock-${phraseIdx}`}
                  className={`col-start-1 row-start-1 w-full ${
                    isActive ? 'visible' : 'invisible pointer-events-none select-none'
                  }`}
                  aria-hidden={!isActive}
                >
                  <span className="text-white/40 font-mono-code mr-1 sm:mr-1.5 inline-block">[</span>

                  {phrase.split(' ').map((word, wordIdx, allWords) => {
                    const isLastWord = wordIdx === allWords.length - 1;
                    const wordStartIdx = phrase
                      .split(' ')
                      .slice(0, wordIdx)
                      .reduce((acc, w) => acc + w.length + 1, 0);

                    return (
                      <span
                        key={`word-${wordIdx}`}
                        className={`inline-block whitespace-nowrap ${isLastWord ? '' : 'mr-[0.28em]'}`}
                      >
                        {word.split('').map((char, charIdx) => {
                          const charPos = wordStartIdx + charIdx;
                          const charDelay = prefersReduced
                            ? 0
                            : isInitialComplete
                            ? charPos * 0.026
                            : prefixEndDelay + charPos * staggerStep;

                          return (
                            <motion.span
                              key={
                                isActive
                                  ? `active-char-${phraseIdx}-${charPos}`
                                  : `static-char-${phraseIdx}-${charPos}`
                              }
                              className="inline-block text-[#FF5C00] font-mono-code"
                              initial={prefersReduced || !isActive ? false : { opacity: 0, y: 3 }}
                              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
                              transition={{
                                duration: prefersReduced ? 0 : 0.1,
                                delay: isActive ? charDelay : 0,
                                ease: [0.2, 0.65, 0.3, 0.9],
                              }}
                            >
                              {char}
                            </motion.span>
                          );
                        })}
                      </span>
                    );
                  })}

                  {/* Terminal Blinking Cursor */}
                  <span
                    className={`font-mono-code text-[#FF5C00] ml-1 inline-block ${
                      prefersReduced ? 'opacity-80' : 'animate-pulse'
                    }`}
                  >
                    _
                  </span>

                  <span className="text-white/40 font-mono-code ml-1 sm:ml-1.5 inline-block">]</span>
                </span>
              );
            })}
          </span>
        </span>

        {/* Tier 3: "THAT PEOPLE LOVE TO USE." */}
        <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05]">
          {renderStaggeredWords(suffixText, phraseEndDelay, 'text-white')}
        </span>
      </span>
    </h1>
  );
}
