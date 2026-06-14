// script.js
window.astromargSettings = { whatsapp: '919142140693' }; // default fallback

async function loadComponents() {
    try {
        const headerRes = await fetch('components/header.html');
        if (headerRes.ok) {
            document.getElementById('header-placeholder').innerHTML = await headerRes.text();
            initHeaderScripts();
        }
        
        const footerRes = await fetch('components/footer.html');
        if (footerRes.ok) {
            document.getElementById('footer-placeholder').innerHTML = await footerRes.text();
        }
        
        await fetchSettings();
        initGlobalScripts();
    } catch (e) {
        console.error("Error loading components", e);
    }
}

async function fetchSettings() {
    try {
        const res = await fetch('api/settings.php');
        const data = await res.json();
        if (data) {
            window.astromargSettings = { ...window.astromargSettings, ...data };
            
            // Update UI elements if they exist
            const elWaText = document.getElementById('dyn-wa-text');
            const elWaLink = document.getElementById('dyn-wa-link');
            if (elWaText) elWaText.innerText = '+' + data.whatsapp;
            if (elWaLink) elWaLink.href = 'https://wa.me/' + data.whatsapp;

            const elEmailText = document.getElementById('dyn-email-text');
            const elEmailLink = document.getElementById('dyn-email-link');
            if (elEmailText) elEmailText.innerText = data.email;
            if (elEmailLink) elEmailLink.href = 'mailto:' + data.email;

            const elAddress = document.getElementById('dyn-address');
            if (elAddress) elAddress.innerHTML = data.address;

            const fb = document.getElementById('dyn-social-fb');
            if (fb) fb.href = data.social_facebook || '#';
            
            const ig = document.getElementById('dyn-social-ig');
            if (ig) ig.href = data.social_instagram || '#';

            const yt = document.getElementById('dyn-social-yt');
            if (yt) yt.href = data.social_youtube || '#';

            const tw = document.getElementById('dyn-social-tw');
            if (tw) tw.href = data.social_twitter || '#';
        }
    } catch (e) {
        console.error("Failed to fetch settings", e);
    }
}

function initHeaderScripts() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--color-bg-dark)';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid var(--glass-border)';
            navLinks.style.zIndex = '1000';
        });
    }
    
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initGlobalScripts() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 90;
            const y = (window.innerHeight - e.pageY * 2) / 90;
            heroImage.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }

    // --- Reveal on Scroll ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Custom Cursor ---
    if (window.innerWidth > 1024) {
        const dot = document.createElement('div');
        dot.className = 'custom-cursor-dot';
        const ring = document.createElement('div');
        ring.className = 'custom-cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        document.addEventListener('mousemove', (e) => {
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            
            // Trailing effect for ring
            setTimeout(() => {
                ring.style.left = e.clientX + 'px';
                ring.style.top = e.clientY + 'px';
            }, 60);
        });

        // Hover effect for interactive elements
        // Use event delegation to handle dynamically added components like navbar/footer
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, input, select, .service-card, .testimonial-card, .pricing-card')) {
                ring.classList.add('hover');
            }
        });
        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, input, select, .service-card, .testimonial-card, .pricing-card')) {
                ring.classList.remove('hover');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', loadComponents);

// --- WhatsApp Form Submission ---
window.submitToWhatsApp = function(event, formTitle) {
    event.preventDefault();
    const form = event.target;
    let message = `*New Lead: ${formTitle}*\n\n`;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Skip submit buttons
        if (input.type === 'submit' || input.type === 'button') return;
        
        let label = input.name || input.getAttribute('placeholder') || input.getAttribute('title');
        
        if (input.tagName.toLowerCase() === 'select') {
            label = input.options[0].text;
            if(input.options[input.selectedIndex].value === "") return; // Skip if empty default
        }
        
        // Fallback for missing labels
        if (!label) {
            if (input.type === 'date') label = 'Date';
            else if (input.type === 'time') label = 'Time';
            else label = 'Detail';
        }
        
        if (input.value) {
            let val = input.tagName.toLowerCase() === 'select' ? input.options[input.selectedIndex].text : input.value;
            message += `*${label}:* ${val}\n`;
        }
    });
    
    const waNum = window.astromargSettings.whatsapp;
    const whatsappUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};
