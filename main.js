document.querySelector('#menuButton').addEventListener('click', (e) => {
    document.querySelector('#nav').classList.toggle('open');
});

const slidesContainer = document.querySelector('.slides');
let slides = Array.from(document.querySelectorAll('.slide'));
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const dots = document.querySelectorAll('.dot');

const totalSlides = slides.length;
let currentIndex = totalSlides; // start at middle clone

// Clone slides 3x for infinite effect
slidesContainer.innerHTML = slidesContainer.innerHTML + slidesContainer.innerHTML + slidesContainer.innerHTML;
slides = Array.from(document.querySelectorAll('.slide'));

const slideWidth = slides[0].offsetWidth + 20;
const slider = document.querySelector('.slider');

// initial position
slidesContainer.style.transform = `translateX(${-currentIndex * slideWidth + slider.offsetWidth / 2 - slideWidth / 2}px)`;

// update active slides and dots
function updateSlides() {
    slides.forEach((slide) => slide.classList.remove('active'));

    const activeIndex = currentIndex % totalSlides;
    slides.forEach((slide, i) => {
        if (i % totalSlides === activeIndex) slide.classList.add('active');
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
}

// move slider
function moveTo(index) {
    currentIndex = index;
    slidesContainer.style.transition = 'transform 0.5s ease';
    slidesContainer.style.transform = `translateX(${-currentIndex * slideWidth + slider.offsetWidth / 2 - slideWidth / 2}px)`;
    updateSlides();
}

// next/prev buttons
nextBtn.addEventListener('click', () => moveTo(currentIndex + 1));
prevBtn.addEventListener('click', () => moveTo(currentIndex - 1));

// dots
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        // choose closest clone to currentIndex
        const candidates = [i, i + totalSlides, i + 2 * totalSlides];
        let nearest = candidates.reduce((prev, curr) => (Math.abs(curr - currentIndex) < Math.abs(prev - currentIndex) ? curr : prev));
        moveTo(nearest);
    });
});

// clickable slides
slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
        const logicalIndex = i % totalSlides;
        const candidates = [logicalIndex, logicalIndex + totalSlides, logicalIndex + 2 * totalSlides];
        let nearest = candidates.reduce((prev, curr) => (Math.abs(curr - currentIndex) < Math.abs(prev - currentIndex) ? curr : prev));
        moveTo(nearest);
    });
});

// reset position after transition if crossed clone boundaries
slidesContainer.addEventListener('transitionend', () => {
    if (currentIndex >= totalSlides * 2) {
        currentIndex -= totalSlides;
        slidesContainer.style.transition = 'none';
        slidesContainer.style.transform = `translateX(${-currentIndex * slideWidth + slider.offsetWidth / 2 - slideWidth / 2}px)`;
    } else if (currentIndex < totalSlides) {
        currentIndex += totalSlides;
        slidesContainer.style.transition = 'none';
        slidesContainer.style.transform = `translateX(${-currentIndex * slideWidth + slider.offsetWidth / 2 - slideWidth / 2}px)`;
    }
});

// initialize
updateSlides();
