// En este archivo podemos agregar funcionalidades más adelante, como un formulario interactivo o alguna animación.
console.log('Bienvenido a Club Center Fight Academy');

let currentSlide = 0;

function moveSlide(direction) {
    const carouselInner = document.querySelector('.carousel-inner');
    const slides = document.querySelectorAll('.testimonial-card');
    const totalSlides = slides.length;

    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

    const offset = -currentSlide * 100;
    carouselInner.style.transform = `translateX(${offset}%)`;
}
