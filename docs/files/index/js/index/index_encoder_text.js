/**
 * Character pool used for generating random encoded text.
 * Includes uppercase alphabet letters and digits.
 */
const chars = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];

/**
 * Returns a Promise that resolves after a given number of milliseconds.
 * Used to introduce delays in asynchronous animations.
 * 
 * @param {number} ms - Time in milliseconds to wait.
 * @returns {Promise<void>}
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a random string of a specified length using the `chars` pool.
 * 
 * @param {number} length - Desired length of the encoded string.
 * @returns {string} Randomly generated string.
 */
const encodeChar = (length) => {
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

/**
 * Encodes the text content of a list of DOM elements.
 * Each element's text is replaced with a random string of equal length.
 * The original text is preserved for later decoding.
 * 
 * @param {NodeList|Array<Element>} elements - Collection of DOM elements.
 * @returns {Array<{element: Element, originalText: string}>}
 */
const encodeAllElements = (elements) => {
    return Array.from(elements).map(element => {
        const originalText = element.textContent.toUpperCase();
        element.textContent = encodeChar(originalText.length);
        return { element, originalText };
    });
};

/**
 * Gradually decodes a single element's text.
 * The effect simulates a "hacker-style" reveal where random characters
 * are progressively replaced by the original text.
 * 
 * Process:
 * - Iterates through each character position.
 * - For each position, performs several random "scramble" updates.
 * - Reveals one additional correct character per iteration.
 * 
 * @param {Object} param0
 * @param {Element} param0.element - DOM element to update.
 * @param {string} param0.originalText - Original text to reveal.
 * @returns {Promise<void>}
 */
const decodeElement = async ({ element, originalText }) => {
    const textLength = originalText.length;
    let revealedText = "";

    for (let i = 0; i <= textLength; i++) {
        const steps = Math.floor(Math.random() * 8) + 1;
        for (let j = 0; j < steps; j++) {
            element.textContent = revealedText + encodeChar(textLength - i);
            await wait(30);
        }
        revealedText += originalText[i] ?? "";
    }
};

/**
 * Executes the full animation sequence:
 * 1. Selects all elements with class `.text_effect`
 * 2. Encodes their text content
 * 3. Decodes each element sequentially (not in parallel)
 * 
 * Sequential execution ensures a staggered visual effect.
 * 
 * @returns {Promise<void>}
 */
export const runSequential = async () => {
    const elements = document.querySelectorAll(".text_effect");
    const encodedElements = encodeAllElements(elements);

    for (const encodedElement of encodedElements) {
        await decodeElement(encodedElement);
    }
};