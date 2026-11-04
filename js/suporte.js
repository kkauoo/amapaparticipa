document.addEventListener("DOMContentLoaded", function () {
    const campoFeedback = document.getElementById("texto-feedback");
    const contadorCaracteres = document.getElementById("contador-caracteres");
    const avisoCaracteres = document.getElementById("aviso-caracteres");
    const botaoEnviar = document.getElementById("botao-enviar-feedback");
    const formulario = document.getElementById("form-feedback");
    const mensagemFeedback = document.getElementById("mensagem-feedback");

    const avatarUsuario = document.getElementById("avatar-usuario");
    const iniciaisUsuario = document.getElementById("iniciais-usuario");

    const minimoCaracteres = 50;
    const maximoCaracteres = 500;

    function atualizarFeedback() {
        const quantidade = campoFeedback.value.length;

        contadorCaracteres.textContent =
            `${quantidade} / ${maximoCaracteres} caracteres`;

        botaoEnviar.hidden = quantidade < minimoCaracteres;

        if (quantidade < minimoCaracteres) {
            avisoCaracteres.textContent =
                `Digite pelo menos ${minimoCaracteres} caracteres.`;
        } else {
            avisoCaracteres.textContent = "Você já pode enviar seu feedback.";
        }

        if (quantidade > maximoCaracteres) {
            campoFeedback.value = campoFeedback.value.slice(0, maximoCaracteres);
        }
    }

    campoFeedback.addEventListener("input", function () {
        mensagemFeedback.textContent = "";
        mensagemFeedback.className = "";
        atualizarFeedback();
    });

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const texto = campoFeedback.value.trim();

        if (texto.length < minimoCaracteres || texto.length > maximoCaracteres) {
            mensagemFeedback.textContent =
                "O feedback deve possuir entre 50 e 500 caracteres.";
            mensagemFeedback.className = "mensagem-erro";
            return;
        }

        try {
            const feedbacks = JSON.parse(
                localStorage.getItem("feedbacks") || "[]"
            );

            const emailLogado = sessionStorage.getItem("usuarioLogado");

            const novoFeedback = {
                texto: texto,
                usuario: emailLogado || "Convidado",
                data: new Date().toISOString()
            };

            feedbacks.push(novoFeedback);

            localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

            mensagemFeedback.textContent = "Feedback enviado!";
            mensagemFeedback.className = "mensagem-sucesso";

            formulario.reset();
            atualizarFeedback();

        } catch (erro) {
            mensagemFeedback.textContent =
                "Não foi possível registrar o feedback. Tente novamente.";
            mensagemFeedback.className = "mensagem-erro";
        }
    });

    function carregarAvatar() {
        if (!avatarUsuario || !iniciaisUsuario) {
            return;
        }

        const emailLogado = sessionStorage.getItem("usuarioLogado");
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        if (!emailLogado) {
            iniciaisUsuario.textContent = "?";
            return;
        }

        const usuario = usuarios.find(function (item) {
            return item.email === emailLogado;
        });

        if (!usuario || !usuario.nome) {
            iniciaisUsuario.textContent = "?";
            return;
        }

        const partesNome = usuario.nome.trim().split(/\s+/);

        let iniciais;

        if (partesNome.length >= 2) {
            iniciais = partesNome[0][0] + partesNome[partesNome.length - 1][0];
        } else {
            iniciais = partesNome[0].substring(0, 2);
        }

        iniciaisUsuario.textContent = iniciais.toUpperCase();
    }

    atualizarFeedback();
    carregarAvatar();
});