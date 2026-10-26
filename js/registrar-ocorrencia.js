const formulario = document.getElementById("form-ocorrencia");
const categoria = document.getElementById("categoria");
const titulo = document.getElementById("titulo");
const local = document.getElementById("local");
const foto = document.getElementById("foto");
const descricao = document.getElementById("descricao");

const contadorDescricao = document.getElementById("contador-descricao");
const botaoRascunho = document.getElementById("botao-rascunho");
const botaoMenu = document.getElementById("botao-menu");
const menuPrincipal = document.getElementById("menu-principal");
const avatarUsuario = document.getElementById("avatar-usuario");

const usuarioLogado = sessionStorage.getItem("usuarioLogado");
const chaveRascunho = `rascunhoOcorrencia_${usuarioLogado || "visitante"}`;

let fotoSelecionada = "";
let salvando = false;

function carregarUsuarios() {
    try {
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
        return Array.isArray(usuarios) ? usuarios : [];
    } catch {
        return [];
    }
}

function obterUsuarioAtual() {
    if (!usuarioLogado) return null;

    return carregarUsuarios().find(
        usuario => usuario.email.toLowerCase() === usuarioLogado.toLowerCase()
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
    if (contadorDescricao) {
        contadorDescricao.textContent = descricao.value.length;
    }
}

function obterDadosFormulario() {
    return {
        categoria: categoria.value,
        titulo: titulo.value.trim(),
        local: local.value.trim(),
        descricao: descricao.value.trim(),
        foto: fotoSelecionada
    };
}

function salvarRascunho() {
    const dados = obterDadosFormulario();

    try {
        localStorage.setItem(chaveRascunho, JSON.stringify(dados));
        return true;
    } catch {
        alert("Não foi possível salvar o rascunho. A imagem pode ser muito grande.");
        return false;
    }
}

function carregarRascunho() {
    try {
        const rascunho = JSON.parse(
            localStorage.getItem(chaveRascunho) || "null"
        );

        if (!rascunho) return;

        categoria.value = rascunho.categoria || "";
        titulo.value = rascunho.titulo || "";
        local.value = rascunho.local || "";
        descricao.value = rascunho.descricao || "";
        fotoSelecionada = rascunho.foto || "";

        atualizarContador();
    } catch {
        localStorage.removeItem(chaveRascunho);
    }
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
        const menuAberto = menuPrincipal.classList.toggle("aberto");
        botaoMenu.setAttribute("aria-expanded", String(menuAberto));
    });
}

descricao.addEventListener("input", function () {
    atualizarContador();
    salvarRascunho();
});

[categoria, titulo, local].forEach(campo => {
    campo.addEventListener("input", salvarRascunho);
    campo.addEventListener("change", salvarRascunho);
});

foto.addEventListener("change", async function () {
    const arquivo = foto.files[0];

    if (!arquivo) {
        fotoSelecionada = "";
        salvarRascunho();
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem válido.");
        foto.value = "";
        return;
    }

    if (arquivo.size > 1.5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 1,5 MB.");
        foto.value = "";
        return;
    }

    try {
        fotoSelecionada = await lerImagem(arquivo);
        salvarRascunho();
    } catch {
        alert("Não foi possível carregar a imagem.");
        foto.value = "";
    }
});

if (botaoRascunho) {
    botaoRascunho.addEventListener("click", function () {
        if (salvarRascunho()) {
            alert("Rascunho salvo neste navegador.");
        }
    });
}

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (salvando) return;

    if (!usuarioLogado || !obterUsuarioAtual()) {
        salvarRascunho();
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

    if (dados.titulo.length < 50 || dados.titulo.length > 200) {
        alert("O título deve possuir entre 50 e 200 caracteres.");
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
        let ocorrencias;

        try {
            ocorrencias = JSON.parse(
                localStorage.getItem("ocorrencias") || "[]"
            );
        } catch {
            ocorrencias = [];
        }

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

        localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias));
        localStorage.removeItem(chaveRascunho);

        alert("Ocorrência registrada com sucesso!");
        window.location.href = "minhas-ocorrencias.html";
    } catch {
        alert(
            "Não foi possível salvar a ocorrência. Verifique o espaço disponível no navegador."
        );
    } finally {
        salvando = false;
    }
});

window.addEventListener("beforeunload", function () {
    salvarRascunho();
});

carregarRascunho();
mostrarAvatar();
atualizarContador();