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

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el menú móvil
    initMobileMenu();
    
    // Inicializar el slider de testimonios
    initTestimonialsSlider();
    
    // Inicializar animaciones al hacer scroll
    initScrollAnimations();
    
    // Inicializar el header sticky
    initStickyHeader();
});

// Función para el menú móvil
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        // Cerrar el menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
}

// Nuevo carrusel de testimonios
function initTestimonialsSlider() {
    const testimonials = [
        {
            text: "Muy buen gimnasio!",
            author: "Glaucus Sprint",
            image: "Fotos/opiniones/opinion1.PNG"
        },
        {
            text: "Excelente dojo",
            author: "Paul Villegas",
            image: "Fotos/opiniones/opinion2.PNG"
        },
        {
            text: "Excelente calidad y atención, totalmente recomendable.",
            author: "Juan Petrus",
            image: "Fotos/opiniones/opinion3.PNG"
        },
        {
            text: "Lindo lugar para entrenar muay thai, excelente el profesor.",
            author: "Alan Forte",
            image: "Fotos/opiniones/opinion4.PNG"
        },
        {
            text: "Genial para pasar con amigos y hacer actividad fisica.",
            author: "Juan Regule",
            image: "Fotos/opiniones/opinion5.PNG"
        },
        {
            text: "Excelente sitio para entrenar Jiu-Jitsu.",
            author: "Alumno",
            image: "Fotos/opiniones/opinion6.PNG"
        },
        {
            text: "El mejor lugar para entrenar Muay Thai.",
            author: "Maximo Leguizamon",
            image: "Fotos/opiniones/opinion7.PNG"
        },
        {
            text: "Excelente lugar para aprender.",
            author: "Hernan Galder",
            image: "Fotos/opiniones/opinion8.PNG"
        },
        {
            text: "Excelente sitio para entrenar.",
            author: "Daniel Marquez",
            image: "Fotos/opiniones/opinion9.PNG"
        }
    ];

    const track = document.querySelector('.carousel-track');
    const leftBtn = document.querySelector('.carousel-arrow.left');
    const rightBtn = document.querySelector('.carousel-arrow.right');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    let currentIndex = 0;
    let intervalId = null;
    let isPaused = false;

    // Limpiar track e indicadores
    track.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    // Crear las tarjetas
    testimonials.forEach((testimonial, idx) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.setAttribute('role', 'group');
        card.setAttribute('aria-roledescription', 'slide');
        card.setAttribute('aria-label', `${idx + 1} de ${testimonials.length}`);
        card.innerHTML = `
            <img src="${testimonial.image}" alt="${testimonial.author}" data-img="${testimonial.image}">
            <p class="testimonial-text">"${testimonial.text}"</p>
            <h3>- ${testimonial.author}</h3>
        `;
        track.appendChild(card);
        // Indicadores
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('tabindex', '0');
        indicator.setAttribute('aria-label', `Testimonio ${idx + 1}`);
        indicator.addEventListener('click', () => {
            showSlide(idx);
            pauseAutoPlay();
        });
        indicator.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                showSlide(idx);
                pauseAutoPlay();
            }
        });
        indicatorsContainer.appendChild(indicator);
    });

    // Función para mostrar el slide actual
    function showSlide(index) {
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        // Actualizar indicadores
        document.querySelectorAll('.carousel-indicator').forEach((el, i) => {
            el.classList.toggle('active', i === currentIndex);
        });
    }

    // Navegación
    leftBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        pauseAutoPlay();
    });
    rightBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        pauseAutoPlay();
    });

    // Auto-play
    function startAutoPlay() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (!isPaused) showSlide(currentIndex + 1);
        }, 5000);
    }
    function pauseAutoPlay() {
        isPaused = true;
        setTimeout(() => { isPaused = false; }, 10000);
    }
    track.addEventListener('mouseenter', () => { isPaused = true; });
    track.addEventListener('mouseleave', () => { isPaused = false; });

    // Lightbox para imágenes
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    track.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            lightboxImg.src = e.target.getAttribute('data-img');
            lightbox.classList.add('active');
        }
    });
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            lightboxImg.src = '';
        });
    }
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            lightboxImg.src = '';
        }
    });

    // Accesibilidad: navegación con teclado
    leftBtn.setAttribute('tabindex', '0');
    rightBtn.setAttribute('tabindex', '0');
    leftBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') leftBtn.click(); });
    rightBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') rightBtn.click(); });

    // Inicializar
    showSlide(0);
    startAutoPlay();
}

// Función para animaciones al hacer scroll
function initScrollAnimations() {
    const elements = document.querySelectorAll('.discipline-card, .feature-card, .section-header');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Función para el header sticky
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll hacia abajo
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll hacia arriba
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Función para el smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Botón Ir arriba
const btnUp = document.getElementById('btn-up');
window.addEventListener('scroll', function() {
    if(window.scrollY > 300) {
        btnUp.classList.add('visible');
    } else {
        btnUp.classList.remove('visible');
    }
});
btnUp.addEventListener('click', function() {
    window.scrollTo({top:0, behavior:'smooth'});
});

// Aviso de cookies
const cookieBar = document.getElementById('cookie-bar');
const acceptCookies = document.getElementById('accept-cookies');
if(cookieBar && acceptCookies) {
    if(!localStorage.getItem('cookiesAccepted')) {
        cookieBar.style.display = 'block';
    }
    acceptCookies.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBar.style.display = 'none';
    });
}

// Parallax suave en banners para mobile fallback
function parallaxHero() {
    const hero = document.querySelector('.hero-section');
    if(hero) {
        window.addEventListener('scroll', function() {
            let offset = window.scrollY * 0.3;
            hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
        });
    }
}
parallaxHero();
