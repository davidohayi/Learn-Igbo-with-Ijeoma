document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) {
    console.error('Header element not found!');
    return;
  }

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 9) {
      // At the top — show navbar
      header.classList.remove('nav-hidden');
    } else {
      // Anywhere else — hide navbar
      header.classList.add('nav-hidden');
    }

    lastScrollY = currentScrollY;
  });
});