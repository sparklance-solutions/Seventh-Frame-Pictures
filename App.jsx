import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './style.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Utility to check user motion preference for GSAP animations
const getMotionPref = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================================================
// DATA & ASSETS
// ==========================================================================
const galleryImages = [
  "/images/projector.webp",
  "/images/chair.webp",
  "/images/camera.webp"
];

// ==========================================================================
// PRELOADER (PRESERVED EXCACTLY AS REQUESTED)
// ==========================================================================
const Preloader = ({ onComplete }) => {
  const [activeStage, setActiveStage] = useState(null);
  const [flash, setFlash] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const triggerJump = useRef(0);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const runSequence = async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const stages = ['stage-3', 'stage-2', 'stage-1', 'stage-lights', 'stage-camera', 'stage-action'];
      
      for (let i = 0; i < stages.length; i++) {
        setActiveStage(stages[i]);
        triggerJump.current += 1;
        
        if (i === stages.length - 1) {
          await sleep(900);
          if (!isReducedMotion) setFlash(true);
          await sleep(100);
        } else {
          await sleep(isReducedMotion ? 100 : 1000);
        }
      }

      setExiting(true);
      await sleep(600);

      setIsVisible(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      onComplete();
    };

    runSequence();
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`preloader ${exiting ? 'exiting' : ''}`}>
      <div className="film-grain"></div>
      <div className="pl-borders">
          <div className="pl-reg-mark pl-reg-tl"></div><div className="pl-reg-mark pl-reg-tr"></div>
          <div className="pl-reg-mark pl-reg-bl"></div><div className="pl-reg-mark pl-reg-br"></div>
      </div>
      <div className={`pl-stage ${activeStage === 'stage-3' ? 'active' : ''}`}>
          <div key={`jump-3-${triggerJump.current}`} className="pl-cd-frame frame-jump">
              <div className="pl-cd-ring"></div><div className="pl-cd-ring-inner"></div>
              <div className="pl-cd-cross-h"></div><div className="pl-cd-cross-v"></div>
              <span className="pl-cd-num">3</span>
              <span className="pl-cd-meta" style={{ top: '10%' }}>SEVENTH FRAME</span>
          </div>
      </div>
      <div className={`pl-stage ${activeStage === 'stage-2' ? 'active' : ''}`}>
          <div key={`jump-2-${triggerJump.current}`} className="pl-cd-frame frame-jump">
              <div className="pl-cd-ring" style={{ transform: 'rotate(45deg)' }}></div><div className="pl-cd-ring-inner"></div>
              <div className="pl-cd-cross-h" style={{ top: '48%' }}></div><div className="pl-cd-cross-v"></div>
              <span className="pl-cd-num">2</span>
              <span className="pl-cd-meta" style={{ bottom: '10%' }}>PICTURES</span>
          </div>
      </div>
      <div className={`pl-stage ${activeStage === 'stage-1' ? 'active' : ''}`}>
          <div key={`jump-1-${triggerJump.current}`} className="pl-cd-frame frame-jump">
              <div className="pl-cd-ring" style={{ transform: 'rotate(90deg)' }}></div><div className="pl-cd-ring-inner"></div>
              <div className="pl-cd-cross-h"></div><div className="pl-cd-cross-v" style={{ left: '52%' }}></div>
              <span className="pl-cd-num">1</span>
              <span className="pl-cd-meta" style={{ left: '10%', transform: 'rotate(-90deg)' }}>SCENE 001</span>
          </div>
      </div>
      <div className={`pl-stage ${activeStage === 'stage-lights' ? 'active' : ''}`}>
          <div className="pl-comp">
              <div className="pl-fresnel">
                  <div className="pl-fresnel-lens"></div>
                  <div className="pl-fresnel-stand"></div>
                  <div className="pl-fresnel-beam"></div>
              </div>
              <span className="pl-word">LIGHTS</span>
          </div>
      </div>
      <div className={`pl-stage ${activeStage === 'stage-camera' ? 'active' : ''}`}>
          <div className="pl-comp">
              <div className="pl-cinema-cam">
                  <div className="pl-cam-lens"></div>
                  <div className="pl-cam-mag-1"></div>
                  <div className="pl-cam-mag-2"></div>
                  <div className="pl-cam-handle"></div>
                  <div className="pl-cam-rec"></div>
              </div>
              <span className="pl-word">CAMERA</span>
          </div>
      </div>
      <div className={`pl-stage ${activeStage === 'stage-action' ? 'active' : ''}`}>
          <div key={`jump-action-${triggerJump.current}`} className="pl-comp frame-jump">
              <div className="pl-clapper">
                  <div className="pl-clapper-top"></div>
                  <div className="pl-clapper-board">
                      <div className="pl-clapper-line"></div><div className="pl-clapper-line"></div>
                      <div className="pl-clapper-line" style={{ gridColumn: 'span 2' }}></div>
                  </div>
              </div>
              <span className="pl-word">ACTION</span>
          </div>
      </div>
      <div className={`pl-flash ${flash ? 'flash-trigger' : ''}`}></div>
      <div className="pl-shutter">
          <div className="pl-shutter-panel pl-shutter-left"></div>
          <div className="pl-shutter-panel pl-shutter-right"></div>
      </div>
    </div>
  );
};

// ==========================================================================
// NAVBAR
// ==========================================================================
const Navbar = ({ isReady }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    if (!isReady) return;
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.2
    });
  }, [isReady]);

  return (
    <header 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-700 border-b invisible-until-scroll ${scrolled ? 'bg-[#050505]/95 backdrop-blur-md border-gold-400/20 shadow-lg' : 'bg-transparent border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center space-x-3 group outline-none">
          <div className="w-10 h-10 rounded-full border border-gold-400 flex items-center justify-center text-gold-400 font-cinzel font-bold text-base group-hover:bg-gold-400 group-hover:text-black transition duration-300">
            <img src="public/images/logo.webp" alt="Logo" className="w-6 h-6 object-contain hidden" />
            SF
          </div>
          <div>
            <span className="font-cinzel text-base md:text-lg font-bold tracking-widest gold-gradient-text block">SEVENTH FRAME</span>
            <span className="text-[8px] tracking-[0.3em] text-gray-400 uppercase block">PICTURES LLP.</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center space-x-8 font-cinzel text-xs tracking-[0.2em] text-gray-300">
          {['OUR FILMS', 'DIRECTORS BOARD', 'SHOWREEL', 'GALLERY', 'ABOUT US', 'CONTACT US'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-gold-400 transition outline-none focus:text-gold-400">
              {item}
            </a>
          ))}
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-gold-400 text-xl focus:outline-none p-2">
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#0a0a0a] border-b border-gold-400/20 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col space-y-4 font-cinzel text-xs tracking-[0.2em]">
              {['OUR FILMS', 'DIRECTORS BOARD', 'SHOWREEL', 'GALLERY', 'ABOUT US', 'CONTACT US'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-gold-400 transition">
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ==========================================================================
// CINEMATIC HEADER COMPONENT (Reusable)
// ==========================================================================
const CinematicHeader = ({ eyebrow, title }) => {
  return (
    <div className="section-header text-center mb-20 relative">
      <div className="overflow-hidden mb-2">
        <span className="header-eyebrow inline-block text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase invisible-until-scroll">{eyebrow}</span>
      </div>
      <div className="gold-line-x mx-auto max-w-[100px] mb-4 invisible-until-scroll"></div>
      <div className="overflow-hidden">
        <h2 className="header-title inline-block font-cinzel text-3xl md:text-5xl font-bold text-white invisible-until-scroll">{title}</h2>
      </div>
    </div>
  );
};

// ==========================================================================
// HERO
// ==========================================================================
const Hero = ({ isReady }) => {
  const heroRef = useRef(null);

  useGSAP(() => {
    if (!isReady) return;
    const canAnimate = getMotionPref();

    // 1. Initial Cinematic Mount
    const tl = gsap.timeline();
    tl.fromTo('.hero-tag', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.5)
      .fromTo('.hero-title', { y: 30, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }, 0.7)
      .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 1.1)
      .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 1.3);

    // 2. Cinematic Scroll Dolly (Scrub)
    if (canAnimate) {
      gsap.to('.hero-bg', {
        yPercent: 20,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to('.hero-content', {
        y: -100,
        opacity: 0,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }
  }, [isReady]);

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      <div className="hero-bg absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: 'url(/images/projector.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/40"></div>
      </div>

      <div className="hero-content relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        <div className="hero-tag inline-block px-4 py-1.5 border border-gold-400/50 rounded-full bg-gold-400/10 text-gold-300 font-cinzel text-xs tracking-[0.3em] uppercase mb-6 backdrop-blur-sm shadow-lg shadow-gold-400/10 invisible-until-scroll">
          ✦ INDEPENDENT CINEMATIC PRODUCTIONS ✦
        </div>
        
        <h1 className="hero-title font-cinzel text-4xl sm:text-6xl md:text-7xl font-black tracking-wider text-white mb-6 uppercase drop-shadow-2xl invisible-until-scroll">
          SEVENTH FRAME <span className="gold-gradient-text block mt-2">PICTURES</span>
        </h1>
        
        <p className="hero-desc font-sans font-light text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed invisible-until-scroll">
          Dedicated to crafting visually striking narratives and high-quality motion pictures for the modern cinematic landscape.
        </p>
        
        <div className="hero-cta invisible-until-scroll">
          <a href="#our-films" className="px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-400 text-black font-cinzel font-bold text-xs tracking-[0.25em] rounded-sm shadow-xl hover:brightness-110 transition duration-300">
            VIEW SLATE
          </a>
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// OUR FILMS
// ==========================================================================
const OurFilms = ({ isReady }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!isReady) return;
    const canAnimate = getMotionPref();

    // Section Header Reveal
    const headerTl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
    headerTl.fromTo('.header-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, autoAlpha: 1, ease: 'power3.out' })
            .fromTo('.gold-line-x', { scaleX: 0 }, { scaleX: 1, duration: 1, autoAlpha: 1, ease: 'power3.inOut' }, "-=0.4")
            .fromTo('.header-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, autoAlpha: 1, ease: 'power3.out' }, "-=0.6");

    // Film Cards Reveal & Parallax
    gsap.utils.toArray('.film-card-wrapper').forEach((card) => {
      const img = card.querySelector('.film-parallax-img');
      const content = card.querySelector('.film-content');

      // Entry Reveal
      gsap.fromTo(card, 
        { y: 100, clipPath: 'inset(15% 0 15% 0)' },
        { y: 0, clipPath: 'inset(0% 0 0% 0)', duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: card, start: "top 85%" } }
      );
      
      gsap.fromTo(content,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: "top 75%" } }
      );

      // Scroll Parallax (Dolly effect through the window)
      if (canAnimate) {
        gsap.fromTo(img, 
          { yPercent: -15, scale: 1.05 },
          { yPercent: 15, scale: 1.05, ease: 'none', scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } }
        );
      }
    });
  }, [isReady]);

  return (
    <section id="our-films" ref={sectionRef} className="py-32 bg-[#080808] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <CinematicHeader eyebrow="Current Slate" title="PRODUCTION PROJECTS" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Film 1 */}
          <div className="film-card-wrapper group relative bg-[#0f0f0f] rounded-sm overflow-hidden border border-gold-400/20">
            <div className="relative h-[500px] overflow-hidden bg-black">
              <div 
                className="film-parallax-img absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center opacity-70 group-hover:scale-[1.08] transition-transform duration-[2s] ease-out"
                style={{ backgroundImage: 'url(/images/camera.webp)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90"></div>
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-gold-400/30 text-gold-400 text-[10px] font-cinzel px-3 py-1.5 rounded-sm">
                IN DEVELOPMENT
              </div>
            </div>
            <div className="film-content p-8 relative -mt-24 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent invisible-until-scroll">
              <div className="text-xs text-gold-400/80 font-cinzel tracking-widest mb-2">Feature Film</div>
              <h3 className="font-cinzel text-2xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors duration-500">PRODUCTION NO. 1</h3>
              <div className="h-px w-0 bg-gold-400/50 group-hover:w-full transition-all duration-700 ease-out mb-4"></div>
              <button className="w-full mt-2 py-3 border border-gold-400/30 text-gold-300 font-cinzel text-xs tracking-widest rounded-sm group-hover:border-gold-400/80 group-hover:bg-gold-400/5 transition-all duration-500">
                DETAILS PENDING
              </button>
            </div>
          </div>

          {/* Film 2 */}
          <div className="film-card-wrapper group relative bg-[#0f0f0f] rounded-sm overflow-hidden border border-gold-400/20 md:mt-16">
            <div className="relative h-[500px] overflow-hidden bg-black">
              <div 
                className="film-parallax-img absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center opacity-70 group-hover:scale-[1.08] transition-transform duration-[2s] ease-out"
                style={{ backgroundImage: 'url(/images/projector.webp)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90"></div>
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-gold-400/30 text-gold-400 text-[10px] font-cinzel px-3 py-1.5 rounded-sm">
                EARLY STAGES
              </div>
            </div>
            <div className="film-content p-8 relative -mt-24 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent invisible-until-scroll">
              <div className="text-xs text-gold-400/80 font-cinzel tracking-widest mb-2">Documentary Feature</div>
              <h3 className="font-cinzel text-2xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors duration-500">PRODUCTION NO. 2</h3>
              <div className="h-px w-0 bg-gold-400/50 group-hover:w-full transition-all duration-700 ease-out mb-4"></div>
              <button className="w-full mt-2 py-3 border border-gold-400/30 text-gold-300 font-cinzel text-xs tracking-widest rounded-sm group-hover:border-gold-400/80 group-hover:bg-gold-400/5 transition-all duration-500">
                DETAILS PENDING
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// DIRECTORS BOARD
// ==========================================================================
const DirectorsBoard = ({ isReady }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!isReady) return;
    const canAnimate = getMotionPref();

    const headerTl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
    headerTl.fromTo('.db-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, autoAlpha: 1, ease: 'power3.out' })
            .fromTo('.db-line', { scaleX: 0 }, { scaleX: 1, duration: 1, autoAlpha: 1, ease: 'power3.inOut' }, "-=0.4")
            .fromTo('.db-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, autoAlpha: 1, ease: 'power3.out' }, "-=0.6");

    gsap.fromTo('.director-card', 
      { y: 40, scale: 0.96, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: '.directors-grid', start: "top 85%" } }
    );
    
    if (canAnimate) {
        gsap.to('.directors-grid', {
            y: -30, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true }
        });
    }

  }, [isReady]);

  return (
    <section id="directors-board" ref={sectionRef} className="py-32 bg-[#050505] border-t border-b border-gold-400/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 relative">
          <div className="overflow-hidden mb-2">
            <span className="db-eyebrow inline-block text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase invisible-until-scroll">Creative Vision</span>
          </div>
          <div className="db-line gold-line-x mx-auto max-w-[100px] mb-4 invisible-until-scroll"></div>
          <div className="overflow-hidden">
            <h2 className="db-title inline-block font-cinzel text-3xl md:text-5xl font-bold text-white invisible-until-scroll">DIRECTORS BOARD</h2>
          </div>
        </div>

        <div className="directors-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="director-card invisible-until-scroll relative bg-[#0a0a0a] p-10 rounded-sm border border-gold-400/20 text-center group transition duration-700 hover:border-gold-400/50">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#111] border border-gold-400/30 flex items-center justify-center mb-8 overflow-hidden group-hover:border-gold-400 transition-colors duration-500 shadow-lg shadow-black">
                 <i className="fa-solid fa-user text-gray-600 text-3xl group-hover:text-gold-400/50 transition-colors duration-500"></i>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition duration-500">DIRECTOR 0{num}</h3>
              <p className="text-gold-400/50 text-xs font-cinzel tracking-[0.2em]">INDEPENDENT FILMMAKER</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// SHOWREEL
// ==========================================================================
const Showreel = ({ isReady }) => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useGSAP(() => {
    if (!isReady) return;
    const canAnimate = getMotionPref();

    const headerTl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
    headerTl.fromTo('.sr-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, autoAlpha: 1, ease: 'power3.out' })
            .fromTo('.sr-line', { scaleX: 0 }, { scaleX: 1, duration: 1, autoAlpha: 1, ease: 'power3.inOut' }, "-=0.4")
            .fromTo('.sr-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, autoAlpha: 1, ease: 'power3.out' }, "-=0.6");

    gsap.fromTo('.sr-frame', 
      { scale: 0.95, opacity: 0, clipPath: 'inset(10% 10% 10% 10%)' },
      { scale: 1, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: '.sr-frame', start: "top 85%" } }
    );

    if (canAnimate) {
      gsap.fromTo('.sr-video-inner',
        { yPercent: -10, scale: 1.05 },
        { yPercent: 10, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.sr-frame', start: "top bottom", end: "bottom top", scrub: true } }
      );
    }
  }, [isReady]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="showreel" ref={sectionRef} className="py-32 bg-[#080808] relative">
      {/* Subtle light behind the screen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-gold-400/5 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative">
          <div className="overflow-hidden mb-2">
            <span className="sr-eyebrow inline-block text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase invisible-until-scroll">Visual Library</span>
          </div>
          <div className="sr-line gold-line-x mx-auto max-w-[100px] mb-4 invisible-until-scroll"></div>
          <div className="overflow-hidden">
            <h2 className="sr-title inline-block font-cinzel text-3xl md:text-5xl font-bold text-white invisible-until-scroll">SHOWREEL</h2>
          </div>
        </div>

        <div className="sr-frame invisible-until-scroll relative bg-black rounded-sm border border-gold-400/20 overflow-hidden shadow-2xl aspect-video cursor-pointer" onClick={togglePlay}>
          <div className="w-full h-full overflow-hidden relative">
              <video 
                ref={videoRef}
                className="sr-video-inner absolute inset-0 w-full h-[120%] -top-[10%] object-cover opacity-80"
                poster="/images/camera.webp"
                onEnded={() => setIsPlaying(false)}
                playsInline
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
          </div>
          
          <AnimatePresence>
            {!isPlaying && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
              >
                <div className="w-24 h-24 rounded-full border border-gold-400/50 bg-black/50 text-gold-400 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-105 hover:bg-gold-400 hover:text-black transition-all duration-500">
                  <i className="fa-solid fa-play ml-2"></i>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isPlaying && (
            <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur px-5 py-2.5 border border-gold-400/30 text-gold-400/70 text-[10px] font-cinzel tracking-[0.2em] uppercase rounded-sm">
              Playing
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// GALLERY & VIEWER (PRESERVED)
// ==========================================================================
const GalleryViewer = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-gold-400 hover:text-white text-3xl z-10 transition focus:outline-none">
        <i className="fa-solid fa-xmark"></i>
      </button>

      <button onClick={onPrev} className="absolute left-4 md:left-10 text-gold-400/50 hover:text-gold-400 text-4xl z-10 transition focus:outline-none hidden sm:block">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button onClick={onNext} className="absolute right-4 md:right-10 text-gold-400/50 hover:text-gold-400 text-4xl z-10 transition focus:outline-none hidden sm:block">
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      <div className="absolute inset-y-0 left-0 w-1/4 z-0 sm:hidden" onClick={onPrev}></div>
      <div className="absolute inset-y-0 right-0 w-1/4 z-0 sm:hidden" onClick={onNext}></div>

      <div className="w-full h-full p-4 md:p-20 flex items-center justify-center relative overflow-hidden pointer-events-none">
        <AnimatePresence mode='wait'>
          <motion.img 
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-full max-h-full object-contain border border-gold-400/20 shadow-2xl"
          />
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 font-cinzel text-gold-400 text-xs tracking-[0.3em]">
        {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>
    </motion.div>
  );
};

const Gallery = ({ isReady }) => {
  const sectionRef = useRef(null);
  const [viewerIndex, setViewerIndex] = useState(null);

  const openViewer = (index) => setViewerIndex(index);
  const closeViewer = () => setViewerIndex(null);
  const nextImage = () => setViewerIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setViewerIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  useGSAP(() => {
    if (!isReady) return;
    const canAnimate = getMotionPref();

    const headerTl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
    headerTl.fromTo('.gal-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, autoAlpha: 1, ease: 'power3.out' })
            .fromTo('.gal-line', { scaleX: 0 }, { scaleX: 1, duration: 1, autoAlpha: 1, ease: 'power3.inOut' }, "-=0.4")
            .fromTo('.gal-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, autoAlpha: 1, ease: 'power3.out' }, "-=0.6");

    gsap.utils.toArray('.gal-item').forEach((item, i) => {
        gsap.fromTo(item, 
            { y: 50, clipPath: 'inset(10% 0 10% 0)', opacity: 0 },
            { y: 0, clipPath: 'inset(0% 0 0% 0)', opacity: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: item, start: "top 90%" } }
        );

        if (canAnimate) {
            const img = item.querySelector('.gal-img');
            gsap.fromTo(img,
                { yPercent: -10, scale: 1.05 },
                { yPercent: 10, scale: 1.05, ease: 'none', scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } }
            );
        }
    });
  }, [isReady]);

  return (
    <section id="gallery" ref={sectionRef} className="py-32 bg-[#050505] border-t border-gold-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <div className="overflow-hidden mb-2">
            <span className="gal-eyebrow inline-block text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase invisible-until-scroll">Behind The Scenes</span>
          </div>
          <div className="gal-line gold-line-x mx-auto max-w-[100px] mb-4 invisible-until-scroll"></div>
          <div className="overflow-hidden">
            <h2 className="gal-title inline-block font-cinzel text-3xl md:text-5xl font-bold text-white invisible-until-scroll">GALLERY</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((src, idx) => (
            <div 
              key={idx}
              className="gal-item invisible-until-scroll relative aspect-[4/5] overflow-hidden cursor-pointer border border-gold-400/10 group bg-black"
              onClick={() => openViewer(idx)}
            >
              <div 
                className="gal-img absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                style={{ backgroundImage: `url(${src})` }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-700 scale-90 group-hover:scale-100 ease-out">
                <div className="w-12 h-12 rounded-full border border-gold-400/50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <i className="fa-solid fa-expand text-gold-400/80 text-sm"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {viewerIndex !== null && (
          <GalleryViewer 
            images={galleryImages} 
            currentIndex={viewerIndex} 
            onClose={closeViewer}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// ==========================================================================
// ABOUT US
// ==========================================================================
const AboutUs = ({ isReady }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!isReady) return;
    const canAnimate = getMotionPref();

    const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
    tl.fromTo('.au-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, autoAlpha: 1, ease: 'power3.out' })
      .fromTo('.au-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, autoAlpha: 1, ease: 'power3.out' }, "-=0.6")
      .fromTo('.au-text', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, autoAlpha: 1, stagger: 0.2, ease: 'power3.out' }, "-=0.6")
      .fromTo('.au-line', { scaleX: 0 }, { scaleX: 1, duration: 1.5, autoAlpha: 1, ease: 'power3.inOut' }, "-=0.8");

    gsap.fromTo('.au-img-wrapper', 
        { scale: 0.95, opacity: 0, clipPath: 'inset(10% 0 10% 0)' }, 
        { scale: 1, opacity: 1, clipPath: 'inset(0% 0 0% 0)', duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: '.au-img-wrapper', start: "top 80%" } }
    );

    // Slow Camera Dolly Parallax
    if (canAnimate) {
        gsap.to('.au-text-col', {
            y: -40, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true }
        });
        gsap.fromTo('.au-img', 
            { yPercent: -15, scale: 1.05 }, 
            { yPercent: 15, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.au-img-wrapper', start: "top bottom", end: "bottom top", scrub: true } }
        );
    }
  }, [isReady]);

  return (
    <section id="about-us" ref={sectionRef} className="py-32 bg-[#080808] border-t border-gold-400/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="au-text-col relative z-10">
            <span className="au-eyebrow inline-block text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase mb-4 invisible-until-scroll">Company Profile</span>
            <h2 className="au-title font-cinzel text-4xl md:text-5xl font-bold text-white mb-8 invisible-until-scroll">ABOUT STUDIO</h2>
            
            <p className="au-text font-sans font-light text-gray-300 text-base leading-relaxed mb-6 invisible-until-scroll">
              Seventh Frame Pictures LLP is an independent production company dedicated to the art of modern filmmaking. We collaborate with passionate storytellers and technical craftsmen to bring compelling narratives to life.
            </p>
            <p className="au-text font-sans font-light text-gray-400 text-base leading-relaxed mb-10 invisible-until-scroll">
              Based in Kochi, Kerala, our studio integrates traditional cinematic values with contemporary production methodologies to produce content that resonates with modern audiences.
            </p>
            
            <div className="au-line h-px w-full bg-gradient-to-r from-gold-400/40 to-transparent invisible-until-scroll origin-left"></div>
          </div>
          
          <div className="relative">
            <div className="au-img-wrapper invisible-until-scroll relative bg-black p-2 rounded-sm border border-gold-400/20 overflow-hidden aspect-[4/5]">
                <div 
                    className="au-img absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center grayscale opacity-80 transition-[filter] duration-[2s] hover:grayscale-0"
                    style={{ backgroundImage: 'url(/images/chair.webp)' }}
                />
            </div>
            {/* Cinematic depth overlay */}
            <div className="absolute -inset-10 bg-gradient-to-r from-[#080808] via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// PARTNER WITH US & CONTACT
// ==========================================================================
const ContactSection = ({ isReady }) => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!isReady) return;
    const canAnimate = getMotionPref();

    const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
    
    // Partner Reveal
    tl.fromTo('.partner-content > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, autoAlpha: 1, stagger: 0.15, ease: 'power3.out' });
    
    // Contact Reveal
    gsap.fromTo('.contact-title-group > *', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, autoAlpha: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.contact-form-wrapper', start: "top 85%" } }
    );
    gsap.fromTo('.contact-form-wrapper', 
        { y: 50, opacity: 0, clipPath: 'inset(10% 0 0 0)' }, 
        { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.5, autoAlpha: 1, ease: 'power3.out', scrollTrigger: { trigger: '.contact-form-wrapper', start: "top 80%" } }
    );
    gsap.fromTo('.form-element', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, autoAlpha: 1, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.contact-form-wrapper', start: "top 70%" } }
    );

    if(canAnimate) {
        gsap.to('.contact-bg-parallax', {
            yPercent: 15, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true }
        });
    }
  }, [isReady]);

  return (
    <section id="contact-us" ref={sectionRef} className="bg-[#050505] relative overflow-hidden">
      
      {/* Background Cinematic Movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] mix-blend-screen">
          <div className="contact-bg-parallax absolute inset-0 w-full h-[130%] -top-[15%] bg-[url('/images/projector.webp')] bg-cover bg-center"></div>
      </div>
      <div className="cinematic-vignette"></div>

      {/* Partner With Us */}
      <div id="partner-with-us" className="pt-32 pb-16 relative z-10 border-t border-gold-400/10">
        <div className="partner-content max-w-4xl mx-auto px-4 text-center">
            <div className="invisible-until-scroll w-16 h-16 mx-auto rounded-full border border-gold-400/20 flex items-center justify-center mb-8 bg-[#0a0a0a]">
                <i className="fa-solid fa-handshake text-gold-400/50 text-2xl"></i>
            </div>
            <h2 className="invisible-until-scroll font-cinzel text-3xl md:text-4xl font-bold text-white mb-6">PARTNER WITH US</h2>
            <p className="invisible-until-scroll font-sans font-light text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              We are actively exploring co-production opportunities, strategic alliances, and distribution partnerships for our upcoming theatrical features.
            </p>
            <div className="invisible-until-scroll gold-line-x mx-auto max-w-xs mb-10 opacity-30"></div>
        </div>
      </div>

      {/* Contact Us Final Scene */}
      <div className="pb-32 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
            <div className="contact-title-group text-center mb-16">
                <span className="invisible-until-scroll inline-block text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase mb-4">Final Scene</span>
                <h2 className="invisible-until-scroll font-cinzel text-3xl md:text-5xl font-bold text-white mb-2">INITIATE DIALOGUE</h2>
            </div>

            <div className="contact-form-wrapper invisible-until-scroll bg-[#080808]/80 backdrop-blur-md p-10 md:p-16 border border-gold-400/20 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="form-element invisible-until-scroll relative group">
                    <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-gray-800 py-3 text-white font-cinzel text-sm tracking-widest focus:outline-none focus:border-gold-400 transition-colors" />
                </div>
                <div className="form-element invisible-until-scroll relative group">
                    <input type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-gray-800 py-3 text-white font-cinzel text-sm tracking-widest focus:outline-none focus:border-gold-400 transition-colors" />
                </div>
                </div>
                <div className="form-element invisible-until-scroll relative group">
                <input type="text" placeholder="SUBJECT" className="w-full bg-transparent border-b border-gray-800 py-3 text-white font-cinzel text-sm tracking-widest focus:outline-none focus:border-gold-400 transition-colors" />
                </div>
                <div className="form-element invisible-until-scroll relative group">
                <textarea placeholder="MESSAGE" rows="3" className="w-full bg-transparent border-b border-gray-800 py-3 text-white font-cinzel text-sm tracking-widest focus:outline-none focus:border-gold-400 transition-colors resize-none"></textarea>
                </div>
                <div className="form-element invisible-until-scroll pt-4">
                    <button className="w-full py-5 border border-gold-400/40 text-gold-400 font-cinzel font-bold text-xs tracking-[0.3em] hover:bg-gold-400 hover:text-black transition-colors duration-500 uppercase">
                    Transmit Communication
                    </button>
                </div>
            </form>
            </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// FOOTER
// ==========================================================================
const Footer = ({ isReady }) => {
  const footerRef = useRef(null);

  useGSAP(() => {
    if (!isReady) return;
    gsap.fromTo('.footer-reveal > *', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: footerRef.current, start: "top 90%" } }
    );
  }, [isReady]);

  return (
    <footer ref={footerRef} className="bg-[#020202] border-t border-gold-400/10 pt-24 pb-8 text-gray-400 font-cinzel relative z-20">
      <div className="footer-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
        <div>
          <div className="flex items-center space-x-4 mb-8">
            <img src="/images/logo.webp" alt="Logo" className="w-12 h-12 object-contain" />
            <div>
                <span className="font-cinzel text-lg font-bold gold-gradient-text tracking-widest block">SEVENTH FRAME</span>
                <span className="text-[9px] tracking-[0.3em] text-gray-500 uppercase block mt-1">PICTURES LLP.</span>
            </div>
          </div>
          <p className="font-sans font-light text-gray-500 text-xs leading-relaxed max-w-sm">
            Independent production house delivering striking visual narratives and professional cinematic content for the modern era.
          </p>
        </div>
        <div>
          <h4 className="text-gold-400/70 tracking-widest mb-8 font-bold uppercase text-xs">Navigation Matrix</h4>
          <ul className="space-y-4 text-xs tracking-widest text-gray-500">
            <li><a href="#our-films" className="hover:text-gold-400 transition-colors">PRODUCTIONS</a></li>
            <li><a href="#directors-board" className="hover:text-gold-400 transition-colors">DIRECTORS</a></li>
            <li><a href="#showreel" className="hover:text-gold-400 transition-colors">SHOWREEL</a></li>
            <li><a href="#about-us" className="hover:text-gold-400 transition-colors">ABOUT STUDIO</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold-400/70 tracking-widest mb-8 font-bold uppercase text-xs">Headquarters</h4>
          <p className="text-gray-500 mb-8 leading-relaxed font-sans font-light text-sm">
            Seventh Frame Pictures LLP<br />
            Kochi, Kerala, India
          </p>
          <div className="flex space-x-6 text-gold-400/50 text-xl">
            <a href="#" className="hover:text-gold-400 transition-colors"><i className="fa-brands fa-youtube"></i></a>
            <a href="#" className="hover:text-gold-400 transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-gold-400 transition-colors"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gold-400/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-widest uppercase text-gray-600">
        <span>&copy; {new Date().getFullYear()} Seventh Frame Pictures LLP. All Rights Reserved.</span>
        <span>
  DESIGNED & POWERED BY{' '}
  <a
    href="https://sparklance-solutions.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gold-400/70 hover:text-gold-400 transition-colors"
  >
    SPARKLANCE SOLUTIONS
  </a>
</span>
      </div>
    </footer>
  );
};

// ==========================================================================
// MAIN APP ENTRY
// ==========================================================================
function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Refresh ScrollTrigger after preloader unmounts to ensure accurate bounding boxes
  useEffect(() => {
    if (preloaderDone) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [preloaderDone]);

  return (
    <>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      
      {/* 
        Website Content
        Rendered immediately but hidden initially to allow DOM paint and GSAP prep.
        Opacity transitions elegantly once the preloader sequence drops.
      */}
      <div className={`transition-opacity duration-1000 ease-in-out ${preloaderDone ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <div className="website-grain"></div>
        <Navbar isReady={preloaderDone} />
        <main>
          <Hero isReady={preloaderDone} />
          <OurFilms isReady={preloaderDone} />
          <DirectorsBoard isReady={preloaderDone} />
          <Showreel isReady={preloaderDone} />
          <Gallery isReady={preloaderDone} />
          <AboutUs isReady={preloaderDone} />
          <ContactSection isReady={preloaderDone} />
        </main>
        <Footer isReady={preloaderDone} />
      </div>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
