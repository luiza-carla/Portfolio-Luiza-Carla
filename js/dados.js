async function carregarDados() {
  try {
    const resposta = await fetch('assets/data/cursos.json');
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

      formacaoElemento.innerHTML = `
        <div class="formacao-top">
          <h2>${formacao.nome}</h2>
          <div class="formacao-meta">
            <span>${formacao.cargaHoraria || ""}</span>
            <span>${qtd} curso(s)</span>
          </div>
        </div>

        <details class="formacao-details">
          <summary>Ver módulos</summary>
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
              Instituição: ${curso.instituicao}<br>
              ${curso.cargaHoraria ? `Carga horária: ${curso.cargaHoraria}<br>` : ''}
              ${curso.conclusao ? `Concluído em: ${curso.conclusao}<br>` : ''}
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
          ? "Mostrar menos"
          : `Ver mais cursos (${cursosOrdenados.length - LIMITE})`;

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
  fetch('assets/data/projetos.json')
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

        const imagemHTML =
          projeto.imagem && projeto.imagem.trim() !== ''
            ? `<img src="${projeto.imagem}" alt="Imagem do projeto ${projeto.nome}" class="projeto-imagem">`
            : '';

        div.innerHTML = `
          <h2>${projeto.nome}</h2>
          ${imagemHTML}
          <p><strong>Descrição:</strong> ${projeto.descricao}</p>
          <p><strong>Tecnologias utilizadas:</strong> ${tecnologiasHTML}</p>
          <p><strong>Minhas responsabilidades:</strong> ${projeto.responsabilidades}</p>
          <p><strong>Status:</strong> ${projeto.status}</p>
          <p>
            <a href="${projeto.link}" target="_blank" rel="noopener noreferrer">
              Ver projeto
            </a>
          </p>
          <hr>
        `;

        container.appendChild(div);
      });
    })
    .catch(err => console.error('Erro ao carregar o JSON:', err));

  // Busca os dados das experiências
  fetch('assets/data/experiencias.json')
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
