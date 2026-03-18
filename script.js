// Club Center Fight Academy - Script principal
console.log('Bienvenido a Club Center Fight Academy');

// Variables globales
let currentSlide = 0;
let isMenuOpen = false;

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initScrollAnimations();
    initStickyHeader();
    initScrollToTop();
    initCookieBar();
    initTestimonialsSlider();
    
    // Inicializar formulario de contacto si existe
    const contactForm = document.getElementById('whatsappForm');
    if (contactForm) {
        initContactForm(contactForm);
    }
});

// ===== FUNCIÓN MENÚ MÓVIL =====
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (menuBtn && navLinks) {
        // A11y: reflejar estado del menú
        menuBtn.setAttribute('aria-expanded', 'false');
        // En caso de que no exista aria-controls en el HTML, lo definimos.
        if (!menuBtn.getAttribute('aria-controls')) {
            if (!navLinks.id) navLinks.id = 'mobile-nav-links';
            menuBtn.setAttribute('aria-controls', navLinks.id);
        }

        menuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            // Toggle clases
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
            body.style.overflow = isMenuOpen ? 'hidden' : '';
            menuBtn.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
        });
        
        // Cerrar menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Si se pasa a desktop, cerrar el menú por consistencia
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMobileMenu();
            }
        }, 150));
    }
}

function closeMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    isMenuOpen = false;
    navLinks.classList.remove('active');
    menuBtn.classList.remove('active');
    body.style.overflow = '';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}

// ===== FUNCIÓN HEADER STICKY =====
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== FUNCIÓN BOTÓN IR ARRIBA =====
function initScrollToTop() {
    const btnUp = document.getElementById('btn-up');
    
    if (btnUp) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                btnUp.classList.add('visible');
            } else {
                btnUp.classList.remove('visible');
            }
        });
        
        btnUp.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== FUNCIÓN AVISO DE COOKIES =====
function initCookieBar() {
    const cookieBar = document.getElementById('cookie-bar');
    const acceptBtn = document.getElementById('accept-cookies');
    
    if (cookieBar && acceptBtn) {
        // Mostrar solo si no se han aceptado las cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBar.style.display = 'block';
            }, 2000);
        }
        
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBar.style.display = 'none';
        });
    }
}

// ===== FUNCIÓN FORMULARIO DE CONTACTO =====
function initContactForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const nombre = formData.get('nombre');
        const mensaje = formData.get('mensaje');
        
        if (nombre && mensaje) {
            const whatsappText = `Hola, soy ${nombre}. ${mensaje}`;
            const encodedText = encodeURIComponent(whatsappText);
            const whatsappUrl = `https://wa.me/5491131598373?text=${encodedText}`;
            
            window.open(whatsappUrl, '_blank');
        }
    });
}

// ===== FUNCIÓN ANIMACIONES AL SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll('.discipline-card, .feature-card, .team-card, .chat-option-card');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== FUNCIÓN SLIDER DE TESTIMONIOS =====
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

    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;

    let currentSlide = 0;
    let autoPlayInterval;

    function createCarousel() {
        const carouselHTML = `
            <div class="carousel-track-wrapper">
                <div class="carousel-track">
                    ${testimonials.map((testimonial, index) => `
                        <div class="carousel-card ${index === 0 ? 'active' : ''}">
                            <img src="${testimonial.image}" alt="Testimonio ${index + 1}" onclick="openLightbox('${testimonial.image}')">
                            <div class="testimonial-text">"${testimonial.text}"</div>
                            <h3>${testimonial.author}</h3>
                        </div>
                    `).join('')}
                </div>
            </div>
            <button class="carousel-arrow left" onclick="moveSlide(-1)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="carousel-arrow right" onclick="moveSlide(1)">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="carousel-indicators">
                ${testimonials.map((_, index) => `
                    <span class="carousel-indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
                `).join('')}
            </div>
        `;
        
        carouselContainer.innerHTML = carouselHTML;
    }

    function showSlide(index) {
        const cards = document.querySelectorAll('.carousel-card');
        const indicators = document.querySelectorAll('.carousel-indicator');
        const track = document.querySelector('.carousel-track');
        
        cards.forEach(card => card.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        cards[index].classList.add('active');
        indicators[index].classList.add('active');
        
        const offset = -index * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        currentSlide = index;
    }

    function moveSlide(direction) {
        const newIndex = (currentSlide + direction + testimonials.length) % testimonials.length;
        showSlide(newIndex);
    }

    function goToSlide(index) {
        showSlide(index);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            moveSlide(1);
        }, 5000);
    }

    function pauseAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Inicializar carrusel
    createCarousel();
    
    // Eventos para autoplay
    carouselContainer.addEventListener('mouseenter', pauseAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
    
    // Iniciar autoplay
    startAutoPlay();
    
    // Hacer funciones globales
    window.moveSlide = moveSlide;
    window.goToSlide = goToSlide;
}

// ===== FUNCIÓN LIGHTBOX =====
function openLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox active';
    lightbox.innerHTML = `
        <img src="${imageSrc}" alt="Imagen ampliada">
        <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

// Hacer función global
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

// ===== FUNCIÓN PARALLAX SUAVE =====
function parallaxHero() {
    const heroSections = document.querySelectorAll('.hero-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        heroSections.forEach(hero => {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Inicializar parallax si es necesario
if (window.innerWidth > 768) {
    parallaxHero();
}

// ===== FUNCIÓN DEBOUCE PARA OPTIMIZACIÓN =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar eventos de scroll
const optimizedScrollHandler = debounce(() => {
    // Aquí irían las funciones que se ejecutan en scroll
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== FUNCIÓN PARA DETECTAR DISPOSITIVO MÓVIL =====
function isMobile() {
    return window.innerWidth <= 768;
}

// ===== FUNCIÓN PARA AJUSTAR COMPORTAMIENTO SEGÚN DISPOSITIVO =====
function adjustForDevice() {
    if (isMobile()) {
        // Comportamientos específicos para móvil
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
    }
}

// Ejecutar al cargar y al cambiar tamaño de ventana
adjustForDevice();
window.addEventListener('resize', debounce(adjustForDevice, 250));

// ===== FUNCIÓN PARA MEJORAR ACCESIBILIDAD =====
function improveAccessibility() {
    // Agregar atributos ARIA a elementos dinámicos
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Mejorar navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Inicializar mejoras de accesibilidad
improveAccessibility();

// ===== FUNCIÓN PARA PREVENIR ZOOM EN MÓVIL =====
function preventZoomOnMobile() {
    if (isMobile()) {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
}

// Inicializar prevención de zoom
preventZoomOnMobile();

console.log('Script de Club Center Fight Academy cargado correctamente');
