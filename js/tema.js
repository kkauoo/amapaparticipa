
(function () {
    "use strict";

    const CHAVE_TEMA = "temaAmapaParticipa";
    const CHAVE_FONTE = "tamanhoFonte";

    const temasValidos = ["claro", "escuro"];
    const fontesValidas = ["normal", "medio", "grande"];

    function obterTema() {
        const tema = localStorage.getItem(CHAVE_TEMA);

        return temasValidos.includes(tema)
            ? tema
            : "claro";
    }

    function obterFonte() {
        const fonte = localStorage.getItem(CHAVE_FONTE);

        return fontesValidas.includes(fonte)
            ? fonte
            : "normal";
    }

    function atualizarBotoesTema(tema) {
        document.querySelectorAll(".configuracoes-tema")
            .forEach(function (botao) {
                const selecionado = botao.id === "tema-" + tema;

                botao.classList.toggle("ativo", selecionado);
                botao.setAttribute("aria-pressed", String(selecionado));
            });
    }

    function atualizarOpcoesFonte(fonte) {
        document.querySelectorAll('input[name="tamanho-fonte"]')
            .forEach(function (opcao) {
                opcao.checked = opcao.value === fonte;
            });
    }

    function aplicarTema(tema) {
        if (!temasValidos.includes(tema)) return;

        document.documentElement.setAttribute("data-tema", tema);
        atualizarBotoesTema(tema);
    }

    function aplicarFonte(fonte) {
        if (!fontesValidas.includes(fonte)) return;

        document.documentElement.classList.remove(
            "fonte-normal",
            "fonte-medio",
            "fonte-grande"
        );

        document.documentElement.classList.add("fonte-" + fonte);
        atualizarOpcoesFonte(fonte);
    }

    function definirTema(tema) {
        if (!temasValidos.includes(tema)) return;

        localStorage.setItem(CHAVE_TEMA, tema);
        aplicarTema(tema);
    }

    function definirFonte(fonte) {
        if (!fontesValidas.includes(fonte)) return;

        localStorage.setItem(CHAVE_FONTE, fonte);
        aplicarFonte(fonte);
    }

    // Disponibiliza as funções para os outros arquivos.
    window.AmapaPreferencias = {
        obterTema,
        obterFonte,
        definirTema,
        definirFonte
    };

    // Aplica as preferências assim que o arquivo é carregado.
    aplicarTema(obterTema());
    aplicarFonte(obterFonte());

    document.addEventListener("DOMContentLoaded", function () {
        atualizarBotoesTema(obterTema());
        atualizarOpcoesFonte(obterFonte());

        document.querySelectorAll(".configuracoes-tema")
            .forEach(function (botao) {
                botao.addEventListener("click", function () {
                    definirTema(
                        botao.id === "tema-escuro"
                            ? "escuro"
                            : "claro"
                    );
                });
            });

        document.querySelectorAll('input[name="tamanho-fonte"]')
            .forEach(function (opcao) {
                opcao.addEventListener("change", function () {
                    if (opcao.checked) {
                        definirFonte(opcao.value);
                    }
                });
            });
    });

})();
