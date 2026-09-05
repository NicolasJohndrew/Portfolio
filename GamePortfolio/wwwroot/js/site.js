(() => {
  const setPointer = (event) => {
    document.documentElement.style.setProperty(
      '--pointer-x',
      `${event.clientX}px`
    );

    document.documentElement.style.setProperty(
      '--pointer-y',
      `${event.clientY}px`
    );
  };

  window.addEventListener('pointermove', setPointer, {
    passive: true
  });

  const reveal = () => {
    document
      .querySelectorAll('.reveal:not(.is-visible)')
      .forEach((item) => {
        item.classList.add('is-visible');
      });
  };

  // Run once for anything already rendered
  reveal();

  // Blazor renders components after the initial HTML loads,
  // so watch for newly rendered elements.
  const app = document.getElementById('app');

  if (app) {
    const observer = new MutationObserver(() => {
      reveal();
    });

    observer.observe(app, {
      childList: true,
      subtree: true
    });
  }
})();