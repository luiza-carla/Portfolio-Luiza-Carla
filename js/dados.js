let idioma =
  localStorage.getItem("idioma") ||
  (navigator.language.startsWith("pt") ? "pt" : "en");

const i18nDynamic = {
  pt: {
    view_modules: "Ver módulos",
    courses_singular: "curso",
    courses_plural: "cursos",
    institution: "Instituição",
    workload: "Carga horária",
    completed_in: "Concluído em",
    show_less: "Mostrar menos",
    show_more: "Ver mais cursos",
    description: "Descrição",
    technologies: "Tecnologias utilizadas",
    responsibilities: "Minhas responsabilidades",
    status: "Status",
    view_project: "Ver projeto"
  },
  en: {
    view_modules: "View modules",
    courses_singular: "course",
    courses_plural: "courses",
    institution: "Institution",
    workload: "Workload",
    completed_in: "Completed in",
    show_less: "Show less",
    show_more: "See more courses",
    description: "Description",
    technologies: "Technologies used",
    responsibilities: "My responsibilities",
    status: "Status",
    view_project: "View project"
  }
};

function t(key) {
  const dict = i18nDynamic[idioma] || i18nDynamic.pt;
  return dict[key] || key;
}

async function carregarDados() {
  try {
    document.getElementById("projetos-container").innerHTML = "";
    document.getElementById("experiencias-container").innerHTML = "";
    document.getElementById("formacoes").innerHTML = "";
    document.getElementById("cursosIndependentes").innerHTML = "";
    const resposta = await fetch(`assets/data/cursos.${idioma}.json`);
    const dados = await resposta.json();

    const formacoes = document.getElementById('formacoes');
    const cursosIndepDiv = document.getElementById('cursosIndependentes');
    // Função auxiliar para converter datas
    function parseData(dataString) {
      if (!dataString) return new Date(0);

      const partes = String(dataString).split('-');

      if (partes.length === 2) {
        const [mes, ano] = partes;
        return new Date(`${ano}-${mes}-01`);
      }

      if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        return new Date(`${ano}-${mes}-${dia}`);
      }

      return new Date(dataString);
    }

    function formatarData(dataString) {
      if (!dataString) return "";
      const partes = String(dataString).split('-');

      if (partes.length === 2) {
        const [mes, ano] = partes;
        return `${mes}/${ano}`;
      }
      if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        return `${dia}/${mes}/${ano}`;
      }
      return String(dataString);
    }

    function linhaMeta({ instituicao, cargaHoraria, conclusao }) {
      const pedacos = [];
      if (instituicao) pedacos.push(instituicao);
      if (cargaHoraria) pedacos.push(cargaHoraria);
      if (conclusao) pedacos.push(formatarData(conclusao));
      return pedacos.join(" • ");
    }

    formacoes.innerHTML = "";
    (dados.formacoes || []).forEach((formacao) => {
      const formacaoElemento = document.createElement("div");
      formacaoElemento.classList.add("formacao");

      const qtd = Array.isArray(formacao.cursos) ? formacao.cursos.length : 0;
      const cursosLabel = qtd === 1 ? t("courses_singular") : t("courses_plural");

      formacaoElemento.innerHTML = `
        <div class="formacao-top">
          <h2>${formacao.nome}</h2>
          <div class="formacao-meta">
            <span>${formacao.cargaHoraria || ""}</span>
            <span>${qtd} ${cursosLabel}</span>
          </div>
        </div>

        <details class="formacao-details">
          <summary>${t("view_modules")}</summary>
          <div class="formacao-lista"></div>
        </details>
      `;

      const lista = formacaoElemento.querySelector(".formacao-lista");

      (formacao.cursos || []).forEach((curso) => {
        const cursoElemento = document.createElement("div");
        cursoElemento.classList.add("curso");

        cursoElemento.innerHTML = `
          <strong>${curso.nome}</strong>
          <div class="curso-linha">${linhaMeta(curso)}</div>
        `;

        lista.appendChild(cursoElemento);
      });

      formacoes.appendChild(formacaoElemento);
    });

    const allDetails = formacoes.querySelectorAll(".formacao-details");
    allDetails.forEach((det) => {
      det.addEventListener("toggle", () => {
        if (!det.open) return;
        allDetails.forEach((other) => {
          if (other !== det) other.removeAttribute("open");
        });
      });
    });

    cursosIndepDiv.innerHTML = "";

    const cursosOrdenados = [...(dados.cursosIndependentes || [])].sort((a, b) => {
      const dataA = parseData(a.conclusao || a["conclusão"]);
      const dataB = parseData(b.conclusao || b["conclusão"]);
      return dataB - dataA;
    });

    const LIMITE = 6;
    let mostrandoTodos = false;

    function renderCursos() {
      cursosIndepDiv.innerHTML = "";

      const lista = mostrandoTodos ? cursosOrdenados : cursosOrdenados.slice(0, LIMITE);

      lista.forEach((curso) => {
        const cursoElemento = document.createElement("div");
        cursoElemento.classList.add("curso-independente");

    cursoElemento.innerHTML = `
            <h3>${curso.nome}</h3>
            <p>
              ${t("institution")}: ${curso.instituicao}<br>
              ${curso.cargaHoraria ? `${t("workload")}: ${curso.cargaHoraria}<br>` : ''}
              ${curso.conclusao ? `${t("completed_in")}: ${curso.conclusao}<br>` : ''}
            </p>
          `;

        cursosIndepDiv.appendChild(cursoElemento);
      });

      const wrapExistente = document.querySelector(".cursos-toggle-wrap");
      if (wrapExistente) wrapExistente.remove();

      if (cursosOrdenados.length > LIMITE) {
        const wrap = document.createElement("div");
        wrap.className = "cursos-toggle-wrap";

        const btn = document.createElement("button");
        btn.className = "cursos-toggle-btn";
        btn.type = "button";
        btn.textContent = mostrandoTodos
          ? t("show_less")
          : `${t("show_more")} (${cursosOrdenados.length - LIMITE})`;

        btn.addEventListener("click", () => {
          mostrandoTodos = !mostrandoTodos;
          renderCursos();
        });

        wrap.appendChild(btn);

        const sectionCursos = document.getElementById("cursos");
        sectionCursos.appendChild(wrap);
      }
    }

    renderCursos();
  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
  }

  // Busca os dados dos projetos
  fetch(`assets/data/projetos.${idioma}.json`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('projetos-container');

      data.projetos.forEach(projeto => {
        const div = document.createElement('div');
        div.classList.add('projeto');

        const tecnologiasHTML = projeto.tecnologias
          .sort((a, b) => a.localeCompare(b))
          .map(tecnologia => `<span class="tag-tecnologia">${tecnologia}</span>`)
          .join(' ');

        let imagens = [];

        if (Array.isArray(projeto.imagens)) {
          imagens = projeto.imagens;
        } else if (projeto.imagem) {
          imagens = [projeto.imagem];
        }

        let imagemHTML = "";

        if (imagens.length === 1) {
          imagemHTML = `
            <img src="${imagens[0]}" 
            alt="Imagem do projeto ${projeto.nome}" 
            class="projeto-imagem">
          `;
        }

        if (imagens.length > 1) {
          const id = "carousel-" + Math.random().toString(36).slice(2);

          const dotsHTML = imagens
            .map(
              (_, i) =>
                `<button type="button" class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Slide ${
                  i + 1
                }" data-index="${i}"></button>`
            )
            .join('');

          imagemHTML = `
            <div class="carousel" id="${id}">
              <div class="carousel-inner">
                <img src="${imagens[0]}" alt="Imagem do projeto ${projeto.nome}">
              </div>
              <div class="carousel-controls">
                <button class="carousel-btn prev"><span><</span></button>
                <div class="carousel-dots">
                  ${dotsHTML}
                </div>
                <button class="carousel-btn next"><span>></span></button>
              </div>
            </div>
          `;

          setTimeout(() => {
            const carousel = document.getElementById(id);
            const img = carousel.querySelector('img');
            const prev = carousel.querySelector('.prev');
            const next = carousel.querySelector('.next');
            const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));

            let index = 0;

            const setSlide = (newIndex) => {
              index = newIndex;
              img.src = imagens[index];
              dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            };

            prev.onclick = () => setSlide((index - 1 + imagens.length) % imagens.length);
            next.onclick = () => setSlide((index + 1) % imagens.length);
            dots.forEach((dot) => {
              dot.addEventListener('click', () => setSlide(Number(dot.dataset.index)));
            });

            let touchStartX = 0;
            let isTouching = false;

            const onTouchStart = (event) => {
              if (event.touches.length !== 1) return;
              touchStartX = event.touches[0].clientX;
              isTouching = true;
            };

            const onTouchEnd = (event) => {
              if (!isTouching) return;
              isTouching = false;

              const touchEndX = (event.changedTouches && event.changedTouches[0]?.clientX) || 0;
              const delta = touchEndX - touchStartX;
              const THRESHOLD = 40;

              if (Math.abs(delta) < THRESHOLD) return;
              if (delta > 0) {
                setSlide((index - 1 + imagens.length) % imagens.length);
              } else {
                setSlide((index + 1) % imagens.length);
              }
            };

            carousel.addEventListener('touchstart', onTouchStart, { passive: true });
            carousel.addEventListener('touchend', onTouchEnd);
          });
        }

        div.innerHTML = `
          <h2>${projeto.nome}</h2>
          ${imagemHTML}
          <p><strong>${t("description")}:</strong> ${projeto.descricao}</p>
          <p><strong>${t("technologies")}:</strong> ${tecnologiasHTML}</p>
          <p><strong>${t("responsibilities")}:</strong> ${projeto.responsabilidades}</p>
          <p><strong>${t("status")}:</strong> ${projeto.status}</p>
          <p>
            <a href="${projeto.link}" target="_blank" rel="noopener noreferrer">
              ${t("view_project")}
            </a>
          </p>
          <hr>
        `;

        container.appendChild(div);
      });
    })
    .catch(err => console.error('Erro ao carregar o JSON:', err));

  // Busca os dados das experiências
  fetch(`assets/data/experiencias.${idioma}.json`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('experiencias-container');
      container.innerHTML = '';
      const uniqueSorted = (arr = []) =>
        [...new Set(arr.map(t => String(t).trim()).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b, 'pt-BR'));

      data.experiencias.forEach(exp => {
        const div = document.createElement('div');
        div.classList.add('experiencia-card');

        const tagsHTML = uniqueSorted(exp.tags)
          .map(tag => `<span class="tag-tecnologia">${tag}</span>`)
          .join(' ');

        const destaquesHTML = (exp.destaques && exp.destaques.length)
          ? `<ul class="experiencia-destaques">
              ${exp.destaques.map(item => `<li>${item}</li>`).join('')}
            </ul>`
          : '';
        div.innerHTML = `
          <h2>${exp.cargo}</h2>

          <div class="experiencia-local">
            <span class="experiencia-empresa">${exp.empresa}</span>
            <span class="experiencia-periodo">${exp.periodo}</span>
          </div>

          <p class="experiencia-descricao">${exp.descricao || ''}</p>
          ${destaquesHTML}

          <div class="experiencia-tags">
            ${tagsHTML}
          </div>
        `;

        container.appendChild(div);
      });
    })
    .catch(err => console.error('Erro ao carregar experiências:', err));
}

// Executa a função ao carregar o script
carregarDados();
