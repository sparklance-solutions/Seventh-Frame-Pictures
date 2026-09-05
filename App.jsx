import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// DATA & ASSETS
// ==========================================================================
const galleryImages = [
  "/images/projector.webp",
  "/images/chair.webp",
  "/images/camera.webp"
];

const staggerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  })
};

// ==========================================================================
// PRELOADER
// ==========================================================================
const Preloader = ({ onComplete }) => {
  const [activeStage, setActiveStage] = useState(null);
  const [flash, setFlash] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const triggerJump = useRef(0); // Used to re-trigger mechanical jump

  useEffect(() => {
    // Lock scrolling
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const runSequence = async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const stages = ['stage-3', 'stage-2', 'stage-1', 'stage-lights', 'stage-camera', 'stage-action'];
      
      for (let i = 0; i < stages.length; i++) {
        setActiveStage(stages[i]);
        triggerJump.current += 1; // Force reflow equivalent in React
        
        if (i === stages.length - 1) {
          // Final Action stage timing
          await sleep(900);
          if (!isReducedMotion) setFlash(true);
          await sleep(100);
        } else {
          await sleep(isReducedMotion ? 100 : 1000);
        }
      }

      setExiting(true);
      await sleep(600); // Wait for shutter exit css transition

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
      
      {/* Registration Marks */}
      <div className="pl-borders">
          <div className="pl-reg-mark pl-reg-tl"></div><div className="pl-reg-mark pl-reg-tr"></div>
          <div className="pl-reg-mark pl-reg-bl"></div><div class="pl-reg-mark pl-reg-br"></div>
      </div>

      {/* Stage 3 */}
      <div className={`pl-stage ${activeStage === 'stage-3' ? 'active' : ''}`}>
          <div key={`jump-3-${triggerJump.current}`} className="pl-cd-frame frame-jump">
              <div className="pl-cd-ring"></div><div className="pl-cd-ring-inner"></div>
              <div className="pl-cd-cross-h"></div><div className="pl-cd-cross-v"></div>
              <span className="pl-cd-num">3</span>
              <span className="pl-cd-meta" style={{ top: '10%' }}>SEVENTH FRAME</span>
          </div>
      </div>

      {/* Stage 2 */}
      <div className={`pl-stage ${activeStage === 'stage-2' ? 'active' : ''}`}>
          <div key={`jump-2-${triggerJump.current}`} className="pl-cd-frame frame-jump">
              <div className="pl-cd-ring" style={{ transform: 'rotate(45deg)' }}></div><div className="pl-cd-ring-inner"></div>
              <div className="pl-cd-cross-h" style={{ top: '48%' }}></div><div className="pl-cd-cross-v"></div>
              <span className="pl-cd-num">2</span>
              <span className="pl-cd-meta" style={{ bottom: '10%' }}>PICTURES</span>
          </div>
      </div>

      {/* Stage 1 */}
      <div className={`pl-stage ${activeStage === 'stage-1' ? 'active' : ''}`}>
          <div key={`jump-1-${triggerJump.current}`} className="pl-cd-frame frame-jump">
              <div className="pl-cd-ring" style={{ transform: 'rotate(90deg)' }}></div><div className="pl-cd-ring-inner"></div>
              <div className="pl-cd-cross-h"></div><div className="pl-cd-cross-v" style={{ left: '52%' }}></div>
              <span className="pl-cd-num">1</span>
              <span className="pl-cd-meta" style={{ left: '10%', transform: 'rotate(-90deg)' }}>SCENE 001</span>
          </div>
      </div>

      {/* Stage Lights */}
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

      {/* Stage Camera */}
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

      {/* Stage Action */}
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

      {/* Flash */}
      <div className={`pl-flash ${flash ? 'flash-trigger' : ''}`}></div>

      {/* Shutter */}
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
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${scrolled ? 'bg-[#050505]/95 backdrop-blur-md border-gold-400/20 shadow-lg' : 'bg-transparent border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center space-x-3 group outline-none">
          <div className="w-10 h-10 rounded-full border border-gold-400 flex items-center justify-center text-gold-400 font-cinzel font-bold text-base group-hover:bg-gold-400 group-hover:text-black transition duration-300">
            <img src="/images/logo.webp" alt="Logo" className="w-6 h-6 object-contain hidden" /> {/* Hidden for visual fallback but preserved */}
            SF
          </div>
          <div>
            <span className="font-cinzel text-base md:text-lg font-bold tracking-widest gold-gradient-text block">SEVENTH FRAME</span>
            <span className="text-[8px] tracking-[0.3em] text-gray-400 uppercase block">PICTURES LLP.</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center space-x-8 font-cinzel text-xs tracking-[0.2em] text-gray-300">
          {['OUR FILMS', 'DIRECTORS BOARD', 'SHOWREEL', 'GALLERY', 'ABOUT US', 'PARTNER WITH US', 'CONTACT US'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-gold-400 transition outline-none focus:text-gold-400">
              {item}
            </a>
          ))}
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-gold-400 text-xl focus:outline-none p-2">
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#0a0a0a] border-b border-gold-400/20 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col space-y-4 font-cinzel text-xs tracking-[0.2em]">
              {['OUR FILMS', 'DIRECTORS BOARD', 'SHOWREEL', 'GALLERY', 'ABOUT US', 'PARTNER WITH US', 'CONTACT US'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`} 
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 hover:text-gold-400 transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// ==========================================================================
// HERO
// ==========================================================================
const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      <motion.div style={{ y: yParallax, opacity: opacityFade }} className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/projector.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/40 backdrop-blur-[2px]"></div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        <motion.div 
          custom={1} initial="hidden" animate="visible" variants={staggerVariants}
          className="inline-block px-4 py-1.5 border border-gold-400/50 rounded-full bg-gold-400/10 text-gold-300 font-cinzel text-xs tracking-[0.3em] uppercase mb-6 backdrop-blur-sm shadow-lg shadow-gold-400/10"
        >
          ✦ INDEPENDENT CINEMATIC PRODUCTIONS ✦
        </motion.div>
        
        <motion.h1 
          custom={2} initial="hidden" animate="visible" variants={staggerVariants}
          className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black tracking-wider text-white mb-6 uppercase drop-shadow-2xl"
        >
          SEVENTH FRAME <span className="gold-gradient-text block mt-2">PICTURES</span>
        </motion.h1>
        
        <motion.p 
          custom={3} initial="hidden" animate="visible" variants={staggerVariants}
          className="font-sans font-light text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Dedicated to crafting visually striking narratives and high-quality motion pictures for the modern cinematic landscape.
        </motion.p>
        
        <motion.div custom={4} initial="hidden" animate="visible" variants={staggerVariants} className="flex gap-4">
          <a href="#our-films" className="px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-400 text-black font-cinzel font-bold text-xs tracking-[0.25em] rounded shadow-xl hover:brightness-110 transition duration-300">
            VIEW SLATE
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================================================
// OUR FILMS
// ==========================================================================
const OurFilms = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.film-card', 
      { y: 50, opacity: 0, clipPath: 'inset(10% 0% 10% 0%)' },
      { 
        y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', 
        duration: 1.2, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%"
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="our-films" ref={sectionRef} className="py-24 bg-[#080808] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 border-b border-gold-400/20 pb-10">
          <span className="text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase">Current Slate</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mt-2">PRODUCTION PROJECTS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Film 1 */}
          <div className="film-card group relative bg-[#0f0f0f] rounded-sm overflow-hidden border border-gold-400/20 transition-all duration-500">
            <div className="relative h-[480px] overflow-hidden bg-black">
              <motion.div 
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full bg-cover bg-center opacity-70 group-hover:opacity-100"
                style={{ backgroundImage: 'url(/images/camera.webp)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-90"></div>
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-gold-400/50 text-gold-300 text-[10px] font-cinzel px-2.5 py-1 rounded">
                IN DEVELOPMENT
              </div>
            </div>
            <div className="p-8 relative -mt-20 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent">
              <div className="text-xs text-gold-400 font-cinzel tracking-widest mb-2">Feature Film</div>
              <h3 className="font-cinzel text-2xl font-bold text-white mb-3 group-hover:text-gold-400 transition">PRODUCTION NO. 1</h3>
              <button className="w-full mt-4 py-3 border border-gold-400/60 text-gold-300 font-cinzel text-xs tracking-widest rounded hover:bg-gold-400 hover:text-black transition duration-300">
                DETAILS PENDING
              </button>
            </div>
          </div>

          {/* Film 2 */}
          <div className="film-card group relative bg-[#0f0f0f] rounded-sm overflow-hidden border border-gold-400/20 transition-all duration-500">
            <div className="relative h-[480px] overflow-hidden bg-black">
              <motion.div 
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full bg-cover bg-center opacity-70 group-hover:opacity-100"
                style={{ backgroundImage: 'url(/images/projector.webp)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-90"></div>
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-gold-400/50 text-gold-300 text-[10px] font-cinzel px-2.5 py-1 rounded">
                EARLY STAGES
              </div>
            </div>
            <div className="p-8 relative -mt-20 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent">
              <div className="text-xs text-gold-400 font-cinzel tracking-widest mb-2">Documentary Feature</div>
              <h3 className="font-cinzel text-2xl font-bold text-white mb-3 group-hover:text-gold-400 transition">PRODUCTION NO. 2</h3>
              <button className="w-full mt-4 py-3 border border-gold-400/60 text-gold-300 font-cinzel text-xs tracking-widest rounded hover:bg-gold-400 hover:text-black transition duration-300">
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
const DirectorsBoard = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from('.director-card', {
      opacity: 0, scale: 0.95, duration: 1, stagger: 0.15,
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
    });
  }, { scope: sectionRef });

  return (
    <section id="directors-board" ref={sectionRef} className="py-24 bg-[#050505] border-t border-b border-gold-400/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase">Creative Vision</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mt-2">DIRECTORS BOARD</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="director-card bg-[#0f0f0f] p-8 rounded-sm border border-gold-400/30 text-center group hover:border-gold-400 transition duration-500">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#1a1a1a] border border-gold-400/50 flex items-center justify-center mb-6 overflow-hidden">
                 <i className="fa-solid fa-user text-gray-500 text-2xl"></i>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition">DIRECTOR 0{num}</h3>
              <p className="text-gold-400/70 text-xs font-cinzel tracking-widest mb-4">INDEPENDENT FILMMAKER</p>
              <div className="h-px w-12 bg-gold-400/30 mx-auto group-hover:w-full transition-all duration-500"></div>
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
const Showreel = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="showreel" className="py-24 bg-[#080808]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase">Visual Library</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mt-2">SHOWREEL</h2>
        </div>

        <div className="relative bg-black rounded-sm border border-gold-400/30 overflow-hidden shadow-2xl group aspect-video">
          {/* Using a placeholder HTML5 video. Replace src when actual showreel is provided */}
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="/images/camera.webp"
            onEnded={() => setIsPlaying(false)}
            playsInline
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support HTML video.
          </video>
          
          <AnimatePresence>
            {!isPlaying && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
              >
                <div className="w-20 h-20 rounded-full border-2 border-gold-400 bg-black/50 text-gold-400 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-110 hover:bg-gold-400 hover:text-black transition-all duration-300">
                  <i className="fa-solid fa-play ml-1"></i>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimal Controls while playing */}
          {isPlaying && (
            <div 
              className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-4 py-2 text-gold-400 border border-gold-400/50 text-xs font-cinzel tracking-widest cursor-pointer hover:bg-gold-400 hover:text-black transition rounded"
              onClick={togglePlay}
            >
              PAUSE
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// GALLERY & GALLERY VIEWER
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

      {/* Touch Areas for mobile */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-0 sm:hidden" onClick={onPrev}></div>
      <div className="absolute inset-y-0 right-0 w-1/4 z-0 sm:hidden" onClick={onNext}></div>

      <div className="w-full h-full p-4 md:p-20 flex items-center justify-center relative overflow-hidden pointer-events-none">
        <AnimatePresence mode='wait'>
          <motion.img 
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-full max-h-full object-contain border border-gold-400/20 shadow-2xl"
          />
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 font-cinzel text-gold-400 text-xs tracking-widest">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
};

const Gallery = () => {
  const [viewerIndex, setViewerIndex] = useState(null);

  const openViewer = (index) => setViewerIndex(index);
  const closeViewer = () => setViewerIndex(null);
  const nextImage = () => setViewerIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setViewerIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <section id="gallery" className="py-24 bg-[#050505] border-t border-gold-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase">Behind The Scenes</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mt-2">GALLERY</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((src, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 0.98 }}
              className="relative aspect-square overflow-hidden cursor-pointer border border-gold-400/20 group bg-[#0a0a0a]"
              onClick={() => openViewer(idx)}
            >
              <img 
                src={src} 
                alt={`Gallery image ${idx + 1}`} 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <i className="fa-solid fa-expand text-gold-400 text-2xl drop-shadow-md"></i>
              </div>
            </motion.div>
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
const AboutUs = () => {
  const textRef = useRef(null);

  useGSAP(() => {
    gsap.from(textRef.current.children, {
      y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out",
      scrollTrigger: { trigger: textRef.current, start: "top 80%" }
    });
  }, { scope: textRef });

  return (
    <section id="about-us" className="py-24 bg-[#080808] border-t border-gold-400/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef}>
            <span className="text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase block mb-2">Company Profile</span>
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-8">ABOUT US</h2>
            <p className="font-sans font-light text-gray-300 text-base leading-relaxed mb-6">
              Seventh Frame Pictures LLP is an independent production company dedicated to the art of modern filmmaking. We collaborate with passionate storytellers and technical craftsmen to bring compelling narratives to life.
            </p>
            <p className="font-sans font-light text-gray-300 text-base leading-relaxed mb-8">
              Based in Kochi, Kerala, our studio integrates traditional cinematic values with contemporary production methodologies to produce content that resonates with modern audiences.
            </p>
            <div className="h-px w-full bg-gradient-to-r from-gold-400/50 to-transparent"></div>
          </div>
          <div className="relative group">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2 }}
              className="relative bg-black p-2 rounded-sm border border-gold-400/20"
            >
              <img src="/images/chair.webp" alt="Director Chair" className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition duration-1000" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// PARTNER WITH US
// ==========================================================================
const PartnerWithUs = () => {
  return (
    <section id="partner-with-us" className="py-32 bg-[#050505] relative border-t border-gold-400/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <i className="fa-solid fa-handshake text-gold-400 text-4xl mb-6 opacity-50"></i>
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-6">PARTNER WITH US</h2>
          <p className="font-sans font-light text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            We are actively exploring co-production opportunities, strategic alliances, and distribution partnerships for our upcoming theatrical features.
          </p>
          <a href="#contact-us" className="inline-block px-8 py-4 border border-gold-400/60 text-gold-300 font-cinzel text-xs tracking-widest rounded hover:bg-gold-400 hover:text-black transition duration-300">
            INITIATE DIALOGUE
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================================================
// CONTACT US
// ==========================================================================
const ContactUs = () => {
  return (
    <section id="contact-us" className="py-24 bg-[#080808] border-t border-gold-400/20 relative overflow-hidden">
      {/* Cinematic subtle background for contact */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/projector.webp')] bg-cover bg-center mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold-400 font-cinzel text-xs tracking-[0.3em] uppercase">Final Scene</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mt-2">CONTACT US</h2>
        </div>

        <div className="max-w-2xl mx-auto bg-[#0a0a0a] p-8 md:p-12 border border-gold-400/20 rounded-sm shadow-2xl">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-gray-700 py-3 text-white font-cinzel text-sm focus:outline-none focus:border-gold-400 transition" />
              </div>
              <div className="relative group">
                <input type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-gray-700 py-3 text-white font-cinzel text-sm focus:outline-none focus:border-gold-400 transition" />
              </div>
            </div>
            <div className="relative group">
              <input type="text" placeholder="SUBJECT" className="w-full bg-transparent border-b border-gray-700 py-3 text-white font-cinzel text-sm focus:outline-none focus:border-gold-400 transition" />
            </div>
            <div className="relative group">
              <textarea placeholder="MESSAGE" rows="4" className="w-full bg-transparent border-b border-gray-700 py-3 text-white font-cinzel text-sm focus:outline-none focus:border-gold-400 transition resize-none"></textarea>
            </div>
            <button className="w-full py-4 bg-gold-400 text-black font-cinzel font-bold text-xs tracking-[0.3em] hover:bg-gold-300 transition duration-300 uppercase">
              Transmit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// FOOTER
// ==========================================================================
const Footer = () => {
  return (
    <footer className="bg-[#020202] border-t border-gold-400/30 pt-20 pb-8 text-gray-400 font-cinzel relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <img src="/images/logo.webp" alt="Logo" className="w-10 h-10 object-contain" />
            <span className="font-cinzel text-lg font-bold gold-gradient-text tracking-widest">SEVENTH FRAME</span>
          </div>
          <p className="font-sans font-light text-gray-500 text-xs leading-relaxed max-w-sm">
            Independent production house delivering striking visual narratives and professional cinematic content.
          </p>
        </div>
        <div>
          <h4 className="text-gold-400 tracking-widest mb-6 font-bold uppercase text-sm">Navigation</h4>
          <ul className="space-y-3 text-xs tracking-widest">
            <li><a href="#our-films" className="hover:text-white transition">PRODUCTIONS</a></li>
            <li><a href="#directors-board" className="hover:text-white transition">DIRECTORS</a></li>
            <li><a href="#showreel" className="hover:text-white transition">SHOWREEL</a></li>
            <li><a href="#about-us" className="hover:text-white transition">ABOUT STUDIO</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold-400 tracking-widest mb-6 font-bold uppercase text-sm">Headquarters</h4>
          <p className="text-gray-500 mb-6 leading-relaxed font-sans font-light text-sm">
            Seventh Frame Pictures LLP<br />
            Kochi, Kerala, India
          </p>
          <div className="flex space-x-5 text-gold-400 text-lg">
            <a href="#" className="hover:text-white transition"><i className="fa-brands fa-youtube"></i></a>
            <a href="#" className="hover:text-white transition"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-white transition"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-widest uppercase">
        <span>&copy; {new Date().getFullYear()} Seventh Frame Pictures LLP. All Rights Reserved.</span>
        <span>DESIGNED & POWERED BY <span className="text-gold-400">SPARKLANCE SOLUTIONS</span></span>
      </div>
    </footer>
  );
};

// ==========================================================================
// MAIN APP ENTRY
// ==========================================================================
function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      
      {/* Website Content - Rendered immediately but visually revealed after preloader */}
      <div className={`transition-opacity duration-1000 ${preloaderDone ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <div className="website-grain"></div>
        <Navbar />
        <main>
          <Hero />
          <OurFilms />
          <DirectorsBoard />
          <Showreel />
          <Gallery />
          <AboutUs />
          <PartnerWithUs />
          <ContactUs />
        </main>
        <Footer />
      </div>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
