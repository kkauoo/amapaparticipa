const formulario = document.getElementById("form-ocorrencia");

const categoria = document.getElementById("categoria");
const titulo = document.getElementById("titulo");
const local = document.getElementById("local");
const foto = document.getElementById("foto");
const descricao = document.getElementById("descricao");

const contadorDescricao =
    document.getElementById("contador-descricao");

const botaoRascunho =
    document.getElementById("botao-rascunho");

const botaoMenu =
    document.getElementById("botao-menu");

const menuPrincipal =
    document.getElementById("menu-principal");

const avatarUsuario =
    document.getElementById("avatar-usuario");


descricao.addEventListener("input", function () {
    contadorDescricao.textContent =
        this.value.length;
});


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


function mostrarAvatar() {

    const usuarioLogado =
        sessionStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
        avatarUsuario.textContent = "?";
        return;
    }

    const iniciais =
        usuarioLogado
            .substring(0, 2)
            .toUpperCase();

    avatarUsuario.textContent = iniciais;
}


formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const categoriaValor =
            categoria.value.trim();

        const tituloValor =
            titulo.value.trim();

        const localValor =
            local.value.trim();

        const descricaoValor =
            descricao.value.trim();


        if (!categoriaValor) {
            alert("Selecione uma categoria.");
            categoria.focus();
            return;
        }


        if (!tituloValor) {
            alert("Informe um título para a ocorrência.");
            titulo.focus();
            return;
        }


        if (!localValor) {
            alert("Informe a localização do problema.");
            local.focus();
            return;
        }


        if (foto.files.length === 0) {
            alert("Adicione pelo menos uma foto.");
            foto.focus();
            return;
        }


        if (!descricaoValor) {
            alert("Informe uma descrição do problema.");
            descricao.focus();
            return;
        }


        if (descricaoValor.length > 500) {
            alert("A descrição deve possuir no máximo 500 caracteres.");
            descricao.focus();
            return;
        }


        alert("Todos os dados da ocorrência foram preenchidos corretamente.");
    }
);


botaoRascunho.addEventListener(
    "click",
    function () {
    }
);


mostrarAvatar();