/* ==========================================================================
   STRICT CINEMATIC PRELOADER CONTROLLER
   ========================================================================== */

// 1. Immediately lock scrolling globally before anything renders
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

document.addEventListener('DOMContentLoaded', () => {
    // Stage array ensures perfectly deterministic ordering
    const preloaderStages = [
        'stage-3', 
        'stage-2', 
        'stage-1', 
        'stage-lights', 
        'stage-camera', 
        'stage-action'
    ];
    
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // A single, robust controller function executing the logic cleanly
    async function executeCinematicPreloader() {
        const preloader = document.getElementById('preloader');
        const flash = document.getElementById('pl-flash');
        
        // Defensive check: if preloader doesn't exist, just unlock scrolling
        if (!preloader) {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            return;
        }

        // Defensive reset: Force all stages to lose the active class immediately
        preloaderStages.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });

        // The Master Loop
        for (let i = 0; i < preloaderStages.length; i++) {
            
            // Strictly deactivate all stages to prevent overlaps
            preloaderStages.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('active');
            });

            // Activate exactly ONE current stage
            const currentStage = document.getElementById(preloaderStages[i]);
            if (currentStage) {
                currentStage.classList.add('active');
                
                // Re-trigger mechanical film jitter for countdowns & clapper
                if ((i <= 2 || i === 5) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    const innerElement = currentStage.querySelector('.pl-cd-frame, .pl-comp');
                    if (innerElement) {
                        innerElement.classList.remove('frame-jump');
                        void innerElement.offsetWidth; // Force DOM reflow to restart animation
                        innerElement.classList.add('frame-jump');
                    }
                }
            }

            // Timing handling
            if (i === preloaderStages.length - 1) {
                // Final ACTION stage timing
                await sleep(900);
                
                // Trigger pure white flash 
                if (flash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    flash.classList.remove('flash-trigger');
                    void flash.offsetWidth;
                    flash.classList.add('flash-trigger');
                }
                
                await sleep(100); 
            } else {
                // Standard 1000ms delay for every other stage
                // Speed up heavily if user has reduced motion enabled
                const stageDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 1000;
                await sleep(stageDelay);
            }
        }

        // Sequence finishes: Start shutter transition
        preloader.classList.add('exiting');
        
        // Wait 600ms exactly for CSS shutter exit transition to finish
        setTimeout(() => {
            preloader.style.display = 'none';
            // Unlock scrolling gracefully
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }, 600);
    }

    // Initialize exactly once
    executeCinematicPreloader();
});


/* ==========================================================================
   WEBSITE INTERACTIONS (Preserved logic)
   ========================================================================== */

// Hero Slider Carousel
let currentHeroSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');

function setHeroSlide(index) {
    if (!slides.length) return;
    slides.forEach((slide, i) => {
        slide.style.opacity = i === index ? '1' : '0';
    });
    dots.forEach((dot, i) => {
        dot.className = i === index ? 'hero-dot w-3 h-3 rounded-full bg-gold-400 transition' : 'hero-dot w-3 h-3 rounded-full bg-gray-600 transition';
    });
    currentHeroSlide = index;
}

if (slides.length > 0) {
    setInterval(() => {
        currentHeroSlide = (currentHeroSlide + 1) % slides.length;
        setHeroSlide(currentHeroSlide);
    }, 5000);
}

// Navbar blur and dynamic styling on scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.classList.add('bg-black/95', 'shadow-lg');
    } else {
        nav.classList.remove('bg-black/95', 'shadow-lg');
    }
});

// Cinematic Scroll Reveal Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
});

// Mobile menu toggle logic
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Modal controls
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
}