document.querySelector('#menuButton').addEventListener('click', (e) => {
    document.querySelector('#nav').classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', () => {
    // --- ESSENTIAL VARIABLE DEFINITIONS ---
    const carousel = document.querySelector('.carousel');
    const cards = Array.from(carousel.querySelectorAll('.carousel__card'));
    const navLinks = Array.from(document.querySelectorAll('.nav__link'));

    // Select the directional buttons
    const prevButton = document.querySelector('.control__button.prev');
    const nextButton = document.querySelector('.control__button.next');

    const CLASSES = ['one', 'two', 'three', 'four', 'five'];
    const CENTER_CLASS = 'three';

    // --- HELPER FUNCTION: Rotate Array ---
    function rotateArray(arr, count) {
        const len = arr.length;
        const normalizedShift = ((count % len) + len) % len;

        const part1 = arr.slice(normalizedShift);
        const part2 = arr.slice(0, normalizedShift);

        return [...part1, ...part2];
    }

    // --- HELPER FUNCTION: Update Navigation Links & Button Colors ---
    function updateActiveLink(centeredCardPermanentIndex) {
        navLinks.forEach((link) => link.classList.remove('active'));

        const activeLink = navLinks.find((link) => link.dataset.permanentIndex === String(centeredCardPermanentIndex));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // --- CORE FUNCTION: Apply Rotation and Updates ---
    function rotateCarousel(shift) {
        const newClasses = rotateArray(CLASSES, shift);
        let centeredCardPermanentIndex = -1;

        cards.forEach((card) => {
            let oldClass;

            // 1. Find and remove the card's current positional class
            for (const cls of CLASSES) {
                if (card.classList.contains(cls)) {
                    oldClass = cls;
                    card.classList.remove(cls);
                    break;
                }
            }

            if (oldClass) {
                const oldClassIndex = newClasses.indexOf(oldClass);
                const newClass = CLASSES[oldClassIndex];

                void card.offsetHeight; // Reflow fix
                card.classList.add(newClass);

                // 3. Update ARIA attributes
                const pos = CLASSES.indexOf(newClass) + 1;
                card.setAttribute('aria-posintext', pos);

                if (newClass === CENTER_CLASS) {
                    card.setAttribute('aria-hidden', 'false');
                    centeredCardPermanentIndex = parseInt(card.dataset.permanentIndex);
                } else {
                    card.setAttribute('aria-hidden', 'true');
                }
            }
        });

        // 4. Update all visual indicators
        if (centeredCardPermanentIndex !== -1) {
            updateActiveLink(centeredCardPermanentIndex);
        }
    }

    // ------------------------------------------------------------------
    // --- EVENT HANDLERS ---
    // ------------------------------------------------------------------

    // 1. CARD CLICK HANDLER (Unchanged)
    carousel.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.carousel__card');
        if (!clickedCard || clickedCard.classList.contains(CENTER_CLASS)) return;

        let currentClass;
        for (const cls of CLASSES) {
            if (clickedCard.classList.contains(cls)) {
                currentClass = cls;
                break;
            }
        }
        if (!currentClass) return;

        const currentPositionIndex = CLASSES.indexOf(currentClass);
        const centerIndex = CLASSES.indexOf(CENTER_CLASS);
        const shift = -(centerIndex - currentPositionIndex);
        rotateCarousel(shift);
    });

    // 2. NAVIGATION LINK CLICK HANDLER (FIXED for reliable click on LI)
    navLinks.forEach((clickedLink) => {
        clickedLink.addEventListener('click', () => {
            if (clickedLink.classList.contains('active')) return;

            const targetPermanentIndex = parseInt(clickedLink.dataset.permanentIndex);
            const cardToCenter = cards.find((card) => parseInt(card.dataset.permanentIndex) === targetPermanentIndex);

            if (!cardToCenter) return;

            let currentClass;
            for (const cls of CLASSES) {
                if (cardToCenter.classList.contains(cls)) {
                    currentClass = cls;
                    break;
                }
            }
            if (!currentClass) return;

            const currentPositionIndex = CLASSES.indexOf(currentClass);
            const centerIndex = CLASSES.indexOf(CENTER_CLASS);
            const shift = -(centerIndex - currentPositionIndex);

            rotateCarousel(shift);
        });
    });

    // 3. DIRECTIONAL BUTTONS HANDLER (FIXED: Checks if elements exist before listening)

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            rotateCarousel(-1); // Shift left
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            rotateCarousel(1); // Shift right
        });
    }

    // --- INITIALIZATION ---
    // Sets the initial active link and button color
    updateActiveLink(3);
});
