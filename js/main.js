document.addEventListener("DOMContentLoaded", function() {
    // Load Header
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initMobileMenu();
            initLanguageSwitcher();
            initNavbarScroll();
            applyTranslations();
        });

    // Load Footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            applyTranslations();
        });

    initComparisonSliders();
    initFAQ();
    applyTranslations();
});

// Navbar scroll effect
function initNavbarScroll() {
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

let currentLang = localStorage.getItem('site-lang') || 'en';

function initLanguageSwitcher() {
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        // Set initial text
        updateLangButtonText(langBtn);
        
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentLang = currentLang === 'en' ? 'cn' : 'en';
            localStorage.setItem('site-lang', currentLang);
            updateLangButtonText(langBtn);
            applyTranslations();
        });
    }
}

function updateLangButtonText(btn) {
    btn.textContent = currentLang === 'en' ? '中文' : 'EN';
}

function applyTranslations() {
    if (typeof translations === 'undefined') return;
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[currentLang][key];
            } else {
                // Use innerHTML to properly render HTML tags like <br>
                el.innerHTML = translations[currentLang][key];
            }
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// Scroll animation observer
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

window.addEventListener('load', () => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
});

function initComparisonSliders() {
    const sliders = document.querySelectorAll('.comparison-container');

    sliders.forEach(slider => {
        const beforeImage = slider.querySelector('.img-before');
        const handle = slider.querySelector('.slider-handle');
        let isDragging = false;

        const onMove = (e) => {
            if (!isDragging) return;
            
            const rect = slider.getBoundingClientRect();
            let x = (e.clientX || e.touches[0].clientX) - rect.left;
            
            // Clamp values
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            const percentage = (x / rect.width) * 100;
            
            // Use clip-path instead of width to prevent image squishing
            beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;
        };

        const onStart = () => isDragging = true;
        const onEnd = () => isDragging = false;

        handle.addEventListener('mousedown', onStart);
        handle.addEventListener('touchstart', onStart);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove);

        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    });
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}