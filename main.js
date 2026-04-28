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
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_ChatGPT_Image_28_abr_2026__21_48_07-66dca1b9-38b2-475c-b9af-bd589b2095e5.png',
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_ChatGPT_Image_28_abr_2026__22_04_46-bbb9db3a-ba7d-42fc-8533-50319eb2a060.png',
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_ChatGPT_Image_28_abr_2026__21_43_00-47839a83-fc38-4ac6-804c-87acfc36f775.png'
];
let currentLabImageIndex = 0;
let activeGalleryImages = labImages;

const protesisImages = [
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_IMG_E8667-984e42ca-e75e-463d-9566-726066388206.png',
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_IMG_E8668-191f084b-6ad9-4aa4-9f4a-a06b682c8329.png',
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_IMG_8673-4e36a020-2363-4276-bf06-38615bed86af.png',
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_IMG_E8665-11eb891c-3501-40ed-a30c-ec8b7b03fb35.png',
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_IMG_8675-af9fe16f-2b54-4aef-8cb8-5ed92a37a81e.png',
  'file:///C:/Users/PC/.cursor/projects/c-Users-PC-Desktop-files/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_47f34203cd3ca9fa32f2f09f88665887_images_IMG_8674-7e4e13ef-168a-4995-8fcf-e5bf32824bdf.png'
];

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
    protesisMainItem.addEventListener('click', () => openLabLightbox(0, protesisImages));
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
