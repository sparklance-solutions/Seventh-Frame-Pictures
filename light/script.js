/**
 * SEVENTH FRAME PICTURES - Core Application Logic
 * Cleaned and optimized for mobile performance.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. AUTHENTIC VINTAGE 35MM FILM LEADER PRELOADER
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    
    // Check for reduced motion preference to speed up the preloader if requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stageDuration = prefersReducedMotion ? 50 : 1000;
    
    const stages = [
        document.getElementById('pl-stage-3'),
        document.getElementById('pl-stage-2'),
        document.getElementById('pl-stage-1'),
        document.getElementById('pl-stage-lights'),
        document.getElementById('pl-stage-camera'),
        document.getElementById('pl-stage-action')
    ];
    
    const clapperBox = document.getElementById('clapper-box');
    const flash = document.getElementById('pl-flash');
    const preloader = document.getElementById('preloader');

    // Filter out null stages just in case HTML structure changes slightly
    const validStages = stages.filter(stage => stage !== null);

    if (preloader && validStages.length > 0) {
        for (let i = 0; i < validStages.length; i++) {
            if (i > 0) validStages[i-1].classList.remove('active');
            validStages[i].classList.add('active');
            
            // Trigger clapper close on final stage
            if (i === validStages.length - 1 && clapperBox) {
                await sleep(prefersReducedMotion ? 0 : 700);
                clapperBox.classList.add('clap-close');
            }

            if (i === validStages.length - 1) {
                await sleep(prefersReducedMotion ? 0 : 250);
                if (flash) flash.classList.add('flash-active');
                await sleep(prefersReducedMotion ? 0 : 250);
            } else {
                await sleep(stageDuration);
            }
        }

        preloader.classList.add('exiting');
        setTimeout(() => { 
            preloader.style.display = 'none'; 
            document.body.style.overflow = ''; // Ensure scrolling is re-enabled if locked
        }, 600);
    }

    // 2. HEADER BACKGROUND TRANSITION
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 3. FULLSCREEN EDITORIAL MENU OVERLAY (MOBILE/DESKTOP)
    const menuTrigger = document.getElementById('menu-trigger');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuTrigger && menuOverlay) {
        menuTrigger.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling on mobile
        });
    }

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

    document.querySelectorAll('.menu-close-trigger').forEach(el => {
        el.addEventListener('click', closeMenu);
    });

    // 4. FILM DETAIL FULLSCREEN MODALS LOGIC
    const modals = document.querySelectorAll('.film-modal');
    const filmTriggers = document.querySelectorAll('.film-detail-trigger');
    const filmClosers = document.querySelectorAll('.film-close-trigger');

    filmTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scrolling
            }
        });
    });

    const closeModals = () => {
        modals.forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    };

    filmClosers.forEach(closer => closer.addEventListener('click', closeModals));
    
    // Accessibility: Allow escaping modals via keyboard
    window.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') {
            closeModals();
            closeMenu();
        }
    });
});
