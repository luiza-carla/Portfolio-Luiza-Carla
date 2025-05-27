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