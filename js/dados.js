async function carregarDados() {
  try {
    // Busca o arquivo JSON com os dados de formações e cursos
    const resposta = await fetch('assets/data/cursos.json');
    const dados = await resposta.json(); // Converte a resposta em objeto

    const formacoes = document.getElementById('formacoes'); // Pega a div onde as formações vão ser colocadas

    // Para cada formação no JSON
    dados.formacoes.forEach(formacao => {
      const formacaoElemento = document.createElement('div'); // Cria um <div> pra essa formação
      formacaoElemento.classList.add('formacao'); // Adiciona uma classe CSS

      // Adiciona o nome da formação e carga horária no HTML do elemento
      formacaoElemento.innerHTML = `<h2>${formacao.nome} (${formacao.cargaHoraria})</h2>`;

      // Para cada curso dentro dessa formação
      formacao.cursos.forEach(curso => {
        const cursoElemento = document.createElement('div'); // Cria um <div> pro curso
        cursoElemento.classList.add('curso'); // Classe CSS

        // Preenche o HTML do curso com os dados disponíveis
        cursoElemento.innerHTML = `
          <p><strong>${curso.nome}</strong><br>
          Instituição: ${curso.instituicao}<br>
          ${curso.cargaHoraria ? `Carga horária: ${curso.cargaHoraria}<br>` : ''}
          ${curso.conclusao ? `Concluído em: ${curso.conclusao}<br>` : ''}
          </p>
        `;

        // Adiciona esse curso dentro da formação
        formacaoElemento.appendChild(cursoElemento);
      });

      // Adiciona a formação inteira no DOM
      formacoes.appendChild(formacaoElemento);
    });

    const cursosIndepDiv = document.getElementById('cursosIndependentes'); // Onde os cursos independentes serão exibidos

    // Função auxiliar pra converter datas (dia-mes-ano ou mes-ano) em objetos Date
    function parseData(dataString) {
      if (!dataString) return new Date(0); // Se não tiver data, retorna data "mínima"
      // Separando dia, mês e ano das partes
      const partes = dataString.split('-');

      // Se tiver só duas partes, indicando que tem só mês e ano, ele retorna a data com um dia padrão (01)
      if (partes.length === 2) {
        const [mes, ano] = partes;
        return new Date(`${ano}-${mes}-01`);
      }

      // Se a data estiver completa, retorna a data inteira
      if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        return new Date(`${ano}-${mes}-${dia}`);
      }
      return new Date(dataString);
    }

    // Ordena os cursos independentes por data de conclusão (mais antigos primeiro)
    dados.cursosIndependentes.sort((a, b) => {
      const dataA = parseData(a.conclusao || a["conclusão"]);
      const dataB = parseData(b.conclusao || b["conclusão"]);
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

      cursosIndepDiv.appendChild(cursoElemento); // Adiciona ao DOM
    });

  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
  }

  // ============ Projetos ============

  // Busca os dados dos projetos no JSON separado
  fetch('assets/data/projetos.json')
    .then(res => res.json()) // Converte pra objeto
    .then(data => {
      const container = document.getElementById('projetos-container'); // Onde os projetos serão exibidos

      data.projetos.forEach(projeto => {
        const div = document.createElement('div');
        div.classList.add('projeto');

        // Gera os spans com as tecnologias usadas, ordenadas por nome
        const tecnologiasHTML = projeto.tecnologias
          .sort((a, b) => a.localeCompare(b))
          .map(tecnologia => `<span class="tag-tecnologia">${tecnologia}</span>`)
          .join(' ');

        // Se tiver imagem, mostra; senão, ignora (deixa string vazia)
        const imagemHTML = projeto.imagem && projeto.imagem.trim() !== ''
          ? `<img src="${projeto.imagem}" alt="Imagem do projeto ${projeto.nome}" class="projeto-imagem">`
          : '';

        // Monta o HTML do projeto
        div.innerHTML = `
          <h2>${projeto.nome}</h2>
          ${imagemHTML}
          <p><strong>Descrição:</strong> ${projeto.descricao}</p>
          <p><strong>Tecnologias utilizadas:</strong> ${tecnologiasHTML}</p>
          <p><strong>Minhas responsabilidades:</strong> ${projeto.responsabilidades}</p>
          <p><strong>Status:</strong> ${projeto.status}</p>
          <p><a href="${projeto.link}" target="_blank" rel="noopener noreferrer">Ver projeto</a></p>
          <hr>
        `;

        container.appendChild(div); // Adiciona no DOM
      });
    })
    .catch(err => console.error('Erro ao carregar o JSON:', err));
}

// Executa a função ao carregar o script
carregarDados();
