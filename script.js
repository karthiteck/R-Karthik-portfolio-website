document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       THEME SWITCHING LOGIC
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set initial theme
    if (currentTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        // Re-initialize canvas colors based on new theme
        initCanvasColors();
    });

    /* ==========================================
       MOBILE NAVIGATION TOGGLE
       ========================================== */
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        mobileToggleBtn.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    mobileToggleBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileToggleBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    // Sticky Header Scroll State
    const header = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================
       TYPEWRITER ANIMATION (HERO)
       ========================================== */
    const typewriterElement = document.getElementById('typewriter');
    const roles = [
        "Amazon Web Services (AWS) Enthusiast",
        "Cloud Enthusiast",
        "Frontend Web Developer",
        "Python Developer",
        "Quick Learner",
        "Problem Solver",
        "Team Worker"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const handleTypewriter = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up erasing
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Completed typing word, pause
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Completed deleting word, move to next role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(handleTypewriter, typingSpeed);
    };

    // Start typewriter loop
    if (typewriterElement) {
        setTimeout(handleTypewriter, 1000);
    }

    /* ==========================================
       INTERACTIVE CANVAS BACKGROUND
       ========================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let particleCount = 65;
    let particleColor = 'rgba(157, 78, 221, 0.4)';
    let connectionColor = 'rgba(157, 78, 221, 0.08)';

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const initCanvasColors = () => {
        const isLight = document.body.classList.contains('light-theme');
        if (isLight) {
            particleColor = 'rgba(114, 9, 183, 0.25)';
            connectionColor = 'rgba(114, 9, 183, 0.05)';
        } else {
            particleColor = 'rgba(199, 125, 255, 0.35)';
            connectionColor = 'rgba(199, 125, 255, 0.06)';
        }
    };

    // Initialize initial canvas configuration
    initCanvasColors();

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Adjust particle count for smaller screens
        if (window.innerWidth < 768) {
            particleCount = 25;
            mouse.radius = 80;
        } else {
            particleCount = 65;
            mouse.radius = 120;
        }
        createParticles();
    };

    class Particle {
        constructor(x, y, directionX, directionY, size) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }

        update() {
            // Screen boundaries wrap-around or bounce
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Interactive mouse hover influence
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius) {
                    // Pull particles gently towards mouse
                    this.x += dx * 0.02;
                    this.y += dy * 0.02;
                }
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    const createParticles = () => {
        particlesArray = [];
        for (let i = 0; i < particleCount; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    };

    // Draw lines connecting particles
    const connect = () => {
        let maxDistance = 150;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < maxDistance) {
                    // Connect particles
                    let alpha = (1 - (distance / maxDistance)) * 0.35;
                    ctx.strokeStyle = connectionColor.replace('0.06', alpha).replace('0.05', alpha);
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }

            // Connect particles to mouse
            if (mouse.x !== null && mouse.y !== null) {
                let dx = particlesArray[a].x - mouse.x;
                let dy = particlesArray[a].y - mouse.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius) {
                    let alpha = (1 - (distance / mouse.radius)) * 0.4;
                    ctx.strokeStyle = connectionColor.replace('0.06', alpha).replace('0.05', alpha);
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();

    /* ==========================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal-slide-left, .reveal-slide-right, .reveal-scale');
    const skillCards = document.querySelectorAll('.skill-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's a skill card, animate the progress bar inside it
                if (entry.target.classList.contains('skill-card')) {
                    const progressBar = entry.target.querySelector('.skill-level-fill');
                    if (progressBar) {
                        progressBar.style.width = progressBar.getAttribute('style').split('width:')[1];
                    }
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    skillCards.forEach(el => revealObserver.observe(el));

    /* ==========================================
       SKILLS FILTERING
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allSkillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active classes
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            allSkillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    // Trigger tiny animation delay
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Hide after animation finishes
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    /* ==========================================
       CASE STUDIES - MODAL POPUP LOGIC
       ========================================== */
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalContentTarget = document.getElementById('modal-content-target');

    const caseStudiesData = {
        'accident-tracker': {
            pretitle: "IoT & Embedded Python",
            title: "Accident Prevention & Vehicle Tracking System",
            tags: ["Python", "IoT", "GPS", "Arduino", "Sensors", "Driver Safety"],
            challenge: "Every year, delayed emergency responses in highway crashes contribute significantly to fatalities. The goal was to develop an autonomous system capable of identifying severe collisions in real time and relaying location markers to response centers instantly.",
            details: [
                "Designed and implemented an integrated IoT device using Arduino microcontrollers connected to accelerometer and GPS tracking modules.",
                "Programmed real-time sensor processing pipelines in Python to filter noise and prevent false positives from speed breakers or hard brakes.",
                "Implemented emergency alerting webhooks that auto-dispatch coordinate details, links to maps, and vital status packets to predefined contacts.",
                "Achieved 95%+ tracking accuracy and significantly decreased critical alert delay, securing immediate support windows for test situations."
            ],
            techStack: ["Python", "Arduino IDE", "C/C++", "GPS/GPRS Modules", "Accelerometer Sensors", "IoT protocols"]
        },
        'web-sentinel': {
            pretitle: "AI & QA Automation",
            title: "Web Sentinel: AI Agents for Automated Web Testing",
            tags: ["Python", "Selenium", "AI/ML Agents", "QA Frameworks", "CI/CD"],
            challenge: "Manual visual verification and regression testing in rapidly deploying modern web ecosystems leads to developer bottlenecks. This project aimed to design self-healing, intelligent QA agents to crawl, evaluate, and test interface compliance.",
            details: [
                "Built an extensible, AI-driven validation framework in Python utilizing Selenium Web Driver wrapper instances.",
                "Created heuristics-based page crawling agents that analyze site structures, construct DOM models, and auto-detect layout anomalies or broken endpoints.",
                "Integrated automated pipelines for regression, performance profiling, and browser cross-compatibility checks.",
                "Improved overall testing productivity by 90%, preventing manual regression fatigue and accelerating product release cycles."
            ],
            techStack: ["Python", "Selenium WebDriver", "Machine Learning Heuristics", "JavaScript DOM APIs", "HTML5 & CSS3", "Git & CI/CD workflows"]
        }
    };

    const populateModal = (projectId) => {
        const data = caseStudiesData[projectId];
        if (!data) return;

        let tagsHtml = data.tags.map(tag => `<span>${tag}</span>`).join('');
        let detailsHtml = data.details.map(pt => `<li>${pt}</li>`).join('');
        let techHtml = data.techStack.map(tech => `<div class="modal-tech-item">${tech}</div>`).join('');

        modalContentTarget.innerHTML = `
            <div class="modal-header-block">
                <span class="modal-pretitle">${data.pretitle}</span>
                <h2>${data.title}</h2>
                <div class="modal-meta-tags">
                    ${tagsHtml}
                </div>
            </div>
            
            <div class="modal-section-block">
                <h3>Project Overview</h3>
                <p>${data.challenge}</p>
            </div>
            
            <div class="modal-section-block">
                <h3>Key Accomplishments & Implementation</h3>
                <ul class="modal-bullet-list">
                    ${detailsHtml}
                </ul>
            </div>

            <div class="modal-section-block">
                <h3>Technologies & Tools Utilized</h3>
                <div class="modal-tech-grid">
                    ${techHtml}
                </div>
            </div>
        `;
    };

    const openModal = (projectId) => {
        populateModal(projectId);
        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        // Clear modal memory after close completes
        setTimeout(() => {
            modalContentTarget.innerHTML = '';
        }, 300);
    };

    projectCards.forEach(card => {
        const btn = card.querySelector('.project-btn-details');
        const projectId = card.getAttribute('data-project');
        
        // Clicking button opens modal
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(projectId);
            });
        }
        // Clicking card opens modal too
        card.addEventListener('click', () => {
            openModal(projectId);
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);

    // Click outside modal card to close
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });

    /* ==========================================
       CONTACT FORM VALIDATION & SIMULATION
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formSuccessBox = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('reset-form-btn');

    // Helper: validate email address format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Display validation error
    const showError = (inputElement) => {
        const group = inputElement.parentElement;
        group.classList.add('invalid');
    };

    // Hide validation error
    const clearError = (inputElement) => {
        const group = inputElement.parentElement;
        group.classList.remove('invalid');
    };

    // Real-time error clearing when user interacts
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    // Do nothing yet, let submit check, or keep checking
                } else {
                    clearError(input);
                }
            }
        });
        
        input.addEventListener('focus', () => {
            clearError(input);
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Check Name
        if (nameInput.value.trim() === '') {
            showError(nameInput);
            isFormValid = false;
        } else {
            clearError(nameInput);
        }

        // Check Email
        if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
            showError(emailInput);
            isFormValid = false;
        } else {
            clearError(emailInput);
        }

        // Check Message
        if (messageInput.value.trim() === '') {
            showError(messageInput);
            isFormValid = false;
        } else {
            clearError(messageInput);
        }

        if (isFormValid) {
            // Animate submit button state
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const submitBtnText = submitBtn.querySelector('span');
            submitBtn.disabled = true;
            submitBtnText.textContent = "Sending...";

            // Simulate server network request delay
            setTimeout(() => {
                // Hide Form, Show Success Card
                contactForm.style.opacity = '0';
                
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccessBox.style.display = 'flex';
                    // Reset inputs
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtnText.textContent = "Send Message";
                    contactForm.style.opacity = '1';
                }, 300);

            }, 1500);
        }
    });

    // Reset Form Success State to Send Another Message
    resetFormBtn.addEventListener('click', () => {
        formSuccessBox.style.display = 'none';
        contactForm.style.display = 'flex';
    });

    /* ==========================================
       PREVENT PAGE JUMP IN ANCHOR TAGS
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for floating sticky header height
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
});
