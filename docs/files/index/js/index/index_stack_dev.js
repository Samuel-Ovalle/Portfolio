/**
 * Fetches stack data from a JSON file and dynamically injects
 * technology items into DOM tracks. Then initializes animation
 * for each container.
 */
export async function addStack() {
    try {
        // Fetch JSON data containing stack definitions
        let stackData = await fetch('./files/index/json/stack_dev.json');
        stackData = await stackData.json();

        // Select all track elements (where tech items will be injected)
        const tracks     = document.querySelectorAll('.track');

        // Select all container elements (wrappers for animation)
        const containers = document.querySelectorAll('.stackContainer');

        /**
         * Iterate through each track and populate it with
         * corresponding stack data based on index alignment.
         * 
         * ⚠ Assumption:
         * - stackData.stacks[index] must exist for every track.
         * - No bounds checking is performed here.
         */
        tracks.forEach((track, index) => {
            stackData.stacks[index].forEach(tech => {
                track.insertAdjacentHTML('beforeend', `
                    <div class="tech">
                        <img src="${tech.icon}" alt="${tech.name}">
                        <span>${tech.name} ${tech.progress}%</span>
                    </div>
                `);
            });
        });

        /**
         * Initialize animation for each container.
         * Each container is expected to contain a `.track` element.
         */
        containers.forEach(container => animateStack(container));

    } catch (error) {
        // Minimal error handling (consider improving for production)
        console.log(error);
    }
}

/**
 * Creates an infinite horizontal scrolling animation for a given container.
 * The animation loops by cloning elements and repositioning them when they
 * exit the visible area.
 * 
 * @param {HTMLElement} container - The container wrapping the track
 */
function animateStack(container) {
    
    // Track element containing all tech items
    const track = container.querySelector('.track');
    
    // Snapshot of initial items (used for cloning)
    const items = Array.from(track.querySelectorAll('.tech')); 
    
    // Animation speed in pixels per frame
    const SPEED = 1;

    // Gap between items when reflowing.
    const GAP   = window.innerWidth * .01;

    // Current horizontal position
    let pos = 0;

    // Controls animation state (paused/resumed)
    let running = true;

    // Index used to cycle through original items for cloning
    let cloneIndex = 0;

    /**
     * Core animation loop using requestAnimationFrame.
     * Moves the track left and recycles elements when they
     * leave the visible container.
     */
    const animate = () => {
        if (running) {
            pos -= SPEED;
            track.style.transform = 'translateX(' + pos + 'px)';

            const first      = track.firstElementChild;

            // Bounding boxes for visibility calculations
            const firstRect  = first.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            /**
             * If the first element is completely outside the container (to the left),
             * remove it and append a cloned element at the end.
             */
            if (firstRect.right < containerRect.left) {
                const source = items[cloneIndex % items.length];
                const clone  = source.cloneNode(true);

                // Accessibility: hide cloned elements from assistive tech
                clone.setAttribute('aria-hidden', 'true');

                track.appendChild(clone);
                track.removeChild(first);

                /**
                 * Adjust position to compensate for removed element width
                 * and maintain smooth continuous scrolling.
                 */
                pos += firstRect.width + GAP;
                track.style.transform = 'translateX(' + pos + 'px)';

                cloneIndex++;
            }
        }

        requestAnimationFrame(animate);
    };
    
    /**
     * Pause animation on hover
     */
    container.addEventListener('mouseenter', () => running = false);

    /**
     * Resume animation when mouse leaves
     */
    container.addEventListener('mouseleave', () => running = true);

    // Start animation loop
    requestAnimationFrame(animate);
}
