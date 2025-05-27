async function carregarDados() {
  try {
    const resposta = await fetch('../cursos.json');
    const dados = await resposta.json();

    const formacoes = document.getElementById('formacoes');
    dados.formacoes.forEach(formacao => {
      const formacaoElemento = document.createElement('div');
      formacaoElemento.classList.add('formacao');

      formacaoElemento.innerHTML = `<h2>${formacao.nome} (${formacao.cargaHoraria})</h2>`;

      formacao.cursos.forEach(curso => {
        const cursoElemento = document.createElement('div');
        cursoElemento.classList.add('curso');

        cursoElemento.innerHTML = `
          <p><strong>${curso.nome}</strong><br>
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

dados.cursosIndependentes.sort((a, b) => {
  const dataA = parseData(a.conclusao || a["conclusão"]);
  const dataB = parseData(b.conclusao || b["conclusão"]);
  return dataA - dataB;
});


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

  //projetos
fetch('../projetos.json')
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

      div.innerHTML = `
        <h2>${projeto.nome}</h2>
        <img src="${projeto.imagem}" alt="Imagem do projeto ${projeto.nome}" class="projeto-imagem">
        <p><strong>Descrição:</strong> ${projeto.descricao}</p>
        <p><strong>Tecnologias utilizadas:</strong> ${tecnologiasHTML}</p>
        <p><strong>Minhas responsabilidades:</strong> ${projeto.responsabilidades}</p>
        <p><strong>Status:</strong> ${projeto.status}</p>
        <p><a href="${projeto.link}" target="_blank" rel="noopener noreferrer">Ver projeto</a></p>
        <hr>
      `;

      container.appendChild(div);
    });
  })
  .catch(err => console.error('Erro ao carregar o JSON:', err));
}

carregarDados();

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
