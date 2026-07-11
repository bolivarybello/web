/**
 * JavaScript del Sitio Web - Institución Educativa Bolívar y Bello
 * Contiene: Precargador, menú responsivo, animaciones en scroll (reveal),
 * contadores de estadísticas, pestañas académicas, carrusel de testimonios y formulario interactivo.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. PANTALLA DE CARGA (LOADER)
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        });
        // Respaldo en caso de que el evento 'load' ya haya ocurrido
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 1500);
    }

    // 2. EFECTO DE NAVEGACIÓN EN SCROLL (NAVBAR SCROLLED)
    const navbarContainer = document.querySelector('.navbar-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbarContainer.classList.add('scrolled');
        } else {
            navbarContainer.classList.remove('scrolled');
        }
    });

    // 3. MENÚ MÓVIL (MENU HAMBURGUESA)
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('open');
            navLinksContainer.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('open');
                navLinksContainer.classList.remove('open');
            });
        });
    }

    // 4. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Dejar de observar una vez que se anima
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Se activa cuando el 15% del elemento está en pantalla
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. EFECTO DE CONTEO DINÁMICO DE ESTADÍSTICAS
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-val'));
            const duration = 2000; // 2 segundos
            const stepTime = 30; // ms por frame
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toLocaleString('es-ES') + (target === 1200 || target === 80 || target === 25 ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString('es-ES') + '+';
                }
            }, stepTime);
        });
    };

    // Observer específico para la sección de estadísticas
    const statsSection = document.getElementById('estadisticas');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 }); // 30% visible

        statsObserver.observe(statsSection);
    }

    // 6. CONTROL DE PESTAÑAS ACADÉMICAS
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            // Quitar clase activa de botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Quitar clase activa de paneles
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Agregar clase activa al actual
            button.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // 7. CAROUSEL DE TESTIMONIOS
    const carouselWrapper = document.getElementById('carousel-wrapper');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (carouselWrapper && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;

        // Generar dots indicadores
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = document.querySelectorAll('.dot');

        const updateCarousel = () => {
            carouselWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            // Actualizar dots
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        };

        const goToSlide = (slideIndex) => {
            currentSlide = slideIndex;
            updateCarousel();
            resetAutoSlide();
        };

        // Eventos para botones
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        // Deslizamiento automático
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextSlide, 5000); // 5 segundos
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };

        startAutoSlide();

        // Pausar auto-slide al pasar el mouse por encima
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // 8. FORMULARIO DE CONTACTO INTERACTIVO
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Cambiar estado del botón a "Enviando..."
            submitBtn.textContent = 'Enviando Solicitud...';
            submitBtn.disabled = true;

            // Simular respuesta de red (1.5 segundos)
            setTimeout(() => {
                // Ocultar formulario
                contactForm.style.display = 'none';
                // Mostrar mensaje de éxito
                successMessage.style.display = 'flex';
                
                // Reiniciar texto del botón para futuros envíos
                submitBtn.textContent = 'Enviar Solicitud';
                submitBtn.disabled = false;
            }, 1500);
        });

        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                // Reiniciar campos del formulario
                contactForm.reset();
                // Ocultar mensaje de éxito
                successMessage.style.display = 'none';
                // Mostrar formulario de nuevo con animación
                contactForm.style.display = 'block';
                contactForm.style.animation = 'scaleIn 0.5s ease';
            });
        }
    }

    // 9. FORMULARIO DE NEWSLETTER (PIE DE PÁGINA)
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const button = newsletterForm.querySelector('button');
            
            const originalText = button.textContent;
            button.textContent = '¡Listo!';
            button.style.background = '#22c55e'; // Verde de éxito
            input.value = '';
            input.disabled = true;
            button.disabled = true;

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                input.disabled = false;
                button.disabled = false;
            }, 3000);
        });
    }

    // 10. RESALTAR ENLACE ACTIVO AL HACER SCROLL (NAV ACTIVE SYNC)
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = 'inicio';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Se considera activa si está cubriendo el centro de la pantalla
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});
