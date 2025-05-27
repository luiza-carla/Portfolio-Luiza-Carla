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
          Concluído em: ${curso.conclusao}<br>
          Carga horária: ${curso.cargaHoraria}<br>
          Instituição: ${curso.instituicao}</p>
        `;
        formacaoElemento.appendChild(cursoElemento);
      });

      formacoes.appendChild(formacaoElemento);
    });

    const cursosIndepDiv = document.getElementById('cursosIndependentes');
    dados.cursosIndependentes.forEach(curso => {
      const cursoElemento = document.createElement('div');
      cursoElemento.classList.add('curso-independente');

      cursoElemento.innerHTML = `
        <h3>${curso.nome}</h3>
        <p>Concluído em: ${curso.conclusao}<br>
        Carga horária: ${curso.cargaHoraria}<br>
        Instituição: ${curso.instituicao}</p>
      `;

      cursosIndepDiv.appendChild(cursoElemento);
    });

  } catch (erro) {
    console.error('Erro ao carregar dados:', erro);
  }

  fetch('../projetos.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('projetos-container');
    data.projetos.forEach(projeto => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h2>${projeto.nome}</h2>
        <p><strong>Descrição:</strong> ${projeto.descricao}</p>
        <p><strong>Tecnologias:</strong> ${projeto.tecnologias}</p>
        <p><a href="${projeto.link}" target="_blank">Ver projeto</a></p>
        
        <hr>
      `;
      // falta servir as imagens e adicionar os links
      container.appendChild(div);
    });
  })
  .catch(err => console.error('Erro ao carregar o JSON:', err));
}

carregarDados();
