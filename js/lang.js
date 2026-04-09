const langButtons = document.querySelectorAll(".lang-option");

const i18n = {
  pt: {
    site_title: "Portfólio - Luiza Carla",
    menu_toggle: "Abrir menu",
    theme_neutral: "Modo neutro",
    theme_pink: "Modo rosa",
    nav_inicio: "Início",
    nav_habilidades: "Habilidades",
    nav_experiencias: "Experiências",
    nav_projetos: "Projetos",
    nav_cursos: "Certificados",
    nav_contato: "Contato",
    hero_role: "Desenvolvedora Full Stack",
    hero_intro:
      "Desenvolvendo sistemas web e APIs com foco em organização, confiabilidade e evolução contínua de software.",
    bio_1:
      "Desenvolvedora formada em <strong>Análise e Desenvolvimento de Sistemas pela FATEC Praia Grande</strong>, com experiência prática na construção e evolução de aplicações web.",
    bio_2:
      "A minha última experiência foi como <strong>Desenvolvedora Júnior no Recicla Lead CRM</strong>, onde contribuí no desenvolvimento e manutenção do sistema, participando da implementação de novas funcionalidades e da melhoria contínua da aplicação.",
    btn_download_cv: "Baixar currículo",
    skills_title: "Habilidades",
    skills_tech: "Tecnologias",
    skills_langs: "Idiomas",
    lang_english: "Inglês",
    lang_level: "Intermediário / Avançado",
    btn_download_cert: "Baixar certificado",
    exp_title: "Experiências",
    projects_title: "Projetos",
    education_title: "Formações",
    courses_title: "Cursos",
    contact_title: "Contato",
    contact_subtitle: "Vamos conversar?",
    contact_subject: "Novo contato do portfólio!",
    label_name: "Nome",
    placeholder_name: "Nome",
    label_email: "E-mail",
    placeholder_email: "E-mail",
    label_message: "Mensagem",
    placeholder_message: "Mensagem",
    btn_send_message: "Enviar mensagem",
    footer_rights: "© 2026 Luiza Carla. Todos os direitos reservados."
  },
  en: {
    site_title: "Portfolio - Luiza Carla",
    menu_toggle: "Open menu",
    theme_neutral: "Neutral mode",
    theme_pink: "Pink mode",
    nav_inicio: "Home",
    nav_habilidades: "Skills",
    nav_experiencias: "Experience",
    nav_projetos: "Projects",
    nav_cursos: "Certificates",
    nav_contato: "Contact",
    hero_role: "Full Stack Developer",
    hero_intro:
      "Building web systems and APIs with a focus on organization, reliability, and continuous software evolution.",
    bio_1:
      "Developer graduated in <strong>Systems Analysis and Development at FATEC Praia Grande</strong>, with hands-on experience in building and evolving web applications.",
    bio_2:
      "My latest experience was as a <strong>Junior Developer at Recicla Lead CRM</strong>, where I contributed to system development and maintenance, implementing new features and continuously improving the application.",
    btn_download_cv: "Download resume",
    skills_title: "Skills",
    skills_tech: "Technologies",
    skills_langs: "Languages",
    lang_english: "English",
    lang_level: "Intermediate / Advanced",
    btn_download_cert: "Download certificate",
    exp_title: "Experience",
    projects_title: "Projects",
    education_title: "Education",
    courses_title: "Courses",
    contact_title: "Contact",
    contact_subtitle: "Let's talk?",
    contact_subject: "New portfolio contact!",
    label_name: "Name",
    placeholder_name: "Name",
    label_email: "Email",
    placeholder_email: "Email",
    label_message: "Message",
    placeholder_message: "Message",
    btn_send_message: "Send message",
    footer_rights: "© 2026 Luiza Carla. All rights reserved."
  }
};

function atualizarBotoesIdioma() {
  langButtons.forEach((button) => {
    const selected = button.dataset.lang === idioma;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function atualizarCurriculo() {
  const link = document.getElementById("download-cv");
  if (!link) return;

  if (idioma === "en") {
    link.href = "./assets/pdf/ResumeLuizaCarla.pdf";
    link.download = "ResumeLuizaCarla.pdf";
  } else {
    link.href = "./assets/pdf/CurriculoLuizaCarla.pdf";
    link.download = "CurriculoLuizaCarla.pdf";
  }
}

function aplicarTraducoes() {
  const lang = i18n[idioma] ? idioma : "pt";
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = i18n[lang][key] ?? i18n.pt[key];
    if (value == null) return;
    el.innerHTML = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = i18n[lang][key] ?? i18n.pt[key];
    if (value == null) return;
    el.setAttribute("placeholder", value);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    const value = i18n[lang][key] ?? i18n.pt[key];
    if (value == null) return;
    el.setAttribute("aria-label", value);
  });

  document.querySelectorAll("[data-i18n-value]").forEach((el) => {
    const key = el.getAttribute("data-i18n-value");
    const value = i18n[lang][key] ?? i18n.pt[key];
    if (value == null) return;
    el.setAttribute("value", value);
  });

  const title = document.querySelector("title[data-i18n-title]");
  if (title) {
    const key = title.getAttribute("data-i18n-title");
    if (i18n[lang][key]) title.textContent = i18n[lang][key];
  }

  const themeButton = document.querySelector(".navbar__theme");
  if (themeButton) {
    const isNeutral = document.body.classList.contains("theme-neutral");
    themeButton.textContent = isNeutral ? i18n[lang].theme_pink : i18n[lang].theme_neutral;
  }

  atualizarCurriculo();
}

function atualizarIdioma(novoIdioma) {
  if (!novoIdioma || idioma === novoIdioma) return;

  idioma = novoIdioma;
  localStorage.setItem("idioma", idioma);
  atualizarBotoesIdioma();
  aplicarTraducoes();
  carregarDados();
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    atualizarIdioma(button.dataset.lang);
  });
});

atualizarBotoesIdioma();
aplicarTraducoes();
