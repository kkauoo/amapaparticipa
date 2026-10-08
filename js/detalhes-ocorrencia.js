const detalhes = document.getElementById("detalhes");

const idOcorrencia = localStorage.getItem("ocorrenciaSelecionada");

const ocorrenciasSalvas = localStorage.getItem("ocorrencias");

const nomesCategorias = {
    "infraestrutura": "Infraestrutura",
    "meio-ambiente": "Meio ambiente",
    "iluminacao-publica": "Ilumação pública",
    "transporte": "Transporte",
    "limpeza-urbana": "Limpeza urbana",
    "outros": "Outros"
};

const nomesStatus = {
    "registrada": "Registrada",
    "em-analise": "Em análise",
    "encaminhada": "Encaminhada",
    "em-atendimento": "Em atendimento",
    "resolvida": "Resolvida"
};

if (!idOcorrencia || !ocorrenciasSalvas) {

    detalhes.innerHTML = `
        <div class="mensagem-erro">
            <h1>Ocorrência não encontrada</h1>
            <p>
                Não foi possível encontrar os dados desta ocorrência.
            </p>
        </div>
    `;

} else {

    let ocorrencias = [];

    try {

        ocorrencias = JSON.parse(ocorrenciasSalvas);

    } catch {

        ocorrencias = [];
    }

    const ocorrencia = ocorrencias.find(function (item) {

        return String(item.id) === String(idOcorrencia);

    });

    if (!ocorrencia) {

        detalhes.innerHTML = `
            <div class="mensagem-erro">
                <h1>Ocorrência não encontrada</h1>
                <p>
                    Não foi possível encontrar os dados desta ocorrência.
                </p>
            </div>
        `;

    } else {

        const primeiraFoto =
            ocorrencia.fotos &&
            ocorrencia.fotos.length > 0
                ? ocorrencia.fotos[0]
                : "";

        detalhes.innerHTML = `
            <article class="detalhes-card">

                <img
                    src="${primeiraFoto}"
                    class="detalhes-imagem"
                    alt="${ocorrencia.titulo}"
                >

                <h1>
                    ${ocorrencia.titulo}
                </h1>

                <p>
                    <strong>Categoria:</strong>
                    ${nomesCategorias[ocorrencia.categoria]}
                </p>

                <p>
                    <strong>Localização:</strong>
                    ${ocorrencia.local || "Não informada"}
                </p>

                <p>
                    <strong>Descrição:</strong>
                    ${ocorrencia.descricao || "Não informada"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${nomesStatus[ocorrencia.status]}
                </p>

                <p>
                    <strong>Autor:</strong>
                    ${ocorrencia.autor || "Não informado"}
                </p>

            </article>
        `;
    }
}