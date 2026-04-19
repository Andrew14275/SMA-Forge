/* ================================================
   SMA FORGE — theme.js
   Prevents flash of wrong theme on page load.
   Must be loaded in <head> BEFORE any CSS renders.
   ================================================ */

(function () {
  // We default to dark — just set it immediately
  // so there's zero flash of light mode on load
  document.documentElement.setAttribute('data-theme', 'dark');
})();