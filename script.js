/* ==========================================================================
   SEVENTH FRAME PICTURES - GLOBAL UTILITIES
   ========================================================================== */
// This file is strictly for global accessibility and initialization utilities.
// All cinematic GSAP logic resides inside App.jsx using scoped React refs.

console.log("%c✦ SEVENTH FRAME PICTURES ✦", "color: #d4af37; font-size: 16px; font-weight: bold; font-family: serif;");
console.log("Cinematic experience initialized.");

// Global accessibility helper to detect keyboard navigation intent vs mouse
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
    }
});
document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
});
