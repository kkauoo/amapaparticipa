
const formulario = document.getElementById("form-ocorrencia");
const categoria = document.getElementById("categoria");
const titulo = document.getElementById("titulo");
const local = document.getElementById("local");
const foto = document.getElementById("foto");
const descricao = document.getElementById("descricao");

const contadorDescricao = document.getElementById("contador-descricao");
const botaoRascunho = document.getElementById("botao-rascunho");
const botaoSairRascunho = document.getElementById("botao-sair-rascunho");
const botaoSair = document.getElementById("botao-sair");
const botaoRemoverFoto = document.getElementById("remover-foto");

const botaoMenu = document.getElementById("botao-menu");
const menuPrincipal = document.getElementById("menu-principal");
const avatarUsuario = document.getElementById("avatar-usuario");

const botaoMeusRascunhos = document.getElementById("botao-recuperar-rascunho");
const botaoNovoRascunho = document.getElementById("botao-novo-rascunho");
const quantidadeRascunhos = document.getElementById("quantidade-rascunhos");
const avisoEdicao = document.getElementById("aviso-edicao-rascunho");

const modalRascunhos = document.getElementById("modal-rascunhos");
const listaRascunhos = document.getElementById("lista-rascunhos");
const fecharModal = document.getElementById("fechar-modal-rascunhos");
const fecharRodape = document.getElementById("fechar-rascunhos-rodape");

const usuarioLogado = sessionStorage.getItem("usuarioLogado");

const identificador = (usuarioLogado || "visitante")
    .trim()
    .toLowerCase();

const chaveRascunhos = `rascunhosSalvos_${identificador}`;
const chaveAutomatico = `rascunhoAutomatico_${identificador}`;
const chaveManualAntiga = `rascunhoManual_${identificador}`;
const chaveOriginal = `rascunhoOcorrencia_${usuarioLogado || "visitante"}`;

let fotoSelecionada = "";
let rascunhoAtualId = null;
let salvando = false;
let impedirSalvamento = false;
let carregandoFoto = false;
let versaoFoto = 0;

const nomesCategorias = {
    "infraestrutura": "Infraestrutura",
    "meio-ambiente": "Meio ambiente",
    "iluminacao-publica": "Iluminação pública",
    "transporte": "Transporte",
    "limpeza-urbana": "Limpeza urbana",
    "outros": "Outros"
};

function gerarId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return Date.now().toString(36) +
        Math.random().toString(36).slice(2);
}

function lerArmazenamento(chave, valorPadrao = null) {
    try {
        const dados = localStorage.getItem(chave);

        return dados ? JSON.parse(dados) : valorPadrao;
    } catch {
        return valorPadrao;
    }
}

function carregarUsuarios() {
    const usuarios = lerArmazenamento("usuarios", []);

    return Array.isArray(usuarios) ? usuarios : [];
}

function obterUsuarioAtual() {
    if (!usuarioLogado) return null;

    return carregarUsuarios().find(usuario =>
        typeof usuario.email === "string" &&
        usuario.email.trim().toLowerCase() === identificador
    ) || null;
}

function mostrarAvatar() {
    if (!avatarUsuario) return;

    const usuario = obterUsuarioAtual();

    if (!usuario || !usuario.nome || !usuario.nome.trim()) {
        avatarUsuario.textContent = "?";
        return;
    }

    const partesNome = usuario.nome.trim().split(/\s+/);

    const iniciais = partesNome.length > 1
        ? partesNome[0][0] + partesNome[partesNome.length - 1][0]
        : partesNome[0].slice(0, 2);

    avatarUsuario.textContent = iniciais.toUpperCase();
}

function atualizarContador() {
    contadorDescricao.textContent = descricao.value.length;
}

function obterDadosFormulario() {
    return {
        categoria: categoria.value,
        titulo: titulo.value.trim(),
        local: local.value.trim(),
        descricao: descricao.value.trim(),
        foto: fotoSelecionada,
        ultimaEdicao: new Date().toISOString()
    };
}

function possuiConteudo(dados) {
    if (!dados) return false;

    return Boolean(
        dados.categoria ||
        dados.titulo ||
        dados.local ||
        dados.descricao ||
        dados.foto
    );
}

function obterRascunhos() {
    const rascunhos = lerArmazenamento(chaveRascunhos, []);

    return Array.isArray(rascunhos) ? rascunhos : [];
}

function armazenarRascunhos(rascunhos) {
    try {
        localStorage.setItem(
            chaveRascunhos,
            JSON.stringify(rascunhos)
        );

        return true;
    } catch (erro) {
        console.error("Erro ao armazenar rascunhos:", erro);

        alert(
            "Não foi possível salvar. " +
            "Verifique o espaço disponível no navegador."
        );

        return false;
    }
}

function atualizarQuantidadeRascunhos() {
    quantidadeRascunhos.textContent = obterRascunhos().length;
}

function atualizarModoEdicao() {
    avisoEdicao.hidden = !rascunhoAtualId;

    botaoRascunho.textContent = rascunhoAtualId
        ? "Atualizar rascunho"
        : "Salvar rascunho";
}

function migrarRascunhosAntigos() {
    const chavesAntigas = [
        chaveManualAntiga,
        chaveOriginal
    ];

    for (const chave of chavesAntigas) {
        const antigo = lerArmazenamento(chave);

        if (!possuiConteudo(antigo)) continue;

        const rascunhos = obterRascunhos();

        const jaMigrado = rascunhos.some(
            item => item.origemMigracao === chave
        );

        if (jaMigrado) {
            localStorage.removeItem(chave);
            continue;
        }

        const agora = new Date().toISOString();

        rascunhos.push({
            ...antigo,
            id: gerarId(),
            dataCriacao: antigo.ultimaEdicao || agora,
            ultimaEdicao: antigo.ultimaEdicao || agora,
            origemMigracao: chave
        });

        if (armazenarRascunhos(rascunhos)) {
            localStorage.removeItem(chave);
        }
    }
}

function salvarRascunhoAutomatico() {
    if (impedirSalvamento || salvando) return false;

    const dados = obterDadosFormulario();

    try {
        if (!possuiConteudo(dados)) {
            localStorage.removeItem(chaveAutomatico);
            return true;
        }

        localStorage.setItem(
            chaveAutomatico,
            JSON.stringify({
                ...dados,
                idRascunho: rascunhoAtualId
            })
        );

        return true;

    } catch (erro) {
        console.error("Erro no salvamento automático:", erro);
        return false;
    }
}

function salvarRascunhoManual() {
    if (carregandoFoto) {
        alert("Aguarde o carregamento da imagem.");
        return false;
    }

    const dados = obterDadosFormulario();

    if (!possuiConteudo(dados)) {
        alert("Preencha pelo menos um campo antes de salvar.");
        return false;
    }

    const rascunhos = obterRascunhos();

    const indice = rascunhos.findIndex(
        item => item.id === rascunhoAtualId
    );

    let idSalvo;

    if (indice !== -1) {

        idSalvo = rascunhos[indice].id;

        rascunhos[indice] = {
            ...rascunhos[indice],
            ...dados
        };

    } else {

        idSalvo = gerarId();

        rascunhos.push({
            ...dados,
            id: idSalvo,
            dataCriacao: new Date().toISOString()
        });
    }

    if (!armazenarRascunhos(rascunhos)) {
        return false;
    }

    rascunhoAtualId = idSalvo;

    localStorage.removeItem(chaveAutomatico);

    atualizarQuantidadeRascunhos();
    atualizarModoEdicao();

    return true;
}

function atualizarPreviaFoto() {
    const previa = document.getElementById("previa-foto");
    const imagem = document.getElementById("imagem-previa");

    foto.required = !fotoSelecionada;

    if (fotoSelecionada) {
        imagem.src = fotoSelecionada;
        previa.hidden = false;
    } else {
        imagem.removeAttribute("src");
        previa.hidden = true;
    }
}

function preencherFormulario(rascunho) {
    versaoFoto++;
    carregandoFoto = false;

    foto.value = "";

    categoria.value = rascunho.categoria || "";
    titulo.value = rascunho.titulo || "";
    local.value = rascunho.local || "";
    descricao.value = rascunho.descricao || "";
    fotoSelecionada = rascunho.foto || "";

    atualizarContador();
    atualizarPreviaFoto();
}

function limparFormulario() {
    versaoFoto++;
    carregandoFoto = false;

    formulario.reset();

    fotoSelecionada = "";
    rascunhoAtualId = null;
    foto.value = "";

    atualizarContador();
    atualizarPreviaFoto();
    atualizarModoEdicao();
}

function carregarRascunhoAutomatico() {
    const rascunho = lerArmazenamento(chaveAutomatico);

    if (!possuiConteudo(rascunho)) return;

    const existeRascunho = obterRascunhos().some(
        item => item.id === rascunho.idRascunho
    );

    rascunhoAtualId = existeRascunho
        ? rascunho.idRascunho
        : null;

    preencherFormulario(rascunho);
    atualizarModoEdicao();
}

function formatarData(data) {
    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "Data não disponível";
    }

    return dataConvertida.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

function renderizarRascunhos() {
    listaRascunhos.replaceChildren();

    const rascunhos = obterRascunhos().sort((a, b) =>
        (Date.parse(b.ultimaEdicao) || 0) -
        (Date.parse(a.ultimaEdicao) || 0)
    );

    if (rascunhos.length === 0) {

        const vazio = criarElemento(
            "div",
            "rascunhos-vazio"
        );

        vazio.append(
            criarElemento("h3", "", "Nenhum rascunho salvo"),
            criarElemento(
                "p",
                "",
                "Os rascunhos que você salvar aparecerão aqui."
            )
        );

        listaRascunhos.appendChild(vazio);

        return;
    }

    rascunhos.forEach(rascunho => {

        const card = criarElemento(
            "article",
            "card-rascunho"
        );

        const topo = criarElemento(
            "div",
            "card-rascunho-topo"
        );

        const categoriaTexto = criarElemento(
            "span",
            "rascunho-categoria",
            nomesCategorias[rascunho.categoria] ||
            "Sem categoria"
        );

        const status = criarElemento(
            "span",
            "rascunho-status",
            "Rascunho"
        );

        topo.append(categoriaTexto, status);

        const tituloCard = criarElemento(
            "h3",
            "rascunho-titulo",
            rascunho.titulo || "Rascunho sem título"
        );

        const localCard = criarElemento(
            "p",
            "rascunho-local",
            rascunho.local || "Localização não informada"
        );

        const dataCard = criarElemento(
            "small",
            "rascunho-data",
            "Última edição: " +
            formatarData(rascunho.ultimaEdicao)
        );

        const acoes = criarElemento(
            "div",
            "rascunho-acoes"
        );

        const botaoContinuar = criarElemento(
            "button",
            "rascunho-continuar",
            "Continuar preenchimento"
        );

        botaoContinuar.type = "button";

        botaoContinuar.addEventListener("click", function () {
            recuperarRascunho(rascunho.id);
        });

        const botaoExcluir = criarElemento(
            "button",
            "rascunho-excluir",
            "Excluir"
        );

        botaoExcluir.type = "button";

        botaoExcluir.addEventListener("click", function () {
            excluirRascunho(rascunho.id);
        });

        acoes.append(botaoContinuar, botaoExcluir);

        card.append(
            topo,
            tituloCard,
            localCard,
            dataCard,
            acoes
        );

        listaRascunhos.appendChild(card);
    });
}

function recuperarRascunho(id) {
    const rascunho = obterRascunhos().find(
        item => item.id === id
    );

    if (!rascunho) {
        alert("Rascunho não encontrado.");
        renderizarRascunhos();
        return;
    }

    if (possuiConteudo(obterDadosFormulario())) {

        const confirmar = confirm(
            "Deseja substituir o preenchimento atual " +
            "pelo rascunho selecionado? " +
            "Alterações não salvas serão descartadas."
        );

        if (!confirmar) return;
    }

    rascunhoAtualId = rascunho.id;

    preencherFormulario(rascunho);
    atualizarModoEdicao();
    salvarRascunhoAutomatico();

    modalRascunhos.close();

    titulo.focus();
}

function excluirRascunho(id) {
    const confirmar = confirm(
        "Deseja excluir definitivamente este rascunho?"
    );

    if (!confirmar) return;

    const rascunhos = obterRascunhos().filter(
        item => item.id !== id
    );

    if (!armazenarRascunhos(rascunhos)) return;

    const automatico = lerArmazenamento(chaveAutomatico);

    if (automatico && automatico.idRascunho === id) {
        localStorage.removeItem(chaveAutomatico);
    }

    if (rascunhoAtualId === id) {
        limparFormulario();
        localStorage.removeItem(chaveAutomatico);
    }

    atualizarQuantidadeRascunhos();
    renderizarRascunhos();

    alert("Rascunho excluído com sucesso.");
}

function iniciarNovoRascunho() {
    if (possuiConteudo(obterDadosFormulario())) {

        const confirmar = confirm(
            "Deseja iniciar um novo rascunho? " +
            "As alterações atuais que não foram salvas serão descartadas."
        );

        if (!confirmar) return;
    }

    localStorage.removeItem(chaveAutomatico);

    limparFormulario();

    categoria.focus();
}

function lerImagem(arquivo) {
    return new Promise((resolve, reject) => {

        const leitor = new FileReader();

        leitor.onload = () => resolve(leitor.result);

        leitor.onerror = () => reject(
            new Error("Não foi possível ler a imagem.")
        );

        leitor.readAsDataURL(arquivo);
    });
}

if (botaoMenu && menuPrincipal) {

    botaoMenu.addEventListener("click", function () {

        const menuAberto = menuPrincipal.classList.toggle(
            "aberto"
        );

        botaoMenu.setAttribute(
            "aria-expanded",
            String(menuAberto)
        );
    });
}

descricao.addEventListener("input", function () {
    atualizarContador();
    salvarRascunhoAutomatico();
});

[categoria, titulo, local].forEach(campo => {

    campo.addEventListener(
        "input",
        salvarRascunhoAutomatico
    );

    campo.addEventListener(
        "change",
        salvarRascunhoAutomatico
    );
});

foto.addEventListener("change", async function () {

    const versaoAtual = ++versaoFoto;
    const arquivo = foto.files[0];

    carregandoFoto = false;

    if (!arquivo) {
        atualizarPreviaFoto();
        return;
    }

    if (!arquivo.type.startsWith("image/")) {

        alert("Selecione um arquivo de imagem válido.");

        foto.value = "";
        atualizarPreviaFoto();

        return;
    }

    if (arquivo.size > 1.5 * 1024 * 1024) {

        alert("A imagem deve ter no máximo 1,5 MB.");

        foto.value = "";
        atualizarPreviaFoto();

        return;
    }

    carregandoFoto = true;

    try {

        const imagem = await lerImagem(arquivo);

        if (versaoAtual !== versaoFoto) return;

        fotoSelecionada = imagem;

        atualizarPreviaFoto();
        salvarRascunhoAutomatico();

    } catch {

        if (versaoAtual !== versaoFoto) return;

        alert("Não foi possível carregar a imagem.");

        foto.value = "";

        atualizarPreviaFoto();

    } finally {

        if (versaoAtual === versaoFoto) {
            carregandoFoto = false;
        }
    }
});

botaoRemoverFoto.addEventListener("click", function () {

    versaoFoto++;
    carregandoFoto = false;

    fotoSelecionada = "";
    foto.value = "";

    atualizarPreviaFoto();
    salvarRascunhoAutomatico();
});

botaoRascunho.addEventListener("click", function () {

    const estavaEditando = Boolean(rascunhoAtualId);

    if (salvarRascunhoManual()) {

        alert(
            estavaEditando
                ? "Rascunho atualizado com sucesso!"
                : "Rascunho salvo com sucesso!"
        );
    }
});

botaoMeusRascunhos.addEventListener("click", function () {

    renderizarRascunhos();

    modalRascunhos.showModal();
});

botaoNovoRascunho.addEventListener(
    "click",
    iniciarNovoRascunho
);

fecharModal.addEventListener("click", function () {
    modalRascunhos.close();
});

fecharRodape.addEventListener("click", function () {
    modalRascunhos.close();
});

modalRascunhos.addEventListener("click", function (event) {

    if (event.target !== modalRascunhos) return;

    const limites = modalRascunhos.getBoundingClientRect();

    const clicouFora =
        event.clientX < limites.left ||
        event.clientX > limites.right ||
        event.clientY < limites.top ||
        event.clientY > limites.bottom;

    if (clicouFora) {
        modalRascunhos.close();
    }
});

botaoSairRascunho.addEventListener("click", function () {

    if (!salvarRascunhoManual()) return;

    impedirSalvamento = true;

    limparFormulario();

    alert("Rascunho salvo com sucesso!");

    window.location.href = "../index.html";
});

botaoSair.addEventListener("click", function () {

    const confirmar = confirm(
        "Deseja sair sem salvar as alterações atuais? " +
        "Seus rascunhos salvos serão preservados."
    );

    if (!confirmar) return;

    impedirSalvamento = true;

    localStorage.removeItem(chaveAutomatico);

    limparFormulario();

    window.location.href = "../index.html";
});

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    if (salvando) return;

    if (carregandoFoto) {

        alert("Aguarde o carregamento da imagem.");

        return;
    }

    if (!usuarioLogado || !obterUsuarioAtual()) {

        if (!salvarRascunhoManual()) return;

        impedirSalvamento = true;

        alert("Entre na sua conta antes de registrar uma ocorrência.");

        window.location.href = "login.html";

        return;
    }

    const dados = obterDadosFormulario();

    if (!dados.categoria) {

        alert("Selecione uma categoria.");

        categoria.focus();

        return;
    }

    if (dados.titulo.length < 5 || dados.titulo.length > 100) {

        alert("O título deve possuir entre 5 e 100 caracteres.");

        titulo.focus();

        return;
    }

    if (!dados.local) {

        alert("Informe a localização do problema.");

        local.focus();

        return;
    }

    if (!fotoSelecionada) {

        alert("Adicione pelo menos uma foto.");

        foto.focus();

        return;
    }

    if (!dados.descricao) {

        alert("Informe uma descrição do problema.");

        descricao.focus();

        return;
    }

    if (dados.descricao.length > 1000) {

        alert("A descrição deve possuir no máximo 1.000 caracteres.");

        descricao.focus();

        return;
    }

    salvando = true;

    try {

        let ocorrencias = lerArmazenamento(
            "ocorrencias",
            []
        );

        if (!Array.isArray(ocorrencias)) {
            ocorrencias = [];
        }

        const usuario = obterUsuarioAtual();
        const agora = new Date();

        const data = [
            agora.getFullYear(),
            String(agora.getMonth() + 1).padStart(2, "0"),
            String(agora.getDate()).padStart(2, "0")
        ].join("-");

        const proximoNumero = Math.max(
            0,
            ...ocorrencias.map(item => Number(item.id) || 0)
        ) + 1;

        const novaOcorrencia = {
            id: proximoNumero,
            protocolo: `AP-${String(Date.now()).slice(-8)}`,
            categoria: dados.categoria,
            titulo: dados.titulo,
            local: dados.local,
            descricao: dados.descricao,
            fotos: [fotoSelecionada],
            data,
            status: "registrada",
            autor: usuario.nome,
            usuarioEmail: usuario.email
        };

        ocorrencias.push(novaOcorrencia);

        localStorage.setItem(
            "ocorrencias",
            JSON.stringify(ocorrencias)
        );

    } catch (erro) {

        alert(
            "Não foi possível registrar a ocorrência. " +
            "Verifique o espaço disponível no navegador."
        );

        salvando = false;

        return;
    }

    impedirSalvamento = true;

    let limpezaConcluida = true;

    try {

        if (rascunhoAtualId) {

            const restantes = obterRascunhos().filter(
                item => item.id !== rascunhoAtualId
            );

            localStorage.setItem(
                chaveRascunhos,
                JSON.stringify(restantes)
            );
        }

        localStorage.removeItem(chaveAutomatico);

    } catch (erro) {

        limpezaConcluida = false;

        console.error("Erro ao limpar rascunho:", erro);
    }

    limparFormulario();
    atualizarQuantidadeRascunhos();

    alert(
        limpezaConcluida
            ? "Ocorrência registrada com sucesso!"
            : "Ocorrência registrada, mas não foi possível remover o rascunho."
    );

    window.location.href = "minhas-ocorrencias.html";
});

window.addEventListener("pagehide", function () {

    if (!impedirSalvamento) {
        salvarRascunhoAutomatico();
    }
});

window.addEventListener("pageshow", function (event) {

    if (event.persisted) {

        impedirSalvamento = false;
        salvando = false;

        limparFormulario();
        carregarRascunhoAutomatico();
        atualizarQuantidadeRascunhos();
        mostrarAvatar();
    }
});

migrarRascunhosAntigos();

carregarRascunhoAutomatico();

mostrarAvatar();

atualizarContador();

atualizarPreviaFoto();

atualizarQuantidadeRascunhos();

atualizarModoEdicao();
