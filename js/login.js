const formulario = document.getElementById("form-login");
const identificador = document.getElementById("identificador");
const senha = document.getElementById("senha");
const mostrarSenha = document.getElementById("mostrar-senha");
const lembrarMim = document.getElementById("lembrar-mim");

function encontrarUsuario(valor) {
    const usuariosSalvos = localStorage.getItem("usuarios");

    if (!usuariosSalvos) {
        return null;
    }

    let usuarios;

    try {
        usuarios = JSON.parse(usuariosSalvos);
    } catch {
        return null;
    }

    if (!Array.isArray(usuarios)) {
        return null;
    }

    const valorNormalizado = valor.trim().toLowerCase();
    const cpfNormalizado = valor.replace(/\D/g, "");

    return usuarios.find(function (usuario) {
        return (
            usuario.email.toLowerCase() === valorNormalizado ||
            usuario.cpf === cpfNormalizado
        );
    });
}

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const valorIdentificador = identificador.value.trim();
    const valorSenha = senha.value;

    const usuario = encontrarUsuario(valorIdentificador);

    if (!usuario) {
        alert("Conta não cadastrada.");
        return;
    }

    if (valorSenha !== usuario.senha) {
        alert("Informações incorretas ou inválidas.");
        return;
    }

    sessionStorage.setItem("usuarioLogado", usuario.email);

    if (lembrarMim.checked) {
        localStorage.setItem("usuarioLembrado", usuario.email);
    } else {
        localStorage.removeItem("usuarioLembrado");
    }

    alert("Login realizado com sucesso!");

    window.location.href = "../index.html";
});

mostrarSenha.addEventListener("click", function () {
    if (senha.type === "password") {
        senha.type = "text";
        mostrarSenha.src = "../img/olhoaberto.png";
        mostrarSenha.alt = "Ocultar senha";
    } else {
        senha.type = "password";
        mostrarSenha.src = "../img/olhofechado.png";
        mostrarSenha.alt = "Mostrar senha";
    }
});