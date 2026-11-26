
document.addEventListener("DOMContentLoaded", function () {
    // Evita adicionar o VLibras duas vezes
    if (document.querySelector("[vw]")) {
        return;
    }

    // Cria a estrutura do VLibras
    const vlibras = document.createElement("div");
    vlibras.setAttribute("vw", "");
    vlibras.className = "enabled";

    vlibras.innerHTML = `
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
    `;

    document.body.appendChild(vlibras);

    // Carrega o script oficial do VLibras
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";

    script.onload = function () {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
    };

    script.onerror = function () {
        console.error("Não foi possível carregar o VLibras.");
    };

    document.body.appendChild(script);
});
