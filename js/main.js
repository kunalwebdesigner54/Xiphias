/**
 * XIPHIAS - Main Interaction & UX Engine
 * Handles Navigation, Responsive Drawer, Interactive Calculator, Forms, Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Sticky Header on Scroll: Navbar background color appears on scroll
  const header = document.querySelector('.site-header');

  function updateHeaderOnScroll() {
    if (!header) return;
    // Navbar background appears smoothly as soon as the user scrolls down
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
  window.addEventListener('resize', updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();

  // 2. Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    // Close when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // 3. Highlight current page in navbar
  const path = window.location.pathname.toLowerCase();
  const isHomePage = path === '/' || path === '' || path.endsWith('/index.html') || path.endsWith('/index') || path.endsWith('/') || document.body.classList.contains('page-home');

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    const isLinkHome = href === 'index.html' || href.includes('index.html') || link.classList.contains('nav-link-home');

    if (isHomePage) {
      if (isLinkHome) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } else {
      let pageName = path.split('/').filter(Boolean).pop() || '';
      if (!pageName.endsWith('.html') && pageName) pageName += '.html';
      const isCurrent = pageName && (href === pageName || href.endsWith('/' + pageName));
      if (isCurrent) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });

  // 4. Interactive ROI / Cloud Cost Calculator (Products / Solutions page)
  const serversSlider = document.getElementById('calc-servers');
  const cloudSpendSlider = document.getElementById('calc-spend');
  const serversVal = document.getElementById('val-servers');
  const spendVal = document.getElementById('val-spend');
  const annualSavingDisplay = document.getElementById('calc-annual-saving');
  const efficiencyDisplay = document.getElementById('calc-efficiency-boost');

  function updateCalculator() {
    if (!serversSlider || !cloudSpendSlider) return;
    const servers = parseInt(serversSlider.value, 10);
    const monthlySpend = parseInt(cloudSpendSlider.value, 10);

    if (serversVal) serversVal.textContent = servers.toLocaleString() + ' Instances';
    if (spendVal) spendVal.textContent = '$' + monthlySpend.toLocaleString() + '/mo';

    // Xiphias AI optimization formula: ~38% saving on compute + efficiency bonus
    const annualSaving = Math.round((monthlySpend * 12) * 0.38 + (servers * 120));
    const efficiency = Math.min(85, Math.round(35 + (servers * 0.05)));

    if (annualSavingDisplay) annualSavingDisplay.textContent = '$' + annualSaving.toLocaleString();
    if (efficiencyDisplay) efficiencyDisplay.textContent = '+' + efficiency + '%';
  }

  if (serversSlider && cloudSpendSlider) {
    serversSlider.addEventListener('input', updateCalculator);
    cloudSpendSlider.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // 5. Interactive Contact Form & Toast Alert
  const contactForm = document.getElementById('xiphias-contact-form');
  const toastMsg = document.getElementById('toast-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();

      if (!name || !email) {
        alert('Please fill out all required fields.');
        return;
      }

      // Show success toast
      if (toastMsg) {
        toastMsg.classList.add('show');
        setTimeout(() => {
          toastMsg.classList.remove('show');
        }, 5000);
      }

      contactForm.reset();
    });
  }

  // 6. Interactive FAQ Accordion (Contact & About pages)
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const title = item.querySelector('.faq-accordion-title');
    title?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Close all
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // 7. Newsletter Subscription Alert
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value) {
        alert('Thank you for subscribing to XIPHIAS Tech Wave Dispatch!');
        input.value = '';
      }
    });
  });

  // 8. Full-Screen Cinematic Video Engine with Silky Smooth Scroll Sync (Apple-Style)
  const scrollTrack = document.getElementById('cinematicScrollTrack');
  const bannerVideo = document.getElementById('cinematicBannerVideo');
  const progressBar = document.getElementById('cinematicProgressBar');
  const phaseLabel = document.getElementById('cinematicPhaseLabel');
  const scrollHint = document.getElementById('cinematicScrollHint');

  const storyLayers = [
    { el: document.getElementById('storyLayer1'), start: 0.00, end: 0.25, label: 'PHASE 01 // X-CHIP CORE ACTIVATION' },
    { el: document.getElementById('storyLayer2'), start: 0.25, end: 0.55, label: 'PHASE 02 // CIRCUIT TO METROPOLIS' },
    { el: document.getElementById('storyLayer3'), start: 0.55, end: 0.85, label: 'PHASE 03 // MULTI-SCREEN ECOSYSTEM' },
    { el: document.getElementById('storyLayer4'), start: 0.85, end: 1.00, label: 'PHASE 04 // XIPHIAS BRAND REVEAL' }
  ];

  if (scrollTrack && bannerVideo) {
    let videoDuration = 0;
    let targetTime = 0;
    let isSeeking = false;
    let rafQueued = false;
    let pendingTarget = null;
    let lastRenderedTime = -1;

    // Strict compliance: muted, playsinline, paused
    bannerVideo.muted = true;
    bannerVideo.defaultMuted = true;
    bannerVideo.playsInline = true;
    bannerVideo.loop = false;
    bannerVideo.pause();

    // Direct seek execution with hardware seek/fastSeek check
    function executeSeek(time) {
      if (videoDuration <= 0 || isSeeking) {
        pendingTarget = time;
        return;
      }

      // Clamp target time safely within video range
      const clamped = Math.max(0, Math.min(videoDuration - 0.02, time));
      if (Math.abs(clamped - lastRenderedTime) < 0.02) {
        return;
      }

      isSeeking = true;
      lastRenderedTime = clamped;

      try {
        if (typeof bannerVideo.fastSeek === 'function') {
          bannerVideo.fastSeek(clamped);
        } else {
          bannerVideo.currentTime = clamped;
        }
      } catch (err) {
        isSeeking = false;
      }
    }

    // On seeked event from media decoder: immediately process pending frame
    bannerVideo.addEventListener('seeked', () => {
      isSeeking = false;
      if (pendingTarget !== null && Math.abs(pendingTarget - lastRenderedTime) > 0.02) {
        const nextTime = pendingTarget;
        pendingTarget = null;
        executeSeek(nextTime);
      } else {
        pendingTarget = null;
      }
    });

    let isReadyTriggered = false;
    function onVideoReady() {
      if (isReadyTriggered && videoDuration > 0) return;
      if (bannerVideo.duration && !isNaN(bannerVideo.duration)) {
        videoDuration = bannerVideo.duration;
        isReadyTriggered = true;
      } else {
        videoDuration = 15;
      }
      try {
        bannerVideo.pause();
        if (bannerVideo.currentTime === 0) {
          bannerVideo.currentTime = 0.001;
        }
      } catch (e) {}
      onScroll();
    }

    if (bannerVideo.readyState >= 1) {
      onVideoReady();
    }
    bannerVideo.addEventListener('loadedmetadata', onVideoReady);
    bannerVideo.addEventListener('loadeddata', onVideoReady);
    bannerVideo.addEventListener('canplay', onVideoReady);

    // Coordinated rAF frame loop: avoids layout thrashing and dropped seeks
    function renderFrame() {
      rafQueued = false;

      const rect = scrollTrack.getBoundingClientRect();
      const trackHeight = scrollTrack.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / trackHeight));

      if (progressBar) {
        progressBar.style.width = (progress * 100) + '%';
      }

      if (scrollHint) {
        scrollHint.style.opacity = progress > 0.08 ? '0' : '1';
      }

      // Map progress directly to video duration and execute seek safely
      if (videoDuration > 0) {
        targetTime = progress * (videoDuration - 0.02);
        executeSeek(targetTime);
      }

      // Update story chapters & status pill
      let activePhase = storyLayers[0].label;
      storyLayers.forEach((layer) => {
        if (!layer.el) return;
        const isActive = (progress >= layer.start && progress < layer.end) || (layer.end === 1.0 && progress >= 0.98);
        if (isActive) {
          layer.el.classList.add('active');
          activePhase = layer.label;
        } else {
          layer.el.classList.remove('active');
        }
      });

      if (phaseLabel && phaseLabel.textContent !== activePhase) {
        phaseLabel.textContent = activePhase;
      }
    }

    function onScroll() {
      if (!rafQueued) {
        rafQueued = true;
        requestAnimationFrame(renderFrame);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    setTimeout(onScroll, 100);
  }

  // 9. Section 2: Luxury Editorial Sticky Showcase Controller (Bloom / Apple Style)
  const editorialSection = document.getElementById('editorialShowcaseSection');
  if (editorialSection) {
    const storyCards = editorialSection.querySelectorAll('.editorial-story-card');
    const showcaseImgs = editorialSection.querySelectorAll('.editorial-showcase-img');

    function setActiveShowcaseChapter(index) {
      storyCards.forEach((card, idx) => {
        if (idx === index) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      showcaseImgs.forEach((img, idx) => {
        if (idx === index) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    }

    // High performance IntersectionObserver to switch image and activate text story
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1.0]
    };

    let activeIndex = 0;
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(index) && index !== activeIndex) {
            activeIndex = index;
            setActiveShowcaseChapter(index);
          }
        }
      });
    }, observerOptions);

    storyCards.forEach((card) => cardObserver.observe(card));

    // Fallback scroll position scanner for instantaneous responsive response
    function checkEditorialScroll() {
      const windowHeight = window.innerHeight;
      let closestCardIndex = 0;
      let minDistance = Infinity;

      storyCards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const targetFocus = windowHeight * 0.45;
        const distance = Math.abs(center - targetFocus);

        if (distance < minDistance) {
          minDistance = distance;
          closestCardIndex = idx;
        }
      });

      if (closestCardIndex !== activeIndex) {
        activeIndex = closestCardIndex;
        setActiveShowcaseChapter(closestCardIndex);
      }
    }

    window.addEventListener('scroll', checkEditorialScroll, { passive: true });
    checkEditorialScroll();
  }

  // 10. Section 3: Featured Works Scroll-Driven Slideshow Controller (1 Box At A Time)
  const worksSection = document.getElementById('worksShowcaseSection');
  const worksTrack = document.getElementById('worksSlideshowTrack');
  const activeSlideNum = document.getElementById('activeSlideNum');
  const slideDots = document.querySelectorAll('.works-dot');
  const prevBtn = document.getElementById('worksPrevBtn');
  const nextBtn = document.getElementById('worksNextBtn');

  if (worksSection && worksTrack) {
    let worksRaf = false;
    let currentSlide = 0;
    const cards = worksTrack.querySelectorAll('.works-slide-card');
    const totalSlides = cards.length || 4;

    function getStepShift() {
      if (cards.length > 1) {
        return cards[1].offsetLeft - cards[0].offsetLeft;
      }
      return cards[0] ? cards[0].offsetWidth + 24 : 450;
    }

    function goToSlide(slideIndex, shouldScroll = false) {
      currentSlide = Math.max(0, Math.min(totalSlides - 1, slideIndex));
      
      const stepShift = getStepShift();
      const viewportEl = worksTrack.parentElement;
      const maxShift = viewportEl ? Math.max(0, worksTrack.scrollWidth - viewportEl.offsetWidth) : 0;
      
      // Shift by exactly 1 card distance per slide step, clamped to maxShift
      const targetX = -Math.min(maxShift, currentSlide * stepShift);

      worksTrack.style.transform = `translate3d(${targetX.toFixed(2)}px, 0, 0)`;

      // Update counter and dots
      if (activeSlideNum) {
        activeSlideNum.textContent = String(currentSlide + 1).padStart(2, '0');
      }

      slideDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });

      // Update card active classes & neon borders
      cards.forEach((card, idx) => {
        card.classList.toggle('active', idx === currentSlide);
      });

      // If triggered by button or dot click, scroll runway smoothly
      if (shouldScroll) {
        const rect = worksSection.getBoundingClientRect();
        const scrollDist = worksSection.offsetHeight - window.innerHeight;
        const progressSteps = [0.05, 0.35, 0.65, 0.95];
        const targetScrollTop = window.scrollY + rect.top + progressSteps[currentSlide] * scrollDist;
        window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      }
    }

    function renderWorksScroll() {
      worksRaf = false;

      // Mobile/tablet screen sizes (<= 1024px) use native touch horizontal scroll
      if (window.innerWidth <= 1024) {
        worksTrack.style.transform = 'none';
        return;
      }

      const rect = worksSection.getBoundingClientRect();
      const scrollDist = worksSection.offsetHeight - window.innerHeight;
      if (scrollDist <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / scrollDist));

      // Map progress smoothly to 4 discrete single-box slides
      let targetSlide = 0;
      if (progress >= 0.75) {
        targetSlide = 3;
      } else if (progress >= 0.48) {
        targetSlide = 2;
      } else if (progress >= 0.20) {
        targetSlide = 1;
      } else {
        targetSlide = 0;
      }

      goToSlide(targetSlide, false);
    }

    function onWorksScroll() {
      if (!worksRaf) {
        worksRaf = true;
        requestAnimationFrame(renderWorksScroll);
      }
    }

    window.addEventListener('scroll', onWorksScroll, { passive: true });
    window.addEventListener('resize', onWorksScroll, { passive: true });

    // Interactive Prev / Next arrow buttons (steps 1 box at a time)
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentSlide - 1, true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentSlide + 1, true);
      });
    }

    // Interactive dot buttons
    slideDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex, true);
        }
      });
    });

    // Card click selection
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        goToSlide(idx, true);
      });
    });

    setTimeout(renderWorksScroll, 100);
  }
});


