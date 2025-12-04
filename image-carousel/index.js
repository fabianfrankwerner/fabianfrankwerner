const one = document.querySelector(".one");
const two = document.querySelector(".two");
const three = document.querySelector(".three");
const four = document.querySelector(".four");
const five = document.querySelector(".five");

const carousel = document.querySelector(".carousel-container");
const slides = document.querySelectorAll(".carousel-slide");
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");
const dotsContainer = document.querySelector(".carousel-dots");

let currentSlide = 0;
const slideWidth = 500; // Width of each slide in pixels
let autoSlideInterval;

// Create dots
slides.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  updateDots();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  goToSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  goToSlide(currentSlide);
}

// Event listeners for buttons
prevButton.addEventListener("click", () => {
  prevSlide();
  resetAutoSlide();
});

nextButton.addEventListener("click", () => {
  nextSlide();
  resetAutoSlide();
});

// Auto slide functionality
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Start auto sliding
startAutoSlide();
