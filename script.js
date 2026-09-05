/* ==========================================================================
   RELOAD BEHAVIOUR - ENFORCE START FROM TOP BEFORE ANYTHING ELSE
   ========================================================================== */
// This ensures that upon any reload, the browser does not restore scroll position
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);


/* ==========================================================================
   STRICT CINEMATIC PRELOADER CONTROLLER (PRESERVED)
   ========================================================================== */

// Immediately lock scrolling globally before anything renders
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
            
            // Trigger animations in the Hero section after preloader finishes
            triggerVisibleAnimations();
            
        }, 600);
    }

    // Initialize exactly once
    executeCinematicPreloader();
});


/* ==========================================================================
   WEBSITE INTERACTIONS & CINEMATIC SCROLL ANIMATIONS
   ========================================================================== */

// Navbar dynamic styling on scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.classList.add('bg-[#050505]/95', 'border-gold-400/30');
        nav.classList.remove('bg-[#050505]/90', 'border-gold-400/10');
    } else {
        nav.classList.add('bg-[#050505]/90', 'border-gold-400/10');
        nav.classList.remove('bg-[#050505]/95', 'border-gold-400/30');
    }
});

// Intersection Observer for Cinematic Scroll Animations
const animationSelectors = [
    '.anim-fade-up', 
    '.anim-slide-right', 
    '.anim-slide-left', 
    '.anim-scale-up', 
    '.anim-staggered-item',
    '.anim-line-sweep'
].join(',');

const observerOptions = {
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: '0px 0px -10% 0px' // Slight offset to trigger just as it enters
};

const cinematicObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve to play animation only once
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Setup observer elements once DOM is loaded, but initial check is delayed
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(animationSelectors);
    elementsToAnimate.forEach(el => {
        cinematicObserver.observe(el);
    });
});

// Helper function to force check visibility immediately after preloader finishes
function triggerVisibleAnimations() {
    const elementsToAnimate = document.querySelectorAll(animationSelectors);
    elementsToAnimate.forEach(el => {
        const rect = el.getBoundingClientRect();
        // If element is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('active');
            cinematicObserver.unobserve(el);
        }
    });
}

// Mobile menu toggle logic
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu) {
        menu.classList.toggle('hidden');
        if(menu.classList.contains('hidden')){
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        }
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
