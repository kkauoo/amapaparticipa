
document.addEventListener("DOMContentLoaded", function () {

    // BOTÃO DE FECHAR CONFIGURAÇÕES

    const botaoFechar = document.getElementById(
        "botao-fechar-configuracoes"
    );

    if (botaoFechar) {
        botaoFechar.addEventListener("click", function () {

            const paginaAnterior = sessionStorage.getItem(
                "paginaAnteriorConfiguracoes"
            );

            if (paginaAnterior) {

                sessionStorage.removeItem(
                    "paginaAnteriorConfiguracoes"
                );

                window.location.href = paginaAnterior;

            } else {

                window.location.href = "../index.html";

            }

        });
    }

    // SAIR DA CONTA

    const botaoSair = document.getElementById(
        "botao-sair-conta"
    );

    if (botaoSair) {

        botaoSair.addEventListener("click", function () {

            const confirmar = window.confirm(
                "Deseja realmente sair da sua conta?"
            );

            if (!confirmar) {
                return;
            }

            sessionStorage.removeItem("usuarioLogado");

            sessionStorage.removeItem(
                "paginaAnteriorConfiguracoes"
            );

            window.location.href = "login.html";

        });

    }

});
