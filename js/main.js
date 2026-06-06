// ============================================
// BLUE CORE SHIELD - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav when clicking a non-dropdown link
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      var parentItem = link.parentElement;
      var isDropdownParent = parentItem && parentItem.classList.contains('has-dropdown');

      if (!isDropdownParent) {
        link.addEventListener('click', function () {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
          // also close all dropdowns
          navMenu.querySelectorAll('.nav-item.open').forEach(function (item) {
            item.classList.remove('open');
          });
        });
      }
    });

    // Close mobile nav when clicking a dropdown child link
    navMenu.querySelectorAll('.dropdown-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Dropdown Menus ---
  var dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  var isMobile = function () { return window.innerWidth <= 768; };

  dropdownItems.forEach(function (item) {
    var toggle = item.querySelector('.nav-link');

    // Mobile: toggle on click
    toggle.addEventListener('click', function (e) {
      if (isMobile()) {
        e.preventDefault();
        var isOpen = item.classList.contains('open');
        // close all others
        dropdownItems.forEach(function (other) {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open', !isOpen);
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      dropdownItems.forEach(function (item) {
        item.classList.remove('open');
      });
    }
  });

  // --- Header Scroll Effect ---
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- FAQ Accordions ---
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
          var otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // --- Scroll Animations ---
  var fadeElements = document.querySelectorAll('.fade-up');

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Contact Form Handling ---
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#10B981';
        submitBtn.style.borderColor = '#10B981';

        contactForm.reset();

        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 3000);
      }, 1500);
    });
  }

  // --- Counter Animation ---
  var statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var text = el.textContent.trim();
    var suffix = '';
    var prefix = '';

    if (text.includes('%')) {
      suffix = '%';
      text = text.replace('%', '');
    }
    if (text.includes('+')) {
      suffix = '+' + suffix;
      text = text.replace('+', '');
    }
    if (text.includes(',')) {
      text = text.replace(/,/g, '');
    }

    var target = parseInt(text, 10);
    if (isNaN(target)) return;

    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      var formatted = current.toLocaleString();
      el.textContent = prefix + formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

});
