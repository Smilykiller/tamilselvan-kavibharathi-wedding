/* ==========================================================================
   LEAD UI/UX JAVASCRIPT: LIVE COUNTDOWN, FILM-STRIP SWIPE & SCROLL REVEALS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeGate();
  initLiveCountdown();
  initScrollAnimations();
  initScratchCard();
  initPortraitShowcase();
  initVenueSwitcher();
});

/* 0. INTERACTIVE ENVELOPE / OPENING GATE UNLOCK */
function initEnvelopeGate() {
  const gate = document.getElementById('envelope-gate');
  const trigger = document.getElementById('envelope-trigger');
  if (!gate) return;

  function unlockInvitation() {
    if (gate.classList.contains('opened')) return;
    gate.classList.add('opened');
    setTimeout(() => {
      gate.style.display = 'none';
    }, 950);
  }

  if (trigger) {
    trigger.addEventListener('click', unlockInvitation);
    trigger.addEventListener('touchstart', (e) => {
      e.preventDefault();
      unlockInvitation();
    }, { passive: false });
  }

  gate.addEventListener('click', unlockInvitation);
}

/* 1. LIVE COUNTDOWN TIMER TO SUNDAY, 23RD AUGUST 2026 @ 04:30 AM */
function initLiveCountdown() {
  const targetDate = new Date('2026-08-23T04:30:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* 2. TOUCH / MOUSE DRAG HORIZONTAL FILM-STRIP GALLERY */
function initFilmstripDrag() {
  const track = document.getElementById('filmstrip-track');
  if (!track) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'default';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'default';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.8;
    track.scrollLeft = scrollLeft - walk;
  });
}

/* 3. SUBTLE INTERSECTION OBSERVER SCROLL REVEALS */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.frosted-card, .film-slide');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.75s ease-out, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* 4. GAMIFIED "SCRATCH TO REVEAL" GOLD FOIL CARD */
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const wrapper = document.getElementById('scratch-wrapper');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  let isScratching = false;
  let lastX = 0;
  let lastY = 0;
  let isRevealed = false;

  function resizeAndDrawFoil() {
    canvas.width = wrapper.clientWidth || 340;
    canvas.height = wrapper.clientHeight || 250;

    // Rich Metallic Gold Foil Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#9E7A18');
    gradient.addColorStop(0.25, '#D4AF37');
    gradient.addColorStop(0.5, '#FCEFA1');
    gradient.addColorStop(0.75, '#D4AF37');
    gradient.addColorStop(1, '#826210');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative foil border pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Embossed foil text
    ctx.fillStyle = '#4A0E17';
    ctx.font = '700 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH WITH YOUR FINGER ✨', canvas.width / 2, canvas.height / 2);
  }

  resizeAndDrawFoil();

  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(x, y) {
    if (isRevealed) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Smooth line between points
    ctx.lineWidth = 56;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
  }

  function checkRevealPercentage() {
    if (isRevealed) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 16) { // Sample every 4th pixel for speed
      if (pixels[i] < 128) {
        transparentCount++;
      }
    }

    const percentage = (transparentCount / (totalPixels / 4)) * 100;
    if (percentage > 45) {
      isRevealed = true;
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
    }
  }

  // Mouse Events
  canvas.addEventListener('mousedown', (e) => {
    isScratching = true;
    const pos = getPointerPos(e);
    lastX = pos.x;
    lastY = pos.y;
    scratch(pos.x, pos.y);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isScratching) return;
    const pos = getPointerPos(e);
    scratch(pos.x, pos.y);
  });

  window.addEventListener('mouseup', () => {
    if (isScratching) {
      isScratching = false;
      checkRevealPercentage();
    }
  });

  // Touch Events (Mobile)
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isScratching = true;
    const pos = getPointerPos(e);
    lastX = pos.x;
    lastY = pos.y;
    scratch(pos.x, pos.y);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isScratching) return;
    const pos = getPointerPos(e);
    scratch(pos.x, pos.y);
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    if (isScratching) {
      isScratching = false;
      checkRevealPercentage();
    }
  });
}

/* 5. AUTOMATIC 5-PICTURE PORTRAIT SHOWCASE WITH SMOOTH CROSS-FADE */
function initPortraitShowcase() {
  const slides = document.querySelectorAll('.portrait-slide');
  const dots = document.querySelectorAll('.portrait-dots .dot');
  if (!slides.length || !dots.length) return;

  let currentIndex = 0;
  let intervalId = null;

  function showSlide(index) {
    if (index === currentIndex && slides[index].classList.contains('active')) return;
    const oldIndex = currentIndex;

    slides.forEach((slide, i) => {
      slide.classList.remove('prev');
      if (i === oldIndex && i !== index) {
        slide.classList.add('prev');
      }
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentIndex = index;

    setTimeout(() => {
      slides[oldIndex]?.classList.remove('prev');
    }, 1900);
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startAutoPlay() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 4000); // Super smooth 4s interval with 1.8s dissolve
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        showSlide(idx);
        startAutoPlay();
      }
    });
  });

  startAutoPlay();
}

/* 6. INTERACTIVE CINEMATIC VENUE SWITCHER & CLIPBOARD COPY */
function initVenueSwitcher() {
  const tabs = document.querySelectorAll('.venue-tab');
  const cityBadge = document.getElementById('venue-city-badge');
  const datetimeEl = document.getElementById('venue-datetime');
  const nameEl = document.getElementById('venue-name');
  const addressEl = document.getElementById('venue-address');
  const highlightsEl = document.getElementById('venue-highlights');
  const gpsBtn = document.getElementById('venue-gps-btn');
  const copyBtn = document.getElementById('venue-copy-btn');
  const bgImg = document.getElementById('venue-bg-image');

  if (!tabs.length || !nameEl) return;

  const venueData = {
    reception: {
      city: 'COIMBATORE',
      datetime: '📅 SATURDAY, AUG 22, 2026 • 6:00 PM TO 9:00 PM',
      name: 'Thanganayagi Amman Kovil Arakattalai New Mandapam',
      address: 'Coimbatore, Tamil Nadu • Grand Celebration Hall',
      bgImage: '/venue_reception.png',
      highlights: [
        '✨ Royal Pillar Architecture',
        '❄️ Air-Conditioned Hall',
        '🚗 Ample Valet Parking'
      ],
      gpsUrl: 'https://maps.google.com/?q=Thanganayagi+Amman+Kovil+Arakattalai+New+Mandapam+Coimbatore',
      copyAddress: 'Thanganayagi Amman Kovil Arakattalai New Mandapam, Coimbatore, Tamil Nadu'
    },
    muhurtham: {
      city: 'TIRUPUR',
      datetime: '📅 SUNDAY, AUG 23, 2026 • 4:30 AM TO 6:00 AM',
      name: 'Arulmigu Sri Muthukumaraswamy Thirukovil',
      address: 'Tirupur, Tamil Nadu • Sacred Historic Temple Sanctum',
      bgImage: '/venue_muhurtham.png',
      highlights: [
        '🛕 Ancient Divine Gopuram',
        '🌅 Auspicious Sunrise Muhurtham',
        '🪔 Sacred Spiritual Atmosphere'
      ],
      gpsUrl: 'https://maps.google.com/?q=Arulmigu+Sri+Muthukumaraswamy+Thirukovil+Tirupur',
      copyAddress: 'Arulmigu Sri Muthukumaraswamy Thirukovil, Tirupur, Tamil Nadu'
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const venueKey = tab.getAttribute('data-venue');
      const data = venueData[venueKey];
      if (!data) return;

      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      if (bgImg && data.bgImage) {
        bgImg.style.opacity = '0';
        setTimeout(() => {
          bgImg.src = data.bgImage;
          bgImg.style.opacity = '0.9';
        }, 220);
      }

      if (cityBadge) cityBadge.textContent = data.city;
      if (datetimeEl) datetimeEl.textContent = data.datetime;
      if (nameEl) nameEl.textContent = data.name;
      if (addressEl) addressEl.textContent = data.address;

      if (highlightsEl) {
        highlightsEl.innerHTML = data.highlights
          .map((h) => `<span class="highlight-pill">${h}</span>`)
          .join('');
      }

      if (gpsBtn) gpsBtn.href = data.gpsUrl;
      if (copyBtn) {
        copyBtn.setAttribute('data-address', data.copyAddress);
        copyBtn.innerHTML = '<span>📋 COPY ADDRESS</span>';
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const addr = copyBtn.getAttribute('data-address') || '';
      navigator.clipboard?.writeText(addr).then(() => {
        copyBtn.innerHTML = '<span>✅ ADDRESS COPIED!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<span>📋 COPY ADDRESS</span>';
        }, 2500);
      }).catch(() => {
        copyBtn.innerHTML = '<span>✅ COPIED TO CLIPBOARD!</span>';
      });
    });
  }
}

