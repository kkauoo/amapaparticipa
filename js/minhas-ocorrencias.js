const lista = document.getElementById("lista-minhas-ocorrencias");
const mensagemVazia = document.getElementById("minhas-mensagem-vazia");

const totalOcorrencias = document.getElementById("total-ocorrencias");
const totalAndamento = document.getElementById("total-andamento");
const totalResolvidas = document.getElementById("total-resolvidas");

const avatarTopo = document.getElementById("avatar-usuario-topo");
const avatarSidebar = document.getElementById("avatar-usuario-sidebar");

const usuarioLogado = sessionStorage.getItem("usuarioLogado");

const nomesCategorias = {
    "infraestrutura": "Infraestrutura",
    "meio-ambiente": "Meio ambiente",
    "iluminacao-publica": "Iluminação pública",
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

let filtroAtual = "todas";

function carregarUsuarios() {
    try {
        const dados = JSON.parse(localStorage.getItem("usuarios") || "[]");
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function obterIniciaisUsuario() {
    if (!usuarioLogado) {
        return "--";
    }

    const usuarios = carregarUsuarios();

    const usuario = usuarios.find(item =>
        item.email &&
        item.email.toLowerCase() === usuarioLogado.toLowerCase()
    );

    if (!usuario || !usuario.nome) {
        return "--";
    }

    const partesNome = usuario.nome.trim().split(/\s+/).filter(Boolean);

    if (partesNome.length === 0) {
        return "--";
    }

    if (partesNome.length === 1) {
        return partesNome[0].substring(0, 2).toUpperCase();
    }

    return (
        partesNome[0][0] +
        partesNome[partesNome.length - 1][0]
    ).toUpperCase();
}

function atualizarAvatares() {
    const iniciais = obterIniciaisUsuario();

    if (avatarTopo) {
        avatarTopo.textContent = iniciais;
    }

    if (avatarSidebar) {
        avatarSidebar.textContent = iniciais;
    }
}

function carregarOcorrencias() {
    try {
        const dados = JSON.parse(localStorage.getItem("ocorrencias") || "[]");
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function formatarData(data) {
    if (!data) return "Data não informada";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obterMinhasOcorrencias() {
    if (!usuarioLogado) return [];

    return carregarOcorrencias().filter(ocorrencia =>
        ocorrencia.usuarioEmail &&
        ocorrencia.usuarioEmail.toLowerCase() === usuarioLogado.toLowerCase()
    );
}

function atualizarResumo(ocorrencias) {
    totalOcorrencias.textContent = ocorrencias.length;

    totalAndamento.textContent = ocorrencias.filter(ocorrencia =>
        ["registrada", "em-analise", "encaminhada", "em-atendimento"]
            .includes(ocorrencia.status)
    ).length;

    totalResolvidas.textContent = ocorrencias.filter(
        ocorrencia => ocorrencia.status === "resolvida"
    ).length;
}

function criarCard(ocorrencia) {
    const card = document.createElement("article");
    card.className = "minha-ocorrencia-card";

    const imagem = document.createElement("img");
    imagem.className = "minha-ocorrencia-imagem";
    imagem.alt = ocorrencia.titulo || "Foto da ocorrência";

    const foto = ocorrencia.fotos && ocorrencia.fotos.length > 0
        ? ocorrencia.fotos[0]
        : "";

    if (foto) {
        imagem.src = foto;
    } else {
        imagem.hidden = true;
    }

    const conteudo = document.createElement("div");
    conteudo.className = "minha-ocorrencia-info";

    const categoria = document.createElement("p");
    categoria.className = "minha-ocorrencia-categoria";
    categoria.textContent = nomesCategorias[ocorrencia.categoria] || "Outros";

    const titulo = document.createElement("h2");
    titulo.textContent = ocorrencia.titulo || "Ocorrência sem título";

    const local = document.createElement("p");
    local.textContent = `Local: ${ocorrencia.local || "Não informado"}`;

    const data = document.createElement("p");
    data.textContent = `Data: ${formatarData(ocorrencia.data)}`;

    const status = document.createElement("span");
    status.className = `status-${ocorrencia.status || "registrada"}`;
    status.textContent = nomesStatus[ocorrencia.status] || "Registrada";

    const protocolo = document.createElement("p");
    protocolo.textContent = `Protocolo: ${ocorrencia.protocolo || "Não informado"}`;

    const botaoDetalhes = document.createElement("button");
    botaoDetalhes.type = "button";
    botaoDetalhes.className = "botao-detalhes-minha-ocorrencia";
    botaoDetalhes.textContent = "Ver detalhes";

    botaoDetalhes.addEventListener("click", function () {
        localStorage.setItem("ocorrenciaSelecionada", String(ocorrencia.id));
        window.location.href = "detalhes-ocorrencia.html";
    });

    conteudo.append(
        categoria,
        titulo,
        local,
        data,
        status,
        protocolo,
        botaoDetalhes
    );

    card.append(imagem, conteudo);

    return card;
}

function renderizarMinhasOcorrencias() {
    const minhasOcorrencias = obterMinhasOcorrencias();

    atualizarResumo(minhasOcorrencias);
    lista.replaceChildren();

    const filtradas = minhasOcorrencias.filter(ocorrencia => {
        if (filtroAtual === "resolvida") {
            return ocorrencia.status === "resolvida";
        }

        if (filtroAtual === "andamento") {
            return ocorrencia.status !== "resolvida";
        }

        return true;
    });

    filtradas.sort((a, b) => {
        return String(b.data || "").localeCompare(String(a.data || ""));
    });

    filtradas.forEach(ocorrencia => {
        lista.appendChild(criarCard(ocorrencia));
    });

    mensagemVazia.hidden = filtradas.length > 0;

    if (!usuarioLogado) {
        mensagemVazia.textContent =
            "Entre na sua conta para visualizar suas ocorrências.";
    } else if (minhasOcorrencias.length > 0 && filtradas.length === 0) {
        mensagemVazia.textContent =
            "Não há ocorrências para o filtro selecionado.";
    } else if (minhasOcorrencias.length === 0) {
        mensagemVazia.textContent =
            "Você ainda não registrou ocorrências nesta conta.";
    }
}

document.querySelectorAll(".filtro-minhas").forEach(botao => {
    botao.addEventListener("click", function () {
        filtroAtual = this.dataset.status;

        document.querySelectorAll(".filtro-minhas").forEach(item => {
            item.classList.toggle("ativo", item === this);
        });

        renderizarMinhasOcorrencias();
    });
});

atualizarAvatares();
renderizarMinhasOcorrencias();