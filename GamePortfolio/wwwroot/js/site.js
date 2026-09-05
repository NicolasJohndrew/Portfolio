(() => {
  const setPointer = (event) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
  };

  window.addEventListener('pointermove', setPointer, { passive: true });

  const reveal = () => {
    const items = document.querySelectorAll('.reveal');
    items.forEach((item) => item.classList.add('is-visible'));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reveal, { once: true });
  } else {
    reveal();
  }
})();
