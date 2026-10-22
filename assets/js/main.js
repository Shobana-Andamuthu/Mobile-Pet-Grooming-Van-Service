/**
 * ==========================================================================
 * Mobile Pet Grooming Van Service
 * Shared Interactive Foundation (Theme, RTL, Responsive Drawer)
 * ==========================================================================
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_THEME = 'paw_grooming_theme';
  const STORAGE_DIR = 'paw_grooming_dir';

  // SVG Icons for Light/Dark toggles
  const ICON_MOON = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;

  const ICON_SUN = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `;

  // --------------------------------------------------------------------------
  // 1. THEME MANAGEMENT (Light / Dark)
  // --------------------------------------------------------------------------
  function applyTheme(theme) {
    const validTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', validTheme);
    localStorage.setItem(STORAGE_THEME, validTheme);

    const themeToggleBtns = document.querySelectorAll('[data-action="toggle-theme"], #theme-toggle, .theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = validTheme === 'dark' ? ICON_SUN : ICON_MOON;
      btn.setAttribute('aria-label', validTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', validTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });

    const themeIndicators = document.querySelectorAll('[data-bind="theme-status"]');
    themeIndicators.forEach(el => {
      el.textContent = validTheme.toUpperCase();
    });

    window.dispatchEvent(new CustomEvent('petThemeChanged', { detail: { theme: validTheme } }));
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  }

  // --------------------------------------------------------------------------
  // 2. DIRECTION MANAGEMENT (LTR / RTL)
  // --------------------------------------------------------------------------
  function applyDirection(dir) {
    const validDir = dir === 'rtl' ? 'rtl' : 'ltr';
    
    // Temporarily disable transitions so elements don't slide/flash across screen
    document.documentElement.classList.add('no-transitions');
    document.documentElement.setAttribute('dir', validDir);
    localStorage.setItem(STORAGE_DIR, validDir);

    const rtlToggleBtns = document.querySelectorAll('[data-action="toggle-rtl"], #rtl-toggle, .rtl-toggle-btn');
    rtlToggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', validDir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('title', validDir === 'rtl' ? 'Switch to LTR Direction' : 'Switch to RTL Direction');
    });

    const dirIndicators = document.querySelectorAll('[data-bind="dir-status"]');
    dirIndicators.forEach(el => {
      el.textContent = validDir.toUpperCase();
    });

    // Re-enable transitions after browser reflow
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transitions');
      });
    });

    window.dispatchEvent(new CustomEvent('petDirectionChanged', { detail: { dir: validDir } }));
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    applyDirection(nextDir);
  }

  // --------------------------------------------------------------------------
  // 2B. ATTRACTIVE PAGE PRELOADER CONTROLLER
  // --------------------------------------------------------------------------
  function initPreloader() {
    let preloader = document.getElementById('page-preloader');
    if (!preloader && document.body) {
      preloader = document.createElement('div');
      preloader.id = 'page-preloader';
      preloader.className = 'page-preloader';
      preloader.setAttribute('aria-hidden', 'true');
      preloader.innerHTML = `
        <div class="preloader-content">
          <div class="preloader-van-wrap">
            <div class="preloader-pulse-ring"></div>
            <div class="preloader-icon-box">
              <svg class="preloader-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 18H3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h12v12H5z"></path>
                <path d="M15 9h4.6a2 2 0 0 1 1.8 1.1L23 14v2c0 1.1-.9 2-2 2h-2"></path>
                <circle cx="7" cy="18" r="2.5"></circle>
                <circle cx="17" cy="18" r="2.5"></circle>
                <circle class="preloader-bubble bubble-1" cx="12" cy="4" r="1.5" fill="currentColor"></circle>
                <circle class="preloader-bubble bubble-2" cx="15" cy="2" r="1" fill="currentColor"></circle>
              </svg>
            </div>
          </div>
          <div class="preloader-brand">
            <span class="preloader-title">Velvet<span>Van</span></span>
            <span class="preloader-subtitle">Luxury Mobile Pet Spa</span>
          </div>
          <div class="preloader-progress-track">
            <div class="preloader-progress-bar"></div>
          </div>
        </div>
      `;
      document.body.prepend(preloader);
    }

    const dismissPreloader = () => {
      const el = document.getElementById('page-preloader');
      if (!el) return;
      el.classList.add('is-loaded');
      setTimeout(() => {
        if (el && el.parentNode) {
          el.style.display = 'none';
        }
      }, 500);
    };

    if (document.readyState === 'complete') {
      setTimeout(dismissPreloader, 220);
    } else {
      window.addEventListener('load', () => setTimeout(dismissPreloader, 220));
      // Safety timeout: never block user for more than 1.4s
      setTimeout(dismissPreloader, 1400);
    }
  }

  // --------------------------------------------------------------------------
  // 2C. BACK TO TOP (BOTTOM TO TOP) FLOATING ARROW BUTTON
  // --------------------------------------------------------------------------
  function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn && document.body) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', 'Scroll back to top');
      btn.setAttribute('title', 'Scroll to top');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    if (!btn) return;

    // Toggle visibility based on scroll position
    const handleScroll = () => {
      if (window.scrollY > 280) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. RESPONSIVE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  function initMobileDrawer() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    if (!mobileDrawer || !hamburgerBtn) return;

    function openDrawer() {
      hamburgerBtn.classList.add('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('is-open');
      if (drawerBackdrop) drawerBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('is-open');
      if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';

      // Reset home dropdown when menu closes
      const homeSubgroups = mobileDrawer.querySelectorAll('.drawer-subgroup');
      homeSubgroups.forEach(sub => sub.classList.remove('is-open'));
      const homeToggle = mobileDrawer.querySelector('.drawer-menu > .drawer-link:first-child');
      if (homeToggle) homeToggle.classList.remove('is-expanded');
    }

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeDrawer);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Highlight Home if on index.html or home-2.html
    const currentPath = window.location.pathname.toLowerCase();
    const isHomePage = currentPath.endsWith('index.html') || currentPath.endsWith('home-2.html') || currentPath === '/' || currentPath.endsWith('/');
    const firstDrawerLink = mobileDrawer.querySelector('.drawer-menu > .drawer-link:first-child');
    if (isHomePage && firstDrawerLink) {
      firstDrawerLink.classList.add('active');
    }

    // Toggle home dropdown on click
    if (firstDrawerLink) {
      firstDrawerLink.addEventListener('click', (e) => {
        const subgroup = firstDrawerLink.nextElementSibling;
        if (subgroup && subgroup.classList.contains('drawer-subgroup')) {
          e.preventDefault();
          const isOpen = subgroup.classList.contains('is-open');
          subgroup.classList.toggle('is-open', !isOpen);
          firstDrawerLink.classList.toggle('is-expanded', !isOpen);
        }
      });
    }

    const drawerLinks = mobileDrawer.querySelectorAll('a[href^="#"]');
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // --------------------------------------------------------------------------
  // 4. FAQ ACCORDION COMPONENT
  // --------------------------------------------------------------------------
  function initFaqAccordion() {
    // 1. Classic FAQ triggers (.faq-trigger / .faq-item)
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('is-open');

        // Close other items
        document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
          if (openItem !== item) openItem.classList.remove('is-open');
        });

        if (isOpen) {
          item.classList.remove('is-open');
        } else {
          item.classList.add('is-open');
        }
      });
    });

    // 2. Accordion Headers on Pricing & Contact Pages (.faq-header / .faq-accordion-item)
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        e.preventDefault();
        const item = header.closest('.faq-accordion-item');
        if (!item) return;
        const isActive = item.classList.contains('active');

        // Close sibling accordion items in the same container
        const container = item.closest('.faq-container') || item.parentElement;
        if (container) {
          container.querySelectorAll('.faq-accordion-item.active').forEach(openItem => {
            if (openItem !== item) {
              openItem.classList.remove('active');
              const btn = openItem.querySelector('.faq-header');
              if (btn) btn.setAttribute('aria-expanded', 'false');
            }
          });
        }

        if (isActive) {
          item.classList.remove('active');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. INTERACTIVE VARIETY GUIDE (HOME 2)
  // --------------------------------------------------------------------------
  const VARIETY_DATA = {
    hydro: {
      name: 'Royal Canine Hydro-Spa',
      price: '$89.00',
      image: 'assets/images/user/user_img8_hydro_bath.jpg',
      desc: 'Our signature therapeutic hydrobath using warm purified water, organic botanical shampoo, and blueberry facial. Gentle on skin, deeply relaxing, and leaves coats silky soft.',
      metrics: {
        hydration: '99%',
        calm: '98%',
        softness: '95%',
        shedding: '88%'
      }
    },
    scissor: {
      name: 'Full Scissor Breed Cut',
      price: '$129.00',
      image: 'assets/images/user/user_img4_pomeranian.jpg',
      desc: 'Artisan hand-scissor styling tailored to breed standards or custom teddy-bear cuts. Includes sanitary hygiene trim, paw pad rounding, and precision face shaping.',
      metrics: {
        hydration: '92%',
        calm: '96%',
        softness: '99%',
        shedding: '90%'
      }
    },
    deshed: {
      name: 'Deep Undercoat De-Shedding',
      price: '$105.00',
      image: 'assets/images/user/user_img5_schnauzer.png',
      desc: 'Intensive dead-hair removal treatment using Furminator specialized blades, deshedding shampoo soak, and high-velocity blowout to eliminate up to 90% of household shedding.',
      metrics: {
        hydration: '94%',
        calm: '95%',
        softness: '96%',
        shedding: '99%'
      }
    },
    feline: {
      name: 'Feline Serenity Spa Suite',
      price: '$95.00',
      image: 'assets/images/cat-catgroom.jpg',
      desc: 'Ultra-quiet van environment dedicated exclusively to cats. Waterless foam bath or warm gentle soak, nail trim, ear sanitizing, and gentle detangling with zero barking dogs.',
      metrics: {
        hydration: '96%',
        calm: '99%',
        softness: '98%',
        shedding: '92%'
      }
    }
  };

  function initVarietyGuide() {
    const tabBtns = document.querySelectorAll('.variety-tab-btn');
    const nameEl = document.querySelector('.variety-name');
    const priceEl = document.querySelector('.variety-price');
    const descEl = document.querySelector('.variety-desc');
    const imgEl = document.querySelector('.variety-media img');
    
    const fillHydration = document.querySelector('.fill-hydration');
    const valHydration = document.querySelector('.val-hydration');
    const fillCalm = document.querySelector('.fill-calm');
    const valCalm = document.querySelector('.val-calm');
    const fillSoftness = document.querySelector('.fill-softness');
    const valSoftness = document.querySelector('.val-softness');
    const fillShedding = document.querySelector('.fill-shedding');
    const valShedding = document.querySelector('.val-shedding');

    if (!tabBtns.length || !nameEl) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-variety');
        const data = VARIETY_DATA[key];
        if (!data) return;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        nameEl.textContent = data.name;
        if (priceEl) priceEl.textContent = data.price;
        if (descEl) descEl.textContent = data.desc;

        if (imgEl && data.image) {
          imgEl.style.opacity = '0.4';
          setTimeout(() => {
            imgEl.src = data.image;
            imgEl.alt = data.name;
            imgEl.style.opacity = '1';
          }, 150);
        }

        if (fillHydration && valHydration) {
          fillHydration.style.width = data.metrics.hydration;
          valHydration.textContent = data.metrics.hydration;
        }
        if (fillCalm && valCalm) {
          fillCalm.style.width = data.metrics.calm;
          valCalm.textContent = data.metrics.calm;
        }
        if (fillSoftness && valSoftness) {
          fillSoftness.style.width = data.metrics.softness;
          valSoftness.textContent = data.metrics.softness;
        }
        if (fillShedding && valShedding) {
          fillShedding.style.width = data.metrics.shedding;
          valShedding.textContent = data.metrics.shedding;
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. CUSTOM SIZE DROPDOWNS
  // --------------------------------------------------------------------------
  function initCustomDropdowns() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.custom-size-trigger');
      const item = e.target.closest('.custom-size-item');
      
      // Close all dropdowns if clicking outside
      if (!trigger && !item) {
        document.querySelectorAll('.custom-size-dropdown.open').forEach(d => d.classList.remove('open'));
        return;
      }

      if (trigger) {
        e.preventDefault();
        const dropdown = trigger.closest('.custom-size-dropdown');
        const isOpen = dropdown.classList.contains('open');
        document.querySelectorAll('.custom-size-dropdown.open').forEach(d => d.classList.remove('open'));
        if (!isOpen) dropdown.classList.add('open');
      }

      if (item) {
        e.preventDefault();
        const dropdown = item.closest('.custom-size-dropdown');
        const valSpan = dropdown.querySelector('.size-val');
        if (valSpan) valSpan.textContent = item.textContent;
        dropdown.querySelectorAll('.custom-size-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        dropdown.classList.remove('open');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. DESKTOP & TABLET NAV DROPDOWNS (HOVER & CLICK SUPPORT)
  // --------------------------------------------------------------------------
  function initNavDropdown() {
    const dropdownToggles = document.querySelectorAll('.nav-item-dropdown > a, .nav-item-dropdown > button');

    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const parent = toggle.closest('.nav-item-dropdown');
        if (parent) {
          e.preventDefault();
          const isOpen = parent.classList.contains('is-open');
          document.querySelectorAll('.nav-item-dropdown.is-open').forEach(d => {
            d.classList.remove('is-open');
            const link = d.querySelector('a, button');
            if (link) link.setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            parent.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item-dropdown')) {
        document.querySelectorAll('.nav-item-dropdown.is-open').forEach(d => {
          d.classList.remove('is-open');
          const link = d.querySelector('a, button');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT APPOINTMENT ENQUIRY FORM VALIDATION & DEMO FEEDBACK
  // --------------------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contact-enquiry-form');
    const banner = document.getElementById('contact-success-banner');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear previous error states
      form.querySelectorAll('.form-group.has-error').forEach(function(el) {
        el.classList.remove('has-error');
      });

      let hasError = false;

      function checkField(id, groupId, condition) {
        const input = document.getElementById(id);
        const group = document.getElementById(groupId);
        if (!input || !group) return;
        if (condition(input.value)) {
          group.classList.add('has-error');
          hasError = true;
        }
      }

      checkField('contact-owner-name', 'group-owner-name', v => !v.trim());
      checkField('contact-owner-phone', 'group-owner-phone', v => !v.trim() || v.trim().length < 7);
      checkField('contact-owner-email', 'group-owner-email', v => !v.trim() || !v.includes('@') || !v.includes('.'));
      checkField('contact-pet-name', 'group-pet-name', v => !v.trim());
      checkField('contact-pet-type', 'group-pet-type', v => !v);
      checkField('contact-service', 'group-service', v => !v);
      checkField('contact-date', 'group-date', v => !v);
      checkField('contact-address', 'group-address', v => !v.trim());
      checkField('contact-zip', 'group-zip', v => !v.trim());

      if (hasError) {
        const firstError = form.querySelector('.form-group.has-error .form-control');
        if (firstError) firstError.focus();
        return;
      }

      // Successful Demo Submission
      if (banner) {
        banner.classList.add('is-visible');
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      form.reset();
    });

    // Clear inline error on input change
    form.querySelectorAll('.form-control').forEach(ctrl => {
      ctrl.addEventListener('input', () => {
        const group = ctrl.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. INITIALIZE ALL CONTROLS
  // --------------------------------------------------------------------------
  function initControls() {
    document.querySelectorAll('[data-action="toggle-theme"], #theme-toggle, .theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });

    document.querySelectorAll('[data-action="toggle-rtl"], #rtl-toggle, .rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDirection();
      });
    });

    initPreloader();
    initBackToTop();
    initMobileDrawer();
    initFaqAccordion();
    initVarietyGuide();
    initCustomDropdowns();
    initNavDropdown();
    initContactForm();

    // Close drawer when resized above mobile/tablet breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1366) {
        const mobileDrawer = document.getElementById('mobile-drawer');
        const drawerBackdrop = document.getElementById('drawer-backdrop');
        const hamburgerBtn = document.getElementById('hamburger-btn');
        if (mobileDrawer) mobileDrawer.classList.remove('is-open');
        if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
        if (hamburgerBtn) {
          hamburgerBtn.classList.remove('is-active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      }
    });

    // Smooth scrolling & direct routing for Book Van and Book Appointment buttons
    document.addEventListener('click', (e) => {
      const bookBtn = e.target.closest('a[href="#book-van"], a[href="#book-appointment"]');
      if (bookBtn) {
        const hash = bookBtn.getAttribute('href');
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId) || document.getElementById('book-van') || document.getElementById('enquiry-form');
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = 'contact.html#enquiry-form';
        }
      }
    });

    const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem(STORAGE_THEME) || 'light';
    applyTheme(currentTheme);

    const currentDir = document.documentElement.getAttribute('dir') || localStorage.getItem(STORAGE_DIR) || 'ltr';
    applyDirection(currentDir);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initControls);
  } else {
    initControls();
  }

  window.PawApp = {
    setTheme: applyTheme,
    toggleTheme: toggleTheme,
    setDirection: applyDirection,
    toggleDirection: toggleDirection
  };
})();
