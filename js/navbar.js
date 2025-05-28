document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__lista');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  document.addEventListener('click', (event) => {
    const isClickInside = menu.contains(event.target) || toggle.contains(event.target);
    if (!isClickInside) {
      menu.classList.remove('active');
    }
  });

  const sections = document.querySelectorAll('section[id], footer[id]');
  const links = document.querySelectorAll('.navbar__lista li a');

function highlightCurrentSection() {
  const scrollY = window.scrollY;
  const pageBottom = scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    const inView = scrollY >= sectionTop && scrollY < sectionTop + sectionHeight;
    const atBottom = sectionId === 'footer' && pageBottom >= documentHeight - 10;

    if (inView || atBottom) {
      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

  window.addEventListener('scroll', highlightCurrentSection);
  highlightCurrentSection(); 

  links.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
  });
});

});
