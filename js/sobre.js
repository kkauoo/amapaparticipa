
document.addEventListener("DOMContentLoaded", function () {

    const avatarUsuario = document.getElementById("avatar-usuario");
    const iniciaisUsuario = document.getElementById("iniciais-usuario");

    const emailLogado = sessionStorage.getItem("usuarioLogado");

    const usuarios = JSON.parse(
        localStorage.getItem("usuarios") || "[]"
    );

    if (!emailLogado) {
        iniciaisUsuario.textContent = "?";
        return;
    }

    const usuario = usuarios.find(function (usuario) {
        return usuario.email === emailLogado;
    });

    if (!usuario) {
        iniciaisUsuario.textContent = "?";
        return;
    }

    const partesNome = usuario.nome.trim().split(/\s+/);

    let iniciais;

    if (partesNome.length >= 2) {
        iniciais =
            partesNome[0][0] +
            partesNome[partesNome.length - 1][0];
    } else {
        iniciais = partesNome[0].substring(0, 2);
    }

    iniciaisUsuario.textContent = iniciais.toUpperCase();

});
