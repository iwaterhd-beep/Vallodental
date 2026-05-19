// ─── CURSOR PERSONALIZADO ────────────────────────────────────
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// ─── NAV SCROLL ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── REVEAL ON SCROLL ────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── FORMULARIO — MAILTO FALLBACK ────────────────────────────
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', e => {
  e.preventDefault();
  const nombre  = form.nombre.value.trim();
  const clinica = form.clinica.value.trim();
  const email   = form.email.value.trim();
  const tel     = form.telefono.value.trim();
  const serv    = form.servicio.value.trim();
  const msg     = form.mensaje.value.trim();

  if (!nombre || !email) {
    formStatus.style.color = '#e05555';
    formStatus.textContent = 'Por favor, rellena nombre y email.';
    return;
  }

  const body = encodeURIComponent(
    `Nombre: ${nombre}\nClínica: ${clinica}\nTeléfono: ${tel}\nServicio: ${serv}\n\n${msg}`
  );
  const subject = encodeURIComponent(`Consulta web — ${nombre}`);
  window.location.href = `mailto:avrprotesicodental@gmail.com?subject=${subject}&body=${body}`;

  formStatus.style.color = '#c9a96e';
  formStatus.textContent = '¡Gracias! Se abrirá tu cliente de correo para enviar el mensaje.';
  form.reset();
});

// ─── LIGHTBOX GALERÍA ────────────────────────────────────────
const labMainItem = document.querySelector('.gallery-lab-main');
const protesisMainItem = document.querySelector('.gallery-protesis-main');
const labLightbox = document.getElementById('labLightbox');
const labLightboxImage = document.getElementById('labLightboxImage');
const labLightboxClose = document.getElementById('labLightboxClose');
const labLightboxPrev = document.getElementById('labLightboxPrev');
const labLightboxNext = document.getElementById('labLightboxNext');

const labImages = [
  './assets/lab-1.png',
  './assets/lab-2.png',
  './assets/lab-3.png'
];
let currentLabImageIndex = 0;
let activeGalleryImages = labImages;

const protesisImages = [
  './assets/protesis-1.png',
  './assets/protesis-2.png',
  './assets/protesis-3.png',
  './assets/protesis-4.png',
  './assets/protesis-5.png',
  './assets/protesis-6.png'
];

function resolveAssetUrl(src) {
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

/** Puts the clicked thumbnail first, then the rest of the gallery without duplicates. */
function orderedGalleryWithClickedFirst(clickedSrc, gallery) {
  const list = [...gallery];
  if (!clickedSrc) return list;
  const clickedResolved = resolveAssetUrl(clickedSrc);
  let matchIndex = -1;
  for (let i = 0; i < list.length; i++) {
    if (resolveAssetUrl(list[i]) === clickedResolved) {
      matchIndex = i;
      break;
    }
  }
  if (matchIndex === -1) {
    return [clickedSrc, ...list];
  }
  return [...list.slice(matchIndex), ...list.slice(0, matchIndex)];
}

function showLabImage(index) {
  if (!activeGalleryImages.length) return;
  currentLabImageIndex = (index + activeGalleryImages.length) % activeGalleryImages.length;
  labLightboxImage.src = activeGalleryImages[currentLabImageIndex];
}

function openLabLightbox(startIndex, images = labImages) {
  activeGalleryImages = images.length ? images : labImages;
  showLabImage(startIndex);
  labLightbox.classList.add('active');
  labLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLabLightbox() {
  labLightbox.classList.remove('active');
  labLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (
  labMainItem &&
  labLightbox &&
  labLightboxImage &&
  labLightboxClose &&
  labLightboxPrev &&
  labLightboxNext
) {
  if (labMainItem) {
    labMainItem.addEventListener('click', () => openLabLightbox(0, labImages));
  }
  if (protesisMainItem) {
    protesisMainItem.addEventListener('click', () => {
      const thumb = protesisMainItem.querySelector('img');
      const clickedSrc = thumb ? thumb.currentSrc || thumb.src : '';
      const ordered = orderedGalleryWithClickedFirst(clickedSrc, protesisImages);
      openLabLightbox(0, ordered);
    });
  }
  labLightboxClose.addEventListener('click', closeLabLightbox);
  labLightboxPrev.addEventListener('click', () => showLabImage(currentLabImageIndex - 1));
  labLightboxNext.addEventListener('click', () => showLabImage(currentLabImageIndex + 1));

  labLightbox.addEventListener('click', e => {
    if (e.target === labLightbox) closeLabLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!labLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLabLightbox();
    if (e.key === 'ArrowLeft') showLabImage(currentLabImageIndex - 1);
    if (e.key === 'ArrowRight') showLabImage(currentLabImageIndex + 1);
  });
}

// ─── HERO — texto que baja al hacer scroll ────────────────────
(function heroTextFollowScroll() {
  const hero = document.getElementById('hero');
  const heroLeft = document.querySelector('.hero-left');
  if (!hero || !heroLeft) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function updateHeroShift() {
    const rect = hero.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
      heroLeft.style.transform = '';
      return;
    }
    const scrolledPast = Math.max(0, -rect.top);
    const rate = 0.72;
    const maxShift = 320;
    const shift = Math.min(maxShift, scrolledPast * rate);
    heroLeft.style.transform = `translate3d(0, ${shift}px, 0)`;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateHeroShift();
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateHeroShift);
  updateHeroShift();
})();
