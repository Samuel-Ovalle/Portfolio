/**
 * @file index_apollo.js
 * @description Scroll-driven frame sequence animation.
 *
 * Preloads a set of PNG frames and renders them on a <canvas> element
 * based on the user's scroll progress within the #firstScene wrapper.
 * The result is a video-scrubbing effect synchronized with page scroll.
 */

// ─── DOM References ───────────────────────────────────────────────────────────

const sceneWrapper    = document.getElementById('firstScene');
const modelContainer  = document.getElementById('firstModel');
const canvas          = document.getElementById('frameCanvas');
const ctx             = canvas.getContext('2d');

// ─── Frame Config ─────────────────────────────────────────────────────────────

const TOTAL_FRAMES  = 120;
const FRAME_FOLDER  = 'https://res.cloudinary.com/dvqteoxap/image/upload/';
const BASE_VERSION = 1779317148;
const frameBitmaps  = new Array(TOTAL_FRAMES);

// ─── Animation State ──────────────────────────────────────────────────────────

let isReady        = false;
let activation     = false;
let currentFrame   = 0;
let rafId          = null;
let scrollProgress = 0;

// ─── Slide Config ─────────────────────────────────────────────────────────────

const SLIDE = { startLeft: 25, endLeft: -20, speed: 0.6 };

// ─── Utilities ────────────────────────────────────────────────────────────────
/** Calculates the version offset for a given frame index to create variation in the URLs. */
const getVersionOffset = (index) => Math.floor((index + 2) / 4);

/** Constructs the URL for a given frame index using the base folder, version, and zero-padded index. */
const getFramePath = (index) =>
    `${FRAME_FOLDER}v${BASE_VERSION + getVersionOffset(index)}/${String(index + 1).padStart(4, '0')}.png`;

/** Clamps a value between min and max. */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ─── Rendering ────────────────────────────────────────────────────────────────

/**
 * Draws a single frame bitmap onto the canvas, centered and cover-scaled.
 * @param {number} frameIndex - Index of the frame to draw.
 */
function drawFrame(frameIndex) {
    const bitmap = frameBitmaps[frameIndex];
    if (!bitmap) return;

    const scale      = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
    const drawWidth  = bitmap.width  * scale;
    const drawHeight = bitmap.height * scale;
    const drawX      = (canvas.width  - drawWidth)  / 2;
    const drawY      = (canvas.height - drawHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, drawX, drawY, drawWidth, drawHeight);
}

// ─── Scroll Mapping ───────────────────────────────────────────────────────────

/**
 * Calculates the target frame index based on current scroll position
 * relative to the scene wrapper, and updates {@link scrollProgress}.
 * @returns {number} The target frame index.
 */
function getScrollFrame() {
    const wrapperTop  = sceneWrapper.getBoundingClientRect().top + window.scrollY;
    scrollProgress    = clamp((window.scrollY - wrapperTop) / window.innerHeight, 0, 1);
    return Math.min(Math.floor(scrollProgress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
}

// ─── Layout ───────────────────────────────────────────────────────────────────

/**
 * Slides the scene wrapper horizontally based on scroll progress.
 * Skipped when in responsive mode.
 * @param {boolean} isResponsive
 */
function updateWrapperSlide(isResponsive) {
    if (isResponsive) {
        sceneWrapper.style.left = `0%`;
    }else {
        const easedProgress = clamp(scrollProgress * SLIDE.speed, 0, 1);
        sceneWrapper.style.left = `${SLIDE.startLeft + (SLIDE.endLeft - SLIDE.startLeft) * easedProgress}%`;
    }
}

/**
 * Resizes the canvas to match the model container dimensions
 * and redraws the current frame.
 * @param {boolean} isResponsive
 */
function resizeCanvas(isResponsive) {
    if (!isReady) return;
    canvas.width  = modelContainer.offsetWidth;
    canvas.height = modelContainer.offsetHeight;
    modelContainer.style.opacity = 1;

    drawFrame(getScrollFrame());
    updateWrapperSlide(isResponsive);
}

// ─── Loading ──────────────────────────────────────────────────────────────────

/**
 * Fetches and decodes all frame images in parallel into {@link frameBitmaps}.
 * Sets {@link isReady} to true only if every frame loaded successfully.
 * @param {boolean} isResponsive - Passed to {@link resizeCanvas} on completion.
 */
async function loadFrames(isResponsive) {
    try {
        await Promise.all(
            Array.from({ length: TOTAL_FRAMES }, async (_, i) => {
                const res = await fetch(getFramePath(i));
                if (!res.ok) throw new Error(`Failed frame ${i}: ${res.status}`);
                frameBitmaps[i] = await createImageBitmap(await res.blob());
                if (!frameBitmaps[i]) throw new Error(`Invalid bitmap at frame ${i}`);
            })
        );

        if (!frameBitmaps.every((b) => b instanceof ImageBitmap))
            throw new Error('Some frames were not loaded correctly');

        isReady = true;
        activation = true;
        resizeCanvas(isResponsive);

    } catch (err) {
        isReady = false;
        console.error('Error loading frames:', err);
    }
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

/**
 * Handles scroll events: maps scroll position to a frame and updates the slide.
 * Stored as a named reference so it can be removed and re-added on reinit.
 * @type {Function}
 */
let onScroll = null;

/**
 * Handles resize events: redraws the canvas at the new dimensions.
 * Stored as a named reference so it can be removed and re-added on reinit.
 * @type {Function}
 */
let onResize = null;

/**
 * Initializes or reinitializes the Apollo scroll animation.
 *
 * - First call (activation = false): loads all frames, then registers listeners.
 * - Subsequent calls (activation = true): skips loading, removes the existing
 *   listeners and re-registers them with the new isResponsive value.
 *
 * @param {boolean} isResponsive - Disables horizontal slide when true.
 */
export function initApollo(isResponsive) {
    if (!activation) {
        loadFrames(isResponsive);
        
    } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
    }

    onScroll = () => {
        if (!isReady) return;
        const targetFrame = getScrollFrame();
        if (targetFrame !== currentFrame) {
            currentFrame = targetFrame;
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => drawFrame(currentFrame));
        }
        updateWrapperSlide(isResponsive);
    };

    onResize = () => resizeCanvas(isResponsive);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
}