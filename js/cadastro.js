const formulario = document.getElementById("form-cadastro");
const nome = document.getElementById("nome");
const cpf = document.getElementById("cpf");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const senha = document.getElementById("senha");
const termos = document.getElementById("termos");
const mostrarSenha = document.getElementById("mostrar-senha");

const requisitoTamanho = document.getElementById("requisito-tamanho");
const requisitoMaiuscula = document.getElementById("requisito-maiuscula");
const requisitoMinuscula = document.getElementById("requisito-minuscula");
const requisitoNumero = document.getElementById("requisito-numero");
const requisitoEspecial = document.getElementById("requisito-especial");
const requisitoEspaco = document.getElementById("requisito-espaco");

nome.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
});

cpf.addEventListener("input", function () {
    let valor = this.value.replace(/\D/g, "");

    valor = valor.substring(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    this.value = valor;
});

telefone.addEventListener("input", function () {
    let valor = this.value.replace(/\D/g, "");

    valor = valor.substring(0, 11);

    if (valor.length > 2) {
        valor = "(" + valor.substring(0, 2) + ") " + valor.substring(2);
    }

    if (valor.length > 10) {
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }

    this.value = valor;
});

senha.addEventListener("input", function () {
    this.value = this.value.substring(0, 20);

    const valor = this.value;

    const possuiTamanho = valor.length >= 8;
    const possuiMaiuscula = /[A-Z]/.test(valor);
    const possuiMinuscula = /[a-z]/.test(valor);
    const possuiNumero = /[0-9]/.test(valor);
    const possuiEspecial = /[^A-Za-z0-9\s]/.test(valor);
    const possuiEspaco = /\s/.test(valor);

    requisitoTamanho.classList.toggle("valido", possuiTamanho);
    requisitoMaiuscula.classList.toggle("valido", possuiMaiuscula);
    requisitoMinuscula.classList.toggle("valido", possuiMinuscula);
    requisitoNumero.classList.toggle("valido", possuiNumero);
    requisitoEspecial.classList.toggle("valido", possuiEspecial);
    requisitoEspaco.classList.toggle(
        "valido",
        valor.length > 0 && !possuiEspaco
    );
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

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nomeNormalizado = nome.value.trim();
    const cpfNormalizado = cpf.value.replace(/\D/g, "");
    const emailNormalizado = email.value.trim().toLowerCase();
    const telefoneNormalizado = telefone.value.replace(/\D/g, "");

    const nomeValido = /^[A-Za-zÀ-ÿ\s]+$/.test(nomeNormalizado);

    const cpfValido = cpfNormalizado.length === 11;

    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado);

    const telefoneValido = telefoneNormalizado.length === 11;

    const possuiTamanho = senha.value.length >= 8;
    const possuiMaiuscula = /[A-Z]/.test(senha.value);
    const possuiMinuscula = /[a-z]/.test(senha.value);
    const possuiNumero = /[0-9]/.test(senha.value);
    const possuiEspecial = /[^A-Za-z0-9\s]/.test(senha.value);
    const possuiEspaco = /\s/.test(senha.value);

    const senhaValida =
        possuiTamanho &&
        possuiMaiuscula &&
        possuiMinuscula &&
        possuiNumero &&
        possuiEspecial &&
        !possuiEspaco;

    const termosAceitos = termos.checked;

    if (
        !nomeValido ||
        !cpfValido ||
        !emailValido ||
        !telefoneValido ||
        !senhaValida ||
        !termosAceitos
    ) {
        alert("Dados inválidos. Cadastro falhou.");
        return;
    }

    const usuariosSalvos = localStorage.getItem("usuarios");

    let usuarios = [];

    if (usuariosSalvos) {
        try {
            usuarios = JSON.parse(usuariosSalvos);

            if (!Array.isArray(usuarios)) {
                usuarios = [];
            }
        } catch {
            usuarios = [];
        }
    }

    const cpfDuplicado = usuarios.some(function (usuario) {
        return usuario.cpf === cpfNormalizado;
    });

    const emailDuplicado = usuarios.some(function (usuario) {
        return usuario.email.toLowerCase() === emailNormalizado;
    });

    const telefoneDuplicado = usuarios.some(function (usuario) {
        return usuario.telefone === telefoneNormalizado;
    });

    if (cpfDuplicado || emailDuplicado || telefoneDuplicado) {
        alert("Dados já cadastrados.");
        return;
    }

    const usuario = {
        id: Date.now(),
        nome: nomeNormalizado,
        cpf: cpfNormalizado,
        email: emailNormalizado,
        telefone: telefoneNormalizado,
        senha: senha.value
    };

    usuarios.push(usuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    const irParaLogin = confirm(
        "Cadastro realizado. Fazer Login na conta."
    );

    if (irParaLogin) {
        window.location.href = "login.html";
    }
});