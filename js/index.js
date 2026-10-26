function carregarUsuarios() {
    try {
        const dados = localStorage.getItem("usuarios");
        return dados ? JSON.parse(dados) : [];
    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
        return [];
    }
}

function obterUsuarioAtual() {
    const emailLogado = sessionStorage.getItem("usuarioLogado");

    if (!emailLogado) {
        return null;
    }

    const usuarios = carregarUsuarios();

    return usuarios.find(function (usuario) {
        return (
            usuario.email &&
            usuario.email.trim().toLowerCase() ===
            emailLogado.trim().toLowerCase()
        );
    }) || null;
}

function obterIniciais(nome) {
    if (!nome || typeof nome !== "string") {
        return "?";
    }

    const partes = nome.trim().split(/\s+/).filter(Boolean);

    if (partes.length === 0) {
        return "?";
    }

    if (partes.length === 1) {
        return partes[0].slice(0, 2).toUpperCase();
    }

    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();
}

function atualizarCabecalho() {
    const autenticacao = document.getElementById("cabecalho-autenticacao");
    const avatar = document.getElementById("avatar-usuario");
    const iniciais = document.getElementById("iniciais-usuario");

    if (!autenticacao || !avatar || !iniciais) {
        console.error("Elementos do avatar não encontrados no index.html.");
        return;
    }

    const usuario = obterUsuarioAtual();

    if (usuario) {
        autenticacao.hidden = true;
        avatar.hidden = false;

        iniciais.textContent = obterIniciais(usuario.nome);

        avatar.setAttribute(
            "aria-label",
            "Acessar perfil de " + usuario.nome
        );

        avatar.setAttribute(
            "title",
            "Meu perfil: " + usuario.nome
        );
    } else {
        autenticacao.hidden = false;
        avatar.hidden = true;
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", atualizarCabecalho);
} else {
    atualizarCabecalho();
}