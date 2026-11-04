
const orgaos = [
    {
        id: 1,
        nome: "Secretaria de Obras e Infraestrutura",
        categoria: "Infraestrutura",
        localizacao: "Macapá - AP",
        descricao: "Responsável por atividades relacionadas à infraestrutura urbana, conservação de vias e manutenção de espaços públicos.",
        email: "obras@exemplo.com",
        telefone: "(96) 3333-1001",
        whatsapp: "96991231001"
    },
    {
        id: 2,
        nome: "Secretaria de Meio Ambiente",
        categoria: "Meio ambiente",
        localizacao: "Macapá - AP",
        descricao: "Atua em ações relacionadas à preservação ambiental, fiscalização e cuidado com os espaços naturais.",
        email: "meioambiente@exemplo.com",
        telefone: "(96) 3333-1002",
        whatsapp: "96991231002"
    },
    {
        id: 3,
        nome: "Departamento de Transporte Público",
        categoria: "Transporte",
        localizacao: "Macapá - AP",
        descricao: "Responsável por atividades relacionadas ao transporte público e à mobilidade urbana.",
        email: "transporte@exemplo.com",
        telefone: "(96) 3333-1003",
        whatsapp: "96991231003"
    },
    {
        id: 4,
        nome: "Secretaria de Serviços Públicos",
        categoria: "Serviços públicos",
        localizacao: "Santana - AP",
        descricao: "Atua na organização e manutenção de serviços públicos, incluindo limpeza e conservação de áreas urbanas.",
        email: "servicos@exemplo.com",
        telefone: "(96) 3333-1004",
        whatsapp: "96991231004"
    },
    {
        id: 5,
        nome: "Departamento de Saneamento",
        categoria: "Saneamento",
        localizacao: "Macapá - AP",
        descricao: "Responsável por atividades relacionadas ao saneamento e à melhoria das condições sanitárias.",
        email: "saneamento@exemplo.com",
        telefone: "(96) 3333-1005",
        whatsapp: "96991231005"
    },
    {
        id: 6,
        nome: "Secretaria de Infraestrutura Urbana",
        categoria: "Infraestrutura",
        localizacao: "Santana - AP",
        descricao: "Atua em ações de planejamento, conservação e melhoria da infraestrutura dos espaços urbanos.",
        email: "infraestrutura@exemplo.com",
        telefone: "(96) 3333-1006",
        whatsapp: "96991231006"
    }
];

const listaOrgaos = document.getElementById("lista-orgaos");
const campoPesquisa = document.getElementById("pesquisa-orgao");
const filtrosCategoria = document.querySelectorAll('input[name="categoria"]');
const quantidadeOrgaos = document.getElementById("quantidade-orgaos");
const mensagemSemResultados = document.getElementById("mensagem-sem-resultados");

const modal = document.getElementById("modal-orgao");
const modalDetalhes = document.getElementById("modal-orgao-detalhes");
const fecharModal = document.getElementById("fechar-modal");

function criarCard(orgao) {
    return `
        <article class="card-orgao">
            <div class="card-orgao-topo">
                <div class="card-orgao-identificacao">
                    <h3>${orgao.nome}</h3>
                    <span class="orgao-categoria">${orgao.categoria}</span>
                </div>
            </div>

            <div class="card-orgao-informacoes">
                <p><strong>Localização:</strong> ${orgao.localizacao}</p>
                <p class="orgao-descricao-resumida">${orgao.descricao}</p>
            </div>

            <div class="card-orgao-contatos">
                <a href="tel:${orgao.telefone.replace(/\D/g, '')}">
                    <span>☎</span> ${orgao.telefone}
                </a>

                <a href="mailto:${orgao.email}">
                    <span>✉</span> ${orgao.email}
                </a>

                <a href="https://wa.me/55${orgao.whatsapp}" target="_blank" rel="noopener noreferrer">
                    <span>◉</span> WhatsApp
                </a>
            </div>

            <button
                type="button"
                class="btn-detalhes-orgao"
                data-orgao-id="${orgao.id}"
            >
                Ver informações
            </button>
        </article>
    `;
}

function carregarOrgaos() {
    const nomePesquisado = campoPesquisa.value.trim().toLowerCase();

    const categoriasSelecionadas = Array.from(filtrosCategoria)
        .filter(filtro => filtro.checked)
        .map(filtro => filtro.value);

    const resultados = orgaos.filter(orgao => {
        const correspondeNome = orgao.nome.toLowerCase().includes(nomePesquisado);
        const correspondeCategoria = categoriasSelecionadas.includes(orgao.categoria);

        if (nomePesquisado && categoriasSelecionadas.length > 0) {
            return correspondeNome || correspondeCategoria;
        }

        if (nomePesquisado) {
            return correspondeNome;
        }

        if (categoriasSelecionadas.length > 0) {
            return correspondeCategoria;
        }

        return true;
    });

    listaOrgaos.innerHTML = resultados.map(criarCard).join("");

    quantidadeOrgaos.textContent =
        `${resultados.length} ${resultados.length === 1 ? "órgão encontrado" : "órgãos encontrados"}`;

    mensagemSemResultados.hidden = resultados.length > 0;
}

function abrirModal(id) {
    const orgao = orgaos.find(item => item.id === Number(id));

    if (!orgao) return;

    modalDetalhes.innerHTML = `
        <div class="modal-orgao-cabecalho">
            <div>
                <span class="orgao-categoria">${orgao.categoria}</span>
                <h2 id="modal-orgao-nome">${orgao.nome}</h2>
            </div>
        </div>

        <div class="modal-orgao-secao">
            <h3>Sobre o órgão</h3>
            <p>${orgao.descricao}</p>
        </div>

        <div class="modal-orgao-secao">
            <h3>Localização</h3>
            <p>${orgao.localizacao}</p>
        </div>

        <div class="modal-orgao-secao">
            <h3>Contatos</h3>

            <div class="modal-orgao-contatos">
                <p><strong>Telefone:</strong> ${orgao.telefone}</p>
                <p><strong>E-mail:</strong> ${orgao.email}</p>
                <p><strong>WhatsApp:</strong> ${orgao.whatsapp}</p>
            </div>

            <div class="modal-orgao-acoes">
                <a href="tel:${orgao.telefone.replace(/\D/g, '')}">Ligar</a>
                <a href="mailto:${orgao.email}">Enviar e-mail</a>
                <a href="https://wa.me/55${orgao.whatsapp}" target="_blank" rel="noopener noreferrer">Enviar mensagem</a>
            </div>
        </div>
    `;

    modal.classList.add("ativo");
    modal.setAttribute("aria-hidden", "false");
    fecharModal.focus();
}

function fecharJanelaModal() {
    modal.classList.remove("ativo");
    modal.setAttribute("aria-hidden", "true");
}

campoPesquisa.addEventListener("input", carregarOrgaos);

filtrosCategoria.forEach(filtro => {
    filtro.addEventListener("change", carregarOrgaos);
});

document.getElementById("limpar-filtros").addEventListener("click", () => {
    campoPesquisa.value = "";

    filtrosCategoria.forEach(filtro => {
        filtro.checked = false;
    });

    carregarOrgaos();
});

listaOrgaos.addEventListener("click", event => {
    const botao = event.target.closest(".btn-detalhes-orgao");

    if (botao) {
        abrirModal(botao.dataset.orgaoId);
    }
});

fecharModal.addEventListener("click", fecharJanelaModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        fecharJanelaModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("ativo")) {
        fecharJanelaModal();
    }
});

function carregarAvatarUsuario() {
    const emailLogado = sessionStorage.getItem("usuarioLogado");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(item => item.email === emailLogado);

    const iniciaisElemento = document.getElementById("iniciais-usuario");

    if (!iniciaisElemento) return;

    if (usuario && usuario.nome) {
        const iniciais = usuario.nome
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(nome => nome.charAt(0).toUpperCase())
            .join("");

        iniciaisElemento.textContent = iniciais;
    } else {
        iniciaisElemento.textContent = "U";
    }
}

carregarOrgaos();
carregarAvatarUsuario();
