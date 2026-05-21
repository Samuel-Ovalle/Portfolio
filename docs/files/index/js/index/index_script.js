/**
 * @file index_script.js
 * @description Main entry point for the index page.
 *
 * Bootstraps all page modules on load, manages the responsive breakpoint,
 * and controls the mobile navigation toggle.
 */

import { initApollo }    from './index_apollo.js';
import { addStack }      from './index_stack_dev.js';
import { runSequential } from './index_encoder_text.js';
import { initProjects }  from './index_projects.js';

// ─── Responsive State ─────────────────────────────────────────────────────────

/** True when the viewport is taller than it is wide (portrait / mobile). */
const isPortrait = () => window.innerHeight > window.innerWidth;

let isResponsive = isPortrait();

// ─── Bootstrap ────────────────────────────────────────────────────────────────

addStack();
runSequential();
initProjects();
initApollo(isResponsive);

// ─── Resize Handler ───────────────────────────────────────────────────────────

/**
 * Re-evaluates the responsive breakpoint on resize.
 * Calls initApollo only when the portrait/landscape mode actually changes,
 * avoiding unnecessary listener re-registration on every resize event.
 */
window.addEventListener('resize', () => {
    const currentMode = isPortrait();
    if (isResponsive === currentMode) return;
    isResponsive = currentMode;
    initApollo(isResponsive);
});

// ─── Mobile Nav ───────────────────────────────────────────────────────────────

const mobileNavBtn = document.getElementById('mobileNav');
const navList      = document.getElementById('navList');

let isNavOpen = false;

/**
 * Toggles the mobile nav visibility and button rotation.
 * @param {boolean} open - True to close the nav, false to open it.
 */
function toggleNav(open) {
    navList.style.bottom         = open ? '32vh' : '0vh';
    mobileNavBtn.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)';
}

/** Opens/closes the nav on hamburger button click. */
mobileNavBtn.addEventListener('click', () => {
    isNavOpen = !isNavOpen;
    toggleNav(isNavOpen);    
});

/** Closes the nav when any nav link is clicked. */
document.querySelectorAll('.navOption').forEach(link =>
    link.addEventListener('click', () => {
        isNavOpen = false;
        toggleNav(true);
        console.log("funciona");
        
    })
);

// ─── Contact Form ─────────────────────────────────────────────────────────────

const FORMSPREE_URL = 'https://formspree.io/f/mrejayak';

const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnIcon   = submitBtn.querySelector('img');

/** Shared styles applied to the submit button after any submission attempt. */
const BTN_BASE_STYLE = { color: 'var(--text-color-1)' };

const BTN_STATE = {
    success: { text: 'Message sent!', bg: '#086207' },
    error:   { text: 'Error',         bg: '#CD0D0D' },
};

/**
 * Updates the submit button to reflect the result of a form submission.
 * Hides the button icon and applies the appropriate color and label.
 * @param {'success'|'error'} state
 */
function setButtonState(state) {
    const { text, bg }           = BTN_STATE[state];
    submitBtn.textContent        = text;
    submitBtn.style.backgroundColor = bg;
    submitBtn.style.color        = BTN_BASE_STYLE.color;
    if (btnIcon) btnIcon.style.display = 'none';
}

/**
 * Handles contact form submission.
 * Serializes form fields to JSON, POSTs to Formspree, and updates
 * the submit button to reflect success or failure.
 * @param {SubmitEvent} e
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    try {
        const res = await fetch(FORMSPREE_URL, {
            method:  'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body:    JSON.stringify(data),
        });

        if (res.ok) form.reset();
        setButtonState(res.ok ? 'success' : 'error');

    } catch (err) {
        console.error('Form submission failed:', err);
        setButtonState('error');
    }
}

form.addEventListener('submit', handleFormSubmit);

// ─── CV Language Selector ─────────────────────────────────────────────────────

const CV_FILES = {
    en: 'assets/files_to_download/English_H.V._Samuel_O.pdf',
    es: 'assets/files_to_download/H.V._Samuel_O.pdf',
};

/**
 * Returns true if the browser's primary language is English.
 * Falls back through navigator.languages, navigator.language,
 * and navigator.userLanguage before defaulting to an empty string.
 * @returns {boolean}
 */
const isBrowserEnglish = () =>
    (navigator.languages?.[0] ?? navigator.language ?? navigator.userLanguage ?? '')
    .toLowerCase()
    .startsWith('en');

/** Points the CV anchor to the English or Spanish file based on browser language. */
document.getElementById('cv').href = isBrowserEnglish() ? CV_FILES.en : CV_FILES.es;