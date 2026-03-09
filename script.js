document.addEventListener("DOMContentLoaded", () => {

  // ===== Typewriter effect =====
  const typewriterEl = document.getElementById("typewriter");
  const words = ["Développeur Web", "Entrepreneur", "Étudiant BTS SIO"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = words[wordIndex];

    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();


  // ===== Hero terminal animation =====
  const heroTermBody = document.getElementById("heroTermBody");
  if (heroTermBody) {
    const termSeq = [
      { type: 'cmd', text: 'whoami' },
      { type: 'out', html: '<span class="term-green">Nolan Jean</span> — Dev &amp; Entrepreneur' },
      { type: 'blank' },
      { type: 'cmd', text: 'skills --list' },
      { type: 'out', html: '<span class="term-accent">PHP</span> · <span class="term-accent">Kotlin</span> · <span class="term-accent">Python</span> · <span class="term-accent">Java</span>' },
      { type: 'out', html: '<span class="term-accent">Spring Boot</span> · <span class="term-accent">SQL</span> · HTML/CSS' },
      { type: 'blank' },
      { type: 'cmd', text: 'status' },
      { type: 'out', html: '<span class="term-green">✔</span> Open to opportunities' },
      { type: 'blank' },
      { type: 'cursor' },
    ];

    function termAnimate() {
      heroTermBody.style.transition = '';
      heroTermBody.style.opacity = '1';
      heroTermBody.innerHTML = '';
      let step = 0;

      function next() {
        if (step >= termSeq.length) {
          setTimeout(() => {
            heroTermBody.style.transition = 'opacity 0.5s ease';
            heroTermBody.style.opacity = '0';
            setTimeout(termAnimate, 500);
          }, 2500);
          return;
        }
        const l = termSeq[step++];
        const div = document.createElement('div');
        div.className = 'term-line';

        if (l.type === 'blank') {
          div.innerHTML = '&nbsp;';
          div.style.height = '6px';
        } else if (l.type === 'cmd') {
          div.innerHTML = `<span class="term-prompt">~/dev $</span><span class="term-cmd">${l.text}</span>`;
        } else if (l.type === 'out') {
          div.innerHTML = `<span class="term-out">${l.html}</span>`;
        } else if (l.type === 'cursor') {
          div.innerHTML = `<span class="term-prompt">~/dev $</span><span class="term-cursor"></span>`;
        }

        heroTermBody.appendChild(div);
        requestAnimationFrame(() => requestAnimationFrame(() => div.classList.add('visible')));

        const delay = l.type === 'cmd' ? 500 : l.type === 'blank' ? 100 : 300;
        if (l.type !== 'cursor') setTimeout(next, delay);
      }

      next();
    }

    termAnimate();
  }


  // ===== Scroll animations (timeline + project cards) =====
  const timelineItems = document.querySelectorAll(".timeline li");
  const projectCards = document.querySelectorAll(".project-card");

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allCards = [...projectCards];
        const idx = allCards.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add("show");
        }, idx * 150);
      }
    });
  }, { threshold: 0.2 });

  projectCards.forEach(card => projectObserver.observe(card));


  // ===== Animated counters =====
  const countersSection = document.getElementById("counters");
  let countersDone = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersDone) {
        countersDone = true;
        document.querySelectorAll(".counter-number").forEach(counter => {
          const target = +counter.dataset.target;
          const duration = 1500;
          const step = Math.ceil(duration / target);
          let current = 0;

          const interval = setInterval(() => {
            current++;
            counter.textContent = current;
            if (current >= target) clearInterval(interval);
          }, step);
        });
      }
    });
  }, { threshold: 0.5 });

  counterObserver.observe(countersSection);


  // ===== Scrollspy =====
  const navLinks = document.querySelectorAll("nav ul li a");
  const sections = document.querySelectorAll("section");

  function updateActiveLink() {
    const navHeight = document.querySelector("nav").offsetHeight;

    let currentSectionId = sections[0]?.id;
    let minDistance = Infinity;

    sections.forEach(section => {
      const distance = Math.abs(section.getBoundingClientRect().top - navHeight);
      if (distance < minDistance) {
        minDistance = distance;
        currentSectionId = section.id;
      }
    });

    navLinks.forEach(link => link.classList.remove("active"));
    const activeLink = document.querySelector(`nav ul li a[href="#${currentSectionId}"]`);
    if (activeLink) activeLink.classList.add("active");
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();


  // ===== Smooth scroll for internal links =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#" || targetId.length <= 1) return;

      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      e.preventDefault();

      const navHeight = document.querySelector("nav")?.offsetHeight || 0;
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });


  // ===== Modal Contact =====
  const openBtn = document.getElementById("openContact");
  const modal = document.getElementById("contactModal");
  const closeBtn = document.querySelector(".close-modal");
  const focusableInModal = modal.querySelectorAll('button, a, [tabindex="0"]');
  const firstFocusable = focusableInModal[0];
  const lastFocusable = focusableInModal[focusableInModal.length - 1];

  function openModal() {
    modal.classList.add("show");
    firstFocusable?.focus();
  }

  function closeModal() {
    modal.classList.remove("show");
    openBtn.focus();
  }

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("show")) return;

    if (e.key === "Escape") {
      closeModal();
      return;
    }

    // Focus trap
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });


  // ===== Copy email with fallback =====
  const copyEmailBtn = document.getElementById("copyEmail");
  const copyFeedback = document.getElementById("copyFeedback");

  copyEmailBtn.addEventListener("click", () => {
    const email = "nobodyplayeur@gmail.com";

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showCopyFeedback);
    } else {
      // Fallback for older browsers / HTTP
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showCopyFeedback();
    }
  });

  function showCopyFeedback() {
    copyFeedback.style.display = "block";
    setTimeout(() => {
      copyFeedback.style.display = "none";
    }, 2000);
  }


  // ===== Burger menu mobile =====
  const burgerWrapper = document.querySelector(".burger-wrapper");
  const navMenu = document.querySelector("nav ul");

  burgerWrapper.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
    });
  });


  // ===== Back to top button =====
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  // ===== Scroll progress indicator =====
  const scrollProgress = document.getElementById("scrollProgress");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;
  });


  // ===== Theme toggle (dark/light) =====
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  }

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";

    if (next === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", next);
    }

    localStorage.setItem("theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === "light" ? "fas fa-sun" : "fas fa-moon";
  }

});
