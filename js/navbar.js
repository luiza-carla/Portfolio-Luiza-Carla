document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.navbar__toggle'); // Botão de abrir/fechar o menu
  const menu = document.querySelector('.navbar__lista');    // Menu de navegação

  // Quando o botão for clicado, alterna a visibilidade do menu
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  // Fecha o menu se clicar fora dele ou fora do botão
  document.addEventListener('click', (event) => {
    const isClickInside = menu.contains(event.target) || toggle.contains(event.target);
    if (!isClickInside) {
      menu.classList.remove('active');
    }
  });

  // Pega todas as seções com ID (inclui o footer)
  const sections = document.querySelectorAll('section[id], footer[id]');
  const links = document.querySelectorAll('.navbar__lista li a'); // Links da navbar

  // Função que destaca o link da seção atual
  function highlightCurrentSection() {
  const scrollPosition = window.scrollY; // Quantidade que a página foi rolada verticalmente
  const viewportBottom = scrollPosition + window.innerHeight; // Ponto final da janela visível
  const totalPageHeight = document.documentElement.scrollHeight; // Altura total da página

  sections.forEach(section => {
    const sectionOffsetTop = section.offsetTop - 100; // Posição do topo da seção, com um pequeno ajuste pra ativar antes
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id'); // pegando o ID da seção

    // Verifica se a seção está atualmente visível na janela
    const isSectionInView = scrollPosition >= sectionOffsetTop && scrollPosition < sectionOffsetTop + sectionHeight;

    // Verifica se a rolagem chegou perto do final da página (para ativar o link do rodapé)
    const isFooterAtBottom = sectionId === 'footer' && viewportBottom >= totalPageHeight - 10;

    if (isSectionInView || isFooterAtBottom) {
      // Para cada link do menu, remove a classe 'active' e adiciona só no link da seção atual
      links.forEach(link => {
        link.classList.remove('active');

        const linkHref = link.getAttribute('href'); // ex: "#sobre"
        const matchesCurrentSection = linkHref === `#${sectionId}`;

        if (matchesCurrentSection) {
          link.classList.add('active');
        }
      });
    }
  });
}

  // Chama a função toda vez que a página rolar
  window.addEventListener('scroll', highlightCurrentSection);
  highlightCurrentSection(); // Também chama uma vez ao carregar a página

  // Fecha o menu se um link da navbar for clicado (pra mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
});
