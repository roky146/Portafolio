document.querySelector(".menu-btn").addEventListener("click", () => {
  document.querySelector(".nav-menu").classList.toggle("show");
});

// Animaciones con ScrollReveal
ScrollReveal().reveal('.showcase', { 
  delay: 200,
  distance: '60px',
  origin: 'bottom',
  duration: 1000
});

ScrollReveal().reveal('.news-cards > div', { 
  delay: 300,
  distance: '40px',
  origin: 'bottom',
  interval: 200,
  duration: 800
});

ScrollReveal().reveal('.cards-banner-one', { 
  delay: 400,
  distance: '60px',
  origin: 'left',
  duration: 1000
});

ScrollReveal().reveal('.cards-banner-two', { 
  delay: 400,
  distance: '60px',
  origin: 'right',
  duration: 1000
});

// Agregar clase flotante a elementos importantes
document.querySelectorAll('.news-cards > div').forEach((card, index) => {
  setTimeout(() => {
    card.classList.add('floating');
  }, index * 200);
});