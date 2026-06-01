// ===== 3D Immersive Webpage JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item a');
    const sections = document.querySelectorAll('.section');
    const container = document.querySelector('.container');
    const perspectiveWrapper = document.querySelector('.perspective-wrapper');

    // ===== Menu Navigation =====
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Remove active class from all sections
            sections.forEach(section => {
                section.classList.remove('section-active');
            });

            // Add active class to target section
            if (targetSection) {
                targetSection.classList.add('section-active');
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Show first section by default
    if (sections.length > 0) {
        sections[0].classList.add('section-active');
    }

    // ===== 3D Tilt Effect on Mouse Move =====
    menuItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;

            this.style.transform = `
                rotateX(${15 + rotateX}deg) 
                rotateY(${-15 + rotateY}deg) 
                translateZ(50px) 
                scale(1.1)
            `;
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateX(0) rotateY(0) translateZ(0) scale(1)';
        });
    });

    // ===== Parallax Effect on Scroll =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const scrollPercent = scrolled / window.innerHeight;

        // Parallax for background
        const bgCubes = document.querySelectorAll('.floating-cube');
        bgCubes.forEach((cube, index) => {
            cube.style.transform = `translateZ(-${scrolled * 0.5}px) rotateX(${scrolled * 0.2}deg) rotateY(${scrolled * 0.1}deg)`;
        });

        // Parallax for header
        const header = document.querySelector('.header-3d');
        if (header) {
            header.style.transform = `translateZ(${scrollPercent * 50}px) rotateX(${scrollPercent * 5}deg)`;
        }
    });

    // ===== Keyboard Navigation =====
    document.addEventListener('keydown', function(e) {
        const menuItems = Array.from(document.querySelectorAll('.menu-item a'));
        const currentSection = document.querySelector('.section.section-active');
        const currentIndex = menuItems.findIndex(item => 
            item.getAttribute('href') === '#' + (currentSection?.id || 'home')
        );

        if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % menuItems.length;
            menuItems[nextIndex].click();
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            menuItems[prevIndex].click();
        }
    });

    // ===== Mouse Movement 3D Effect =====
    document.addEventListener('mousemove', function(e) {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        // Subtle 3D tilt for entire page
        perspectiveWrapper.style.transform = `
            perspective(1500px)
            rotateX(${y * 2}deg)
            rotateY(${-x * 2}deg)
        `;
    });

    // ===== Reset perspective on mouse leave =====
    document.addEventListener('mouseleave', function() {
        perspectiveWrapper.style.transform = `
            perspective(1500px)
            rotateX(0deg)
            rotateY(0deg)
        `;
    });

    // ===== Intersection Observer for Animation Trigger =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-card').forEach(card => {
        observer.observe(card);
    });

    // ===== Performance: Disable 3D on low-end devices =====
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        menuItems.forEach(item => {
            item.style.transition = 'none';
        });
        document.body.style.perspective = 'none';
    }

    // ===== Add ripple effect on click =====
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(240, 147, 251, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            const rect = item.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            item.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// ===== Add ripple animation to stylesheet dynamically =====
const style = document.createElement('style');
style.innerHTML = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);