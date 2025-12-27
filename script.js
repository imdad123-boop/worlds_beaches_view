// Function to hide the spinner when the page loads
window.addEventListener('load', function() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.remove('show');
        spinner.classList.add('hide'); // Assuming you have a .hide class in CSS that makes it display: none or sets opacity to 0
    }

    // Optional: Add a class to body or main content to fade it in after spinner hides
    document.body.classList.add('loaded'); // You'd need CSS for .loaded class to control fade-in
});


// Carousel functionality
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-images img');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % totalSlides;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
    showSlide(slideIndex);
}

// Initialize carousel
showSlide(slideIndex);

// Optional: Auto-advance carousel
setInterval(nextSlide, 5000); // Change slide every 5 seconds


// Navbar Shrink on Scroll (Example, you might have your own implementation)
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNavbar');
    if (window.scrollY > 50) { // Adjust scroll value as needed
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger menu toggle (Basic example, assumes you have CSS for .nav-links.active)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}


// Section Fade-in on Scroll
const sections = document.querySelectorAll('.section-fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Adjust as needed: percentage of section visible to trigger
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});


// Destination Tabs (Basic example, assumes you have .destinations and .card elements)
const tabButtons = document.querySelectorAll('.tab-btn');
const destinationCards = document.querySelectorAll('.destinations .card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'active' from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add 'active' to the clicked button
        button.classList.add('active');

        const filter = button.dataset.tab; // e.g., 'all', 'usa', 'europe'

        destinationCards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block'; // Or 'flex', 'grid' based on your CSS
            } else {
                card.style.display = 'none';
            }
        });
    });
});/* Beaches View - script.js
   Created: 2025-12-25
   Features:
   - Spinner hide on page load
   - Responsive navbar hamburger toggle
   - Carousel with prev/next + autoplay + keyboard controls
   - Destination tabs
   - Small-screen dropdown toggles + close-on-outside-click
   - Smooth anchor scrolling
   - Simple form handlers (booking + contact) with simulated submit
   - Intersection observer for section reveal (optional enhancement)
*/

/* -------------------------
   Helpers
   ------------------------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* -------------------------
   Spinner
   ------------------------- */
window.addEventListener('load', () => {
  const spinner = qs('#spinner');
  if (spinner) {
    spinner.classList.remove('show');
    // remove from DOM after fade to keep markup clean
    setTimeout(() => spinner.remove?.(), 600);
  }
});

/* -------------------------
   Navbar / Hamburger
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const hamburger = qs('.hamburger');
  const navLinks = qs('.navbar .nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      body.classList.toggle('nav-open');
    });
  }

  // Close mobile nav when clicking a link
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      // keep dropdown anchors from auto-closing if they have children
      if (window.innerWidth <= 900) {
        body.classList.remove('nav-open');
        const hamburgerBtn = qs('.hamburger');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Close nav if clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 900) return;
    if (!e.target.closest('.navbar') && body.classList.contains('nav-open')) {
      body.classList.remove('nav-open');
      const hamburgerBtn = qs('.hamburger');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

/* -------------------------
   Carousel
   ------------------------- */
(function () {
  const carouselRoot = qs('.carousel');
  if (!carouselRoot) return;

  const slides = qsa('.carousel .carousel-images img');
  let current = slides.findIndex((s) => s.classList.contains('active'));
  if (current === -1) current = 0;

  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 5000;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    current = (index + slides.length) % slides.length;
  }

  function next() { showSlide(current + 1); }
  function prev() { showSlide(current - 1); }

  // Expose for inline onclick attributes in HTML
  window.nextSlide = next;
  window.prevSlide = prev;

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(next, AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Controls: mouse hover pause/resume
  carouselRoot.addEventListener('mouseenter', stopAutoplay);
  carouselRoot.addEventListener('mouseleave', startAutoplay);

  // Keyboard navigation (left/right)
  carouselRoot.tabIndex = 0;
  carouselRoot.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // init
  showSlide(current);
  startAutoplay();

  // If there are dedicated control buttons in DOM, wire them
  const controlBtns = qsa('.carousel-controls button');
  if (controlBtns.length >= 2) {
    controlBtns[0].addEventListener('click', prev);
    controlBtns[1].addEventListener('click', next);
  }
})();

/* -------------------------
   Destination Tabs
   ------------------------- */
(function () {
  const tabs = qsa('.destination-tabs .tab-btn');
  if (!tabs.length) return;

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      const allCards = qsa('#all-destinations .card');

      if (tab === 'all') {
        allCards.forEach((c) => (c.style.display = 'block'));
      } else {
        allCards.forEach((c) => {
          c.style.display = c.classList.contains(tab) ? 'block' : 'none';
        });
      }
    });
  });
})();

/* -------------------------
   Dropdown behaviour for small screens + close on outside click
   ------------------------- */
(function () {
  // Convert hover dropdowns to click on small screens for accessibility
  function handleDropdownClicks(e) {
    if (window.innerWidth > 900) return; // only on smaller screens
    const anchor = e.target.closest('.navbar .dropdown > a');
    if (!anchor) return;
    e.preventDefault();
    const dropdown = anchor.parentElement;
    const open = dropdown.classList.contains('open');
    // close other dropdowns
    qsa('.navbar .dropdown.open').forEach((d) => d.classList.remove('open'));
    if (!open) dropdown.classList.add('open');
    else dropdown.classList.remove('open');
  }

  document.addEventListener('click', (e) => {
    // If click is on a dropdown anchor in navbar, toggle it
    handleDropdownClicks(e);

    // Close dropdowns when clicking outside
    if (!e.target.closest('.navbar')) {
      qsa('.navbar .dropdown.open').forEach((d) => d.classList.remove('open'));
    }
  });

  // Prevent clicks inside dropdown content from closing immediately (mobile)
  qsa('.navbar .dropdown .dropdown-content').forEach((el) => {
    el.addEventListener('click', (ev) => ev.stopPropagation());
  });
})();

/* -------------------------
   Smooth scrolling for anchor links
   ------------------------- */
(function () {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    // skip if it's just "#" or empty
    if (!href || href === '#') return;
    const target = qs(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close mobile nav if open
    document.body.classList.remove('nav-open');
  });
})();

/* -------------------------
   Form handlers (Booking & Contact)
   - Simulate submission and show accessible success message
   ------------------------- */
(function () {
  // Generic function to show message inline
  function showFormMessage(form, message, type = 'success') {
    // remove existing
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();
    const msg = document.createElement('div');
    msg.className = 'form-message';
    msg.setAttribute('role', 'alert');
    msg.style.marginTop = '8px';
    msg.style.padding = '10px';
    msg.style.borderRadius = '8px';
    msg.style.fontWeight = '600';
    msg.style.fontSize = '14px';
    if (type === 'success') {
      msg.style.background = 'rgba(6, 182, 212, 0.08)';
      msg.style.color = '#036b6b';
    } else {
      msg.style.background = 'rgba(245, 101, 101, 0.08)';
      msg.style.color = '#7b2222';
    }
    msg.textContent = message;
    form.appendChild(msg);

    // auto-remove after some time
    setTimeout(() => {
      msg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, easing: 'ease' }).onfinish = () => msg.remove();
    }, 3800);
  }

  // Booking form
  const tourForm = qs('#tourForm');
  if (tourForm) {
    tourForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation (HTML required handles most)
      const submitBtn = tourForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Booking...';

      // Simulate network
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Now';
        tourForm.reset();
        showFormMessage(tourForm, 'Thank you! Your booking request has been received. We will contact you shortly.', 'success');
      }, 1200);
    });
  }

  // Contact form(s)
  qsa('.contact-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
        form.reset();
        showFormMessage(form, 'Message sent — we will reply within 24 hours.', 'success');
      }, 900);
    });
  });
})();

/* -------------------------
   Intersection Observer - reveal sections when they enter the viewport
   (Only adds class; CSS must define .in-view if you want to link animations)
   ------------------------- */
(function () {
  const revealEls = qsa('.section-fade-in');
  if (!('IntersectionObserver' in window) || revealEls.length === 0) {
    // fallback: make them visible
    revealEls.forEach((el) => el.style.opacity = 1);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // optionally unobserve so animation runs only once
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => {
    // start hidden (in case CSS didn't)
    el.style.willChange = 'transform, opacity';
    io.observe(el);
  });
})();

/* -------------------------
   Small accessibility + graceful degradation
   ------------------------- */
// Allow "Enter" to trigger dropdown anchors on keyboard for mobile
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const focused = document.activeElement;
    if (focused && focused.matches('.navbar .dropdown > a')) {
      focused.click();
    }
  }
});