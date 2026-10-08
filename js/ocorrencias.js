// ===== DADOS MOCK =====

const ocorrenciasMock = [

    {
        id: 1,
        titulo: "Buraco na via",
        categoria: "infraestrutura",
        local: "Centro",
        data: "2026-09-04",
        status: "em-analise",
        descricao: "Buraco de grande dimensão localizado na via, dificultando a passagem de veículos e aumentando o risco de acidentes.",
        autor: "Usuário demonstrativo",
        fotos: ["../img/buracorua.jpg"]
    },

    {
        id: 2,
        titulo: "Poste sem iluminação",
        categoria: "iluminacao-publica",
        local: "Novo Buritizal",
        data: "2026-09-03",
        status: "encaminhada",
        descricao: "Poste de iluminação pública está sem funcionamento, deixando o trecho da via com pouca iluminação durante a noite.",
        autor: "Usuário demonstrativo",
        fotos: ["../img/poste.jpg"]
    },

    {
        id: 3,
        titulo: "Descarte irregular de lixo",
        categoria: "meio-ambiente",
        local: "Zona Norte",
        data: "2026-09-02",
        status: "em-atendimento",
        descricao: "Foi identificado descarte irregular de lixo em uma área pública, causando acúmulo de resíduos e prejudicando o local.",
        autor: "Usuário demonstrativo",
        fotos: ["../img/descarte.jpg"]
    },

    {
        id: 4,
        titulo: "Ponto de ônibus danificado",
        categoria: "transporte",
        local: "Mecapá",
        data: "2026-09-01",
        status: "resolvida",
        descricao: "Ponto de ônibus apresenta danos em sua estrutura, dificultando a utilização adequada pelos passageiros.",
        autor: "Usuário demonstrativo",
        fotos: ["../img/onibus.jpg"]
    },

    {
        id: 5,
        titulo: "Acúmulo de entulho",
        categoria: "limpeza-urbana",
        local: "Jardim Marco Zero",
        data: "2026-08-31",
        status: "registrada",
        descricao: "Há acúmulo de entulho em uma área próxima à via, prejudicando a circulação e a organização do espaço.",
        autor: "Usuário demonstrativo",
        fotos: ["../img/entulho.webp"]
    },

    {
        id: 6,
        titulo: "Calçada danificada",
        categoria: "infraestrutura",
        local: "Santa Rita",
        data: "2026-08-28",
        status: "em-atendimento",
        descricao: "Trecho da calçada apresenta danos que dificultam a passagem de pedestres pelo local.",
        autor: "Usuário demonstrativo",
        fotos: ["../img/calcada.jpg"]
    }

];

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

const grade = document.getElementById("grade-ocorrencias");

const mensagemVazia = document.getElementById("mensagem-vazia");

const listaCategorias = document.getElementById("lista-categorias");

const campoBusca = document.getElementById("buscar-ocorrencias");

const filtroCategoria = document.getElementById("filtro-categoria");

const botaoFiltros = document.getElementById("botao-filtros");

const painelFiltros = document.getElementById("painel-filtros");

const avatarUsuario = document.getElementById("avatar-usuario");

const filtrosAtivos = document.getElementById("filtros-ativos");

const listaFiltrosAtivos = document.getElementById("lista-filtros-ativos");

const limparFiltros = document.getElementById("limpar-filtros");

const botaoMenu = document.getElementById("botao-menu");

const menuPrincipal = document.getElementById("menu-principal");

let categoriaAtual = "todas";

let statusAtual = "todas";

function carregarOcorrencias() {

    const salvas = localStorage.getItem("ocorrencias");

    if (!salvas) {

        localStorage.setItem(
            "ocorrencias",
            JSON.stringify(ocorrenciasMock)
        );

        return ocorrenciasMock;

    }

    return JSON.parse(salvas);

}

function mostrarAvatar() {

    const usuarioLogado =
        sessionStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {

        avatarUsuario.textContent = "?";

        return;

    }

    const iniciais =
        usuarioLogado.substring(0, 2).toUpperCase();

    avatarUsuario.textContent = iniciais;

}

function formatarData(dataISO) {

    const partes = dataISO.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

function criarCard(ocorrencia) {

    const card = document.createElement("div");

    card.className = "card-ocorrencia";

    card.style.cursor = "pointer";

    card.addEventListener("click", function () {

        localStorage.setItem(
            "ocorrenciaSelecionada",
            ocorrencia.id
        );

        window.location.href =
            "detalhes-ocorrencia.html";

    });

    const primeiraFoto =
        ocorrencia.fotos && ocorrencia.fotos.length > 0
            ? ocorrencia.fotos[0]
            : "";

    card.innerHTML = `

        <div
            class="card-imagem"
            style="background-image: url('${primeiraFoto}')"
        ></div>

        <div class="card-corpo">

            <div class="card-categoria cat-${ocorrencia.categoria}">

                <span class="pontinho-categoria"></span>

                ${nomesCategorias[ocorrencia.categoria]}

            </div>

            <div class="card-titulo">

                ${ocorrencia.titulo}

            </div>

            <div class="card-info">

                📍 ${ocorrencia.local}

            </div>

            <div class="card-info">

                📅 ${formatarData(ocorrencia.data)}

            </div>

            <span class="card-status status-${ocorrencia.status}">

                ${nomesStatus[ocorrencia.status]}

            </span>

        </div>

        <div class="card-previa">

            <strong>Descrição</strong>

            <p>

                ${ocorrencia.descricao}

            </p>

            <span>

                Clique para ver os detalhes

            </span>

        </div>

    `;

    return card;

}

function atualizarFiltrosAtivos() {

    listaFiltrosAtivos.innerHTML = "";

    let possuiFiltro = false;

    if (categoriaAtual !== "todas") {

        possuiFiltro = true;

        const categoria =
            document.createElement("span");

        categoria.className = "filtro-ativo";

        categoria.innerHTML = `

            ${nomesCategorias[categoriaAtual]}

            <button
                type="button"
                data-tipo="categoria"
                aria-label="Remover filtro de categoria"
            >

                ×

            </button>

        `;

        listaFiltrosAtivos.appendChild(categoria);

    }

    if (statusAtual !== "todas") {

        possuiFiltro = true;

        const status =
            document.createElement("span");

        status.className = "filtro-ativo";

        status.innerHTML = `

            ${nomesStatus[statusAtual]}

            <button
                type="button"
                data-tipo="status"
                aria-label="Remover filtro de status"
            >

                ×

            </button>

        `;

        listaFiltrosAtivos.appendChild(status);

    }

    if (campoBusca.value.trim() !== "") {

        possuiFiltro = true;

        const busca =
            document.createElement("span");

        busca.className = "filtro-ativo";

        busca.innerHTML = `

            Busca: "${campoBusca.value.trim()}"

            <button
                type="button"
                data-tipo="busca"
                aria-label="Remover busca"
            >

                ×

            </button>

        `;

        listaFiltrosAtivos.appendChild(busca);

    }

    if (possuiFiltro) {

        filtrosAtivos.classList.remove(
            "escondido"
        );

    } else {

        filtrosAtivos.classList.add(
            "escondido"
        );

    }

}

function renderizarOcorrencias() {

    const todas = carregarOcorrencias();

    const termoBusca =
        campoBusca.value.trim().toLowerCase();

    const filtradas = todas.filter(function (ocorrencia) {

        const bateCategoria =
            categoriaAtual === "todas" ||
            ocorrencia.categoria === categoriaAtual;

        const bateStatus =
            statusAtual === "todas" ||
            ocorrencia.status === statusAtual;

        const nomeCategoria =
            nomesCategorias[ocorrencia.categoria]
                .toLowerCase();

        const bateBusca =
            ocorrencia.titulo
                .toLowerCase()
                .includes(termoBusca) ||

            ocorrencia.local
                .toLowerCase()
                .includes(termoBusca) ||

            ocorrencia.descricao
                .toLowerCase()
                .includes(termoBusca) ||

            nomeCategoria.includes(termoBusca);

        return (
            bateCategoria &&
            bateStatus &&
            bateBusca
        );

    });

    grade.innerHTML = "";

    if (filtradas.length === 0) {

        mensagemVazia.classList.remove(
            "escondido"
        );

    } else {

        mensagemVazia.classList.add(
            "escondido"
        );

        filtradas.forEach(function (ocorrencia) {

            grade.appendChild(
                criarCard(ocorrencia)
            );

        });

    }

    atualizarFiltrosAtivos();

}

listaCategorias.addEventListener(
    "click",
    function (event) {

        const item =
            event.target.closest(".categoria");

        if (!item) {

            return;

        }

        document
            .querySelectorAll(".categoria")
            .forEach(function (categoria) {

                categoria.classList.remove("ativa");

            });

        item.classList.add("ativa");

        categoriaAtual =
            item.dataset.categoria;

        filtroCategoria.value =
            categoriaAtual;

        renderizarOcorrencias();

    }
);

filtroCategoria.addEventListener(
    "change",
    function () {

        categoriaAtual =
            this.value;

        document
            .querySelectorAll(".categoria")
            .forEach(function (categoria) {

                categoria.classList.remove("ativa");

            });

        const categoriaLateral =
            document.querySelector(
                `.categoria[data-categoria="${categoriaAtual}"]`
            );

        if (categoriaLateral) {

            categoriaLateral.classList.add("ativa");

        }

        renderizarOcorrencias();

    }
);

botaoFiltros.addEventListener(
    "click",
    function () {

        painelFiltros.classList.toggle(
            "escondido"
        );

    }
);

painelFiltros.addEventListener(
    "click",
    function (event) {

        const botao =
            event.target.closest(".filtro-status");

        if (!botao) {

            return;

        }

        document
            .querySelectorAll(".filtro-status")
            .forEach(function (filtro) {

                filtro.classList.remove("ativo");

            });

        botao.classList.add("ativo");

        statusAtual =
            botao.dataset.status;

        renderizarOcorrencias();

    }
);

listaFiltrosAtivos.addEventListener(
    "click",
    function (event) {

        const botao =
            event.target.closest("button");

        if (!botao) {

            return;

        }

        const tipo =
            botao.dataset.tipo;

        if (tipo === "categoria") {

            categoriaAtual = "todas";

            filtroCategoria.value = "todas";

            document
                .querySelectorAll(".categoria")
                .forEach(function (categoria) {

                    categoria.classList.remove("ativa");

                });

            document
                .querySelector(
                    '.categoria[data-categoria="todas"]'
                )
                .classList.add("ativa");

        }

        if (tipo === "status") {

            statusAtual = "todas";

            document
                .querySelectorAll(".filtro-status")
                .forEach(function (filtro) {

                    filtro.classList.remove("ativo");

                });

            document
                .querySelector(
                    '.filtro-status[data-status="todas"]'
                )
                .classList.add("ativo");

        }

        if (tipo === "busca") {

            campoBusca.value = "";

        }

        renderizarOcorrencias();

    }
);

limparFiltros.addEventListener(
    "click",
    function () {

        categoriaAtual = "todas";

        statusAtual = "todas";

        campoBusca.value = "";

        filtroCategoria.value = "todas";

        document
            .querySelectorAll(".categoria")
            .forEach(function (categoria) {

                categoria.classList.remove("ativa");

            });

        document
            .querySelector(
                '.categoria[data-categoria="todas"]'
            )
            .classList.add("ativa");

        document
            .querySelectorAll(".filtro-status")
            .forEach(function (filtro) {

                filtro.classList.remove("ativo");

            });

        document
            .querySelector(
                '.filtro-status[data-status="todas"]'
            )
            .classList.add("ativo");

        renderizarOcorrencias();

    }
);

campoBusca.addEventListener(
    "input",
    renderizarOcorrencias
);

// ===== MENU =====

botaoMenu.addEventListener(
    "click",
    function () {

        const menuAberto =
            menuPrincipal.classList.toggle("aberto");

        botaoMenu.setAttribute(
            "aria-expanded",
            menuAberto
        );

    }
);

mostrarAvatar();

renderizarOcorrencias();