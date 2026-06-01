// 3D Menu Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item a');
    const sections = document.querySelectorAll('.section');

    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Remove active class from all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Add active class to target section
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Show first section by default
    if (sections.length > 0) {
        sections[0].classList.add('active');
    }

    // 3D Tilt Effect on Mouse Move
    menuItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `
                rotateX(${20 + rotateX}deg) 
                rotateY(${-20 + rotateY}deg) 
                translateZ(40px) 
                scale(1.05)
            `;
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateX(0) rotateY(0) translateZ(0) scale(1)';
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const menuItems = Array.from(document.querySelectorAll('.menu-item a'));
        const currentIndex = menuItems.findIndex(item => 
            item.getAttribute('href') === '#' + (document.querySelector('.section.active')?.id || 'home')
        );

        if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % menuItems.length;
            menuItems[nextIndex].click();
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            menuItems[prevIndex].click();
        }
    });
});