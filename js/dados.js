async function carregarDados() {
  try {
    // Busca o arquivo JSON com os dados de formações e cursos
    const resposta = await fetch('assets/data/cursos.json');
    const dados = await resposta.json();

    const formacoes = document.getElementById('formacoes');

    // Para cada formação no JSON
    dados.formacoes.forEach(formacao => {
      const formacaoElemento = document.createElement('div');
      formacaoElemento.classList.add('formacao');

      formacaoElemento.innerHTML = `
        <h2>${formacao.nome} (${formacao.cargaHoraria})</h2>
      `;

      // Para cada curso dentro da formação
      formacao.cursos.forEach(curso => {
        const cursoElemento = document.createElement('div');
        cursoElemento.classList.add('curso');

        cursoElemento.innerHTML = `
          <p>
            <strong>${curso.nome}</strong><br>
            Instituição: ${curso.instituicao}<br>
            ${curso.cargaHoraria ? `Carga horária: ${curso.cargaHoraria}<br>` : ''}
            ${curso.conclusao ? `Concluído em: ${curso.conclusao}<br>` : ''}
          </p>
        `;

        formacaoElemento.appendChild(cursoElemento);
      });

      formacoes.appendChild(formacaoElemento);
    });

    const cursosIndepDiv = document.getElementById('cursosIndependentes');

    // Função auxiliar para converter datas
    function parseData(dataString) {
      if (!dataString) return new Date(0);

      const partes = dataString.split('-');

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

    // Ordena cursos independentes por data
    dados.cursosIndependentes.sort((a, b) => {
      const dataA = parseData(a.conclusao || a['conclusão']);
      const dataB = parseData(b.conclusao || b['conclusão']);
      return dataA - dataB;
    });

    // Cria os elementos dos cursos independentes
    dados.cursosIndependentes.forEach(curso => {
      const cursoElemento = document.createElement('div');
      cursoElemento.classList.add('curso-independente');

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

      data.experiencias.forEach(exp => {
        const div = document.createElement('div');
        div.classList.add('experiencia-card');

        const tagsHTML = exp.tags
          .sort((a, b) => a.localeCompare(b))
          .map(tag => `<span class="tag-tecnologia">${tag}</span>`)
          .join(' ');

        div.innerHTML = `
          <h2>${exp.cargo}</h2>

          <div class="experiencia-local">
            <span class="experiencia-empresa">${exp.empresa}</span>
            <span class="experiencia-periodo">${exp.periodo}</span>
          </div>

          <p>${exp.descricao}</p>

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
