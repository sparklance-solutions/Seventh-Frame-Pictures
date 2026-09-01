/**
 * Seventh Frame Pictures - Cinematic Interaction Logic
 * Written in Vanilla JavaScript. No external libraries.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ACCESSIBILITY: REDUCED MOTION CHECK ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. CINEMATIC PRELOADER ---
    const preloader = document.getElementById('preloader');
    const frameCounter = document.getElementById('frame-counter');
    const progressLine = document.getElementById('progress-line');
    
    let currentFrame = 1;
    const maxFrames = 24; // Standard cinematic frame rate
    const loadDuration = 2000; // ~2 seconds total loading
    const intervalTime = loadDuration / maxFrames;
    
    if (!prefersReducedMotion) {
        const frameInterval = setInterval(() => {
            currentFrame++;
            // Pad frame number: 001, 002...
            const frameString = currentFrame.toString().padStart(3, '0');
            frameCounter.textContent = `LOADING FRAME ${frameString}`;
            
            // Progress bar width
            const progress = (currentFrame / maxFrames) * 100;
            progressLine.style.width = `${progress}%`;
            
            if (currentFrame >= maxFrames) {
                clearInterval(frameInterval);
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    // Initial reveal for hero items after preloader finishes
                    triggerScrollReveals();
                }, 300); // Small pause at 100%
            }
        }, intervalTime);
    } else {
        // Fast exit for reduced motion
        preloader.style.display = 'none';
        triggerScrollReveals();
    }


    // --- 2. HEADER SCROLL STATE ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNav();
    }, { passive: true });


    // --- 3. MOBILE MENU ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        mobileBtn.classList.toggle('open', isMenuOpen);
        mobileMenu.classList.toggle('active', isMenuOpen);
        
        // Lock/Unlock body scroll
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    mobileBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });


    // --- 4. CINEMATIC SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion) {
                    entry.target.classList.add('active');
                } else {
                    // Instantly show for reduced motion
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'none';
                    entry.target.style.clipPath = 'none';
                }
                // Optional: Unobserve after revealing to keep it revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    function triggerScrollReveals() {
        revealElements.forEach(el => revealObserver.observe(el));
    }
    
    // Fallback if preloader logic is skipped
    if(prefersReducedMotion) triggerScrollReveals();


    // --- 5. SMOOTH NAVIGATION & SCENE TRANSITION ---
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sceneTransition = document.getElementById('scene-transition');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection && !prefersReducedMotion) {
                    // Fire Cinematic Transition
                    sceneTransition.classList.add('active');
                    
                    setTimeout(() => {
                        // Scroll while overlay is active
                        targetSection.scrollIntoView({ behavior: 'auto' });
                        
                        // Retract overlay
                        setTimeout(() => {
                            sceneTransition.classList.remove('active');
                        }, 600); // Wait for scroll + small visual pause
                        
                    }, 400); // Wait for overlay line to draw
                } else if (targetSection) {
                    // Normal smooth scroll
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Active Nav State based on Scroll Position
    function updateActiveNav() {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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


    // --- 6. MODALS LOGIC (Productions & Showreel) ---
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const closeTriggers = document.querySelectorAll('.modal-close-trigger');
    const modals = document.querySelectorAll('.modal');
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Scroll lock
        }
    }

    function closeModal() {
        modals.forEach(m => m.classList.remove('active'));
        // Only unlock if mobile menu isn't also open
        if (!isMenuOpen) {
            document.body.style.overflow = '';
        }
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            openModal(targetId);
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
        if (galleryItems.length === 0) return;
        
        // Loop bounds
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        
        currentGalleryIndex = index;
        
        // Clone the abstract art HTML from the grid to the lightbox
        const sourceArt = galleryItems[index].querySelector('.gallery-art');
        if (sourceArt) {
            lightboxContent.innerHTML = ''; // clear
            const clonedArt = sourceArt.cloneNode(true);
            lightboxContent.appendChild(clonedArt);
        }
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
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
        // Escape closes any open modal or menu
        if (e.key === 'Escape') {
            closeModal();
            if (isMenuOpen) toggleMenu();
        }
        
        // Arrow keys for lightbox if it's active
        const lightboxModal = document.getElementById('modal-gallery');
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                renderLightboxImage(currentGalleryIndex - 1);
            } else if (e.key === 'ArrowRight') {
                renderLightboxImage(currentGalleryIndex + 1);
            }
        }
    });

});
