import { useState, useEffect, useCallback } from 'react';

const DEFAULT_SLIDES = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
];

const SLIDE_INTERVAL = 5000;

interface HeaderProps {
  title: string;
  subtitle?: string;
  slides?: string[];
}

export default function Header({ title, subtitle, slides }: HeaderProps) {
  const slideImages = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slideImages.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [slideImages.length]);

  return (
    <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-2xl group">
      {/* Slides */}
      {slideImages.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-puskesmas-900/80 via-puskesmas-800/60 to-puskesmas-700/70" />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

      {/* Animated Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div
          key={`title-${current}`}
          className="animate-[fadeSlideUp_0.7s_ease-out]"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-white/90 tracking-wide">UPTD Puskesmas Sangkali</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-white/85 font-medium drop-shadow-md max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slideImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === current
                ? 'w-8 bg-white shadow-lg shadow-white/30'
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Side Arrows (visible on hover) */}
      <button
        onClick={() => goTo((current - 1 + slideImages.length) % slideImages.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % slideImages.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 hover:scale-110"
        aria-label="Next slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div
          key={`progress-${current}`}
          className="h-full bg-linear-to-r from-green-400 to-emerald-300 animate-[progressFill_5s_linear]"
        />
      </div>
    </div>
  );
}