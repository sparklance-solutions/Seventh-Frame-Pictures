/**
 * Seventh Frame Pictures - Cinematic Interaction Logic
 * STRICT FAILSAFE EDITION: Guarantees content visibility even if animations fail.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Safety flag for CSS animations
    document.body.classList.add('js-ready');
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. CINEMATIC PRELOADER & FAILSAFE ---
    const preloader = document.getElementById('preloader');
    const frameCounter = document.getElementById('frame-counter');
    const progressLine = document.getElementById('progress-line');
    
    let currentFrame = 1;
    const maxFrames = 24; 
    const loadDuration = 1800; // ~1.8 seconds total loading
    const intervalTime = loadDuration / maxFrames;
    let preloaderFinished = false;
    
    // Function to forcefully reveal hero and allow regular scrolling
    function triggerHeroReveal() {
        if(preloaderFinished) return;
        preloaderFinished = true;
        
        if(preloader) {
            preloader.classList.add('loaded');
            setTimeout(() => { if(preloader) preloader.style.display = 'none'; }, 800);
        }
        
        // Immediately make hero content visible without waiting for scroll
        const heroContent = document.getElementById('hero-content');
        if(heroContent) heroContent.classList.add('active');
        
        // Start observing other elements
        triggerScrollReveals();
    }

    // Absolute failsafe timeout (in case interval breaks)
    const failsafeTimeout = setTimeout(() => {
        document.body.classList.add('failsafe-triggered'); // Forces CSS to unhide everything
        triggerHeroReveal();
    }, 3000);

    // Normal Preloader Execution
    if (!prefersReducedMotion && preloader && frameCounter && progressLine) {
        const frameInterval = setInterval(() => {
            currentFrame++;
            const frameString = currentFrame.toString().padStart(3, '0');
            frameCounter.textContent = `LOADING FRAME ${frameString}`;
            
            const progress = (currentFrame / maxFrames) * 100;
            progressLine.style.width = `${progress}%`;
            
            if (currentFrame >= maxFrames) {
                clearInterval(frameInterval);
                clearTimeout(failsafeTimeout);
                setTimeout(triggerHeroReveal, 200);
            }
        }, intervalTime);
    } else {
        // Fast exit for reduced motion or missing elements
        clearTimeout(failsafeTimeout);
        triggerHeroReveal();
    }


    // --- 2. HEADER SCROLL STATE ---
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
        updateActiveNav();
    }, { passive: true });

    function updateActiveNav() {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjustment for header height
            if (scrollY >= (sectionTop - 250)) {
                current = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    }


    // --- 3. MOBILE MENU ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    function toggleMenu() {
        if(!mobileBtn || !mobileMenu) return;
        isMenuOpen = !isMenuOpen;
        mobileBtn.classList.toggle('open', isMenuOpen);
        mobileMenu.classList.toggle('active', isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    if(mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });


    // --- 4. CINEMATIC SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal');
    let revealObserver;
    
    function triggerScrollReveals() {
        if (prefersReducedMotion || !window.IntersectionObserver) {
            document.body.classList.add('failsafe-triggered'); // Forces CSS to unhide everything safely
            return;
        }

        revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        revealElements.forEach(el => revealObserver.observe(el));
    }


    // --- 5. SMOOTH NAVIGATION & SCENE TRANSITION ---
    const sceneTransition = document.getElementById('scene-transition');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection && sceneTransition && !prefersReducedMotion) {
                    sceneTransition.classList.add('active');
                    
                    setTimeout(() => {
                        targetSection.scrollIntoView({ behavior: 'auto' });
                        setTimeout(() => sceneTransition.classList.remove('active'), 500); 
                    }, 400); 
                } else if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    // --- 6. MODALS LOGIC (Productions & Showreel) ---
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeTriggers = document.querySelectorAll('.modal-close-trigger');
    const modals = document.querySelectorAll('.modal');
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        modals.forEach(m => m.classList.remove('active'));
        if (!isMenuOpen) document.body.style.overflow = '';
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            if(targetId) openModal(targetId);
        });
    });

    closeTriggers.forEach(trigger => {
        trigger.addEventListener('click', closeModal);
    });


    // --- 7. GALLERY LIGHTBOX ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxContent = document.getElementById('lightbox-content');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');
    let currentGalleryIndex = 0;

    function renderLightboxImage(index) {
        if (galleryItems.length === 0 || !lightboxContent) return;
        
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        currentGalleryIndex = index;
        
        const sourceArt = galleryItems[index].querySelector('.gallery-art');
        if (sourceArt) {
            lightboxContent.innerHTML = '';
            const clonedArt = sourceArt.cloneNode(true);
            lightboxContent.appendChild(clonedArt);
        }
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index') || "0");
            renderLightboxImage(index);
            openModal('modal-gallery');
        });
    });

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => renderLightboxImage(currentGalleryIndex - 1));
        btnNext.addEventListener('click', () => renderLightboxImage(currentGalleryIndex + 1));
    }


    // --- 8. GLOBAL KEYBOARD ACCESSIBILITY (ESC & ARROWS) ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (isMenuOpen) toggleMenu();
        }
        
        const lightboxModal = document.getElementById('modal-gallery');
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') renderLightboxImage(currentGalleryIndex - 1);
            else if (e.key === 'ArrowRight') renderLightboxImage(currentGalleryIndex + 1);
        }
    });

});
