/* ==========================================================================
   SEVENTH FRAME PICTURES - GLOBAL UTILITIES
   ========================================================================== */
// This file is preserved per strict structural requirements.
// The core Preloader functionality and GSAP logic has been elegantly ported 
// into App.jsx using React hooks to prevent DOM manipulation conflicts.

console.log("%c✦ SEVENTH FRAME PICTURES ✦", "color: #d4af37; font-size: 16px; font-weight: bold; font-family: serif;");
console.log("Cinematic experience initialized.");

// Global accessibility helper to detect keyboard navigation intent
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
    }
});
document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
});
