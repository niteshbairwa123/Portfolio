/* ============================================================
   NITESH BAIRWA – PORTFOLIO SCRIPT
   Full animations: Loader → Hero → Scroll → Skills → Forms
   ============================================================ */

/* ---- Typewriter words ---- */
const WORDS = [
    'Web Applications.',
    'Full-Stack Systems.',
    'Data-Driven Tools.',
    'Smart Algorithms.',
    'Scalable Backends.',
];

/* ============================================================
   CURSOR
   ============================================================ */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

// Smooth follower via requestAnimationFrame
let fx = 0, fy = 0;
function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
}
animFollower();

// Cursor hover effects
document.querySelectorAll('a, button, .skill-card, .project-card, .ach-card, .tour-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '16px';
        cursor.style.height = '16px';
        follower.style.width = '60px';
        follower.style.height = '60px';
        follower.style.borderColor = 'rgba(99,102,241,0.6)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.borderColor = 'rgba(99,102,241,0.5)';
    });
});

/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderName = document.querySelector('.loader-name');
    const brackets = document.querySelectorAll('.code-bracket');
    const loaderFill = document.querySelector('.loader-fill');
    const loaderLabel = document.querySelector('.loader-label');

    // Animate brackets + name
    setTimeout(() => {
        brackets.forEach((b, i) => {
            b.style.transition = 'all 0.5s ease ' + (i * 0.2) + 's';
            b.style.opacity = '1';
            b.style.transform = 'translateX(0)';
        });
        loaderName.style.transition = 'all 0.5s ease 0.2s';
        loaderName.style.opacity = '1';
        loaderName.style.transform = 'translateY(0)';
        loaderLabel.style.transition = 'opacity 0.5s ease 0.5s';
        loaderLabel.style.opacity = '1';
    }, 200);

    // Fill bar
    loaderFill.style.transition = 'width 1.5s cubic-bezier(0.4,0,0.2,1) 0.3s';
    setTimeout(() => { loaderFill.style.width = '100%'; }, 300);

    // Hide loader
    setTimeout(() => {
        loader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.03)';
        setTimeout(() => {
            loader.style.display = 'none';
            startHeroAnimation();
        }, 600);
    }, 2200);
});

/* ============================================================
   HERO ANIMATION (reveal text)
   ============================================================ */
function startHeroAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const revealEls = document.querySelectorAll('.reveal-text');
    revealEls.forEach((el, i) => {
        gsap.to(el, {
            y: 0,
            duration: 1,
            ease: 'power4.out',
            delay: 0.2 + i * 0.15,
        });
    });

    // Start typewriter after hero text reveals
    setTimeout(startTypewriter, 1400);
    initScrollAnimations();
    initSkillBars();
    initCounters();
}

/* ============================================================
   TYPEWRITER
   ============================================================ */
let twIndex = 0, charIndex = 0, isDeleting = false;

function startTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    function type() {
        const word = WORDS[twIndex];

        if (!isDeleting) {
            el.textContent = word.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === word.length) {
                isDeleting = true;
                setTimeout(type, 1800);
                return;
            }
        } else {
            el.textContent = word.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                twIndex = (twIndex + 1) % WORDS.length;
            }
        }

        setTimeout(type, isDeleting ? 60 : 90);
    }

    type();
}

/* ============================================================
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
   ============================================================ */
function initScrollAnimations() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
    });

    // Generic [data-aos] elements
    const aosEls = document.querySelectorAll('[data-aos]');
    aosEls.forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });

    // Section titles
    gsap.utils.toArray('.section-title').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 90%' }
            }
        );
    });

    // Section labels
    gsap.utils.toArray('.section-label').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: -20 },
            {
                opacity: 1, x: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 92%' }
            }
        );
    });

    // About grid
    gsap.fromTo('.about-photo-wrap',
        { opacity: 0, x: -50 },
        {
            opacity: 1, x: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.about-grid', start: 'top 80%' }
        }
    );
    gsap.fromTo('.about-info',
        { opacity: 0, x: 50 },
        {
            opacity: 1, x: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.about-grid', start: 'top 80%' }
        }
    );

    // Skill cards stagger
    gsap.fromTo('.skill-card',
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.skills-grid', start: 'top 85%' }
        }
    );

    // Edu cards
    gsap.fromTo('.edu-card',
        { opacity: 0, x: -30 },
        {
            opacity: 1, x: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.edu-timeline', start: 'top 85%' }
        }
    );

    // Project cards
    gsap.fromTo('.project-card',
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.projects-grid', start: 'top 85%' }
        }
    );

    // Achievement cards stagger
    gsap.fromTo('.ach-card',
        { opacity: 0, scale: 0.9 },
        {
            opacity: 1, scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'back.out(1.5)',
            scrollTrigger: { trigger: '.achievements-grid', start: 'top 85%' }
        }
    );

    // Contact panels
    gsap.fromTo('.contact-info-panel',
        { opacity: 0, x: -40 },
        {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact-layout', start: 'top 85%' }
        }
    );
    gsap.fromTo('.contact-form-panel',
        { opacity: 0, x: 40 },
        {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact-layout', start: 'top 85%' }
        }
    );

    // bg-text parallax
    gsap.utils.toArray('.bg-text-large').forEach(el => {
        gsap.to(el, {
            y: -60,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, scrub: true }
        });
    });

    // Experience items stagger
    gsap.fromTo('.exp-item',
        { opacity: 0, x: 30 },
        {
            opacity: 1, x: 0,
            duration: 0.7,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.exp-timeline', start: 'top 85%' }
        }
    );
}

/* ============================================================
   SKILL BARS
   ============================================================ */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');

    ScrollTrigger.create({
        trigger: '.skill-bars',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            bars.forEach(bar => {
                const width = bar.dataset.width + '%';
                bar.style.width = width;
            });
        }
    });
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-val[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                let current = 0;
                const step = target / 60;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current).toLocaleString();
                }, 20);
            }
        });
    });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = menuBtn.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
    }
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
    });
});

/* ============================================================
   CONTACT FORM — wired to /api/contact (SQLite backend)
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const formMsg     = document.getElementById('formMsg');
const toast       = document.getElementById('successToast');
const toastClose  = document.getElementById('toastClose');

// Show & auto-dismiss toast
function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5400); // auto-hide after 5s
}

if (toastClose) {
    toastClose.addEventListener('click', () => toast.classList.remove('show'));
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');

        const name    = document.getElementById('cName').value.trim();
        const email   = document.getElementById('cEmail').value.trim();
        const message = document.getElementById('cMessage').value.trim();

        // Client-side guard
        if (!name || !email || !message) {
            formMsg.className = 'form-message error';
            formMsg.textContent = '⚠️ Please fill in all fields.';
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        formMsg.className = 'form-message';
        formMsg.textContent = '';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                contactForm.reset();
                // Show animated toast
                showToast();
                // Button success state
                submitBtn.innerHTML = '<span>Submitted ✓</span> <i class="fa-solid fa-check"></i>';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
                }, 4000);
            } else {
                throw new Error(data.error || 'Something went wrong.');
            }

        } catch (err) {
            formMsg.className = 'form-message error';
            formMsg.textContent = '❌ ' + (err.message || 'Failed to send. Please email directly.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        }
    });
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   SMOOTH ACTIVE NAV on scroll
   ============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function setActiveNav() {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', setActiveNav, { passive: true });

