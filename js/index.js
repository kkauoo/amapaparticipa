const botaoOcorrencia = document.getElementById("botao-ocorrencia");

const botaoPesquisa = document.getElementById("botao-pesquisa");

if (botaoOcorrencia) {

    botaoOcorrencia.addEventListener("click", function (event) {

        event.preventDefault();

        window.location.href = "paginas/registrar-ocorrencia.html";

    });

}

if (botaoPesquisa) {

    botaoPesquisa.addEventListener("click", function () {

        alert("A função de pesquisa será disponibilizada em breve.");

    });

}