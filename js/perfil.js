
function carregarUsuarios() {
    try {
        const dados = JSON.parse(localStorage.getItem("usuarios") || "[]");
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function obterUsuarioAtual() {
    const emailLogado = sessionStorage.getItem("usuarioLogado");

    if (!emailLogado) return null;

    return carregarUsuarios().find(usuario =>
        usuario.email &&
        usuario.email.toLowerCase() === emailLogado.toLowerCase()
    ) || null;
}

function mascararEmail(email) {
    if (!email || !email.includes("@")) {
        return "Não informado";
    }

    const [usuario, dominio] = email.split("@");

    if (usuario.length <= 2) {
        return `${usuario[0] || "*"}***@${dominio}`;
    }

    return `${usuario.slice(0, 2)}***@${dominio}`;
}

function mascararCPF(cpf) {
    const numeros = String(cpf || "").replace(/\D/g, "");

    if (numeros.length !== 11) return "Não informado";

    return `***.***.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
}

function mascararTelefone(telefone) {
    const numeros = String(telefone || "").replace(/\D/g, "");

    if (numeros.length < 10) return "Não informado";

    return `(${numeros.slice(0, 2)}) *****-${numeros.slice(-4)}`;
}

function obterIniciais(nome) {
    if (!nome) return "?";

    return nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(parte => parte[0])
        .join("")
        .toUpperCase();
}

function preencherTexto(id, texto) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }
}

function carregarPerfil() {
    const usuario = obterUsuarioAtual();

    if (!usuario) {
        alert("Faça login para acessar seu perfil.");
        window.location.href = "login.html";
        return;
    }

    const iniciais = obterIniciais(usuario.nome);
    const emailMascarado = mascararEmail(usuario.email);

    preencherTexto("avatar-topo", iniciais);
    preencherTexto("avatar-lateral", iniciais);
    preencherTexto("avatar-principal", iniciais);

    preencherTexto("nome-lateral", usuario.nome || "Usuário");
    preencherTexto("nome-usuario", usuario.nome || "Não informado");
    preencherTexto("email-resumo", emailMascarado);

    preencherTexto("nome-detalhe", usuario.nome || "Não informado");
    preencherTexto("email-detalhe", emailMascarado);
    preencherTexto("cpf-detalhe", mascararCPF(usuario.cpf));
    preencherTexto("telefone-detalhe", mascararTelefone(usuario.telefone));
}

function formatarCPF(valor) {
    const numeros = String(valor || "").replace(/\D/g, "").slice(0, 11);

    return numeros
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatarTelefone(valor) {
    const numeros = String(valor || "").replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
        return numeros ? `(${numeros}` : "";
    }

    const ddd = numeros.slice(0, 2);
    const restante = numeros.slice(2);

    if (restante.length <= 4) {
        return `(${ddd}) ${restante}`;
    }

    if (numeros.length <= 10) {
        return `(${ddd}) ${restante.slice(0, 4)}-${restante.slice(4)}`;
    }

    return `(${ddd}) ${restante.slice(0, 5)}-${restante.slice(5)}`;
}

function validarCPF(cpf) {
    const numeros = String(cpf || "").replace(/\D/g, "");

    if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) {
        return false;
    }

    for (let tamanho = 9; tamanho <= 10; tamanho++) {
        let soma = 0;

        for (let i = 0; i < tamanho; i++) {
            soma += Number(numeros[i]) * (tamanho + 1 - i);
        }

        let digito = (soma * 10) % 11;

        if (digito === 10) digito = 0;

        if (digito !== Number(numeros[tamanho])) {
            return false;
        }
    }

    return true;
}

const botaoSair = document.getElementById("botao-sair");

if (botaoSair) {
    botaoSair.addEventListener("click", function () {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    });
}

const botaoEditar = document.getElementById("botao-editar");
const modalVerificacao = document.getElementById("modal-verificacao");
const formularioVerificacao = document.getElementById("form-verificacao");
const campoSenhaVerificacao = document.getElementById("senha-verificacao");
const erroVerificacao = document.getElementById("erro-verificacao");
const fecharVerificacao = document.getElementById("fechar-verificacao");

const edicaoPerfil = document.getElementById("edicao-perfil");
const formularioEdicao = document.getElementById("form-edicao-perfil");
const erroEdicao = document.getElementById("erro-edicao-perfil");

const campoNome = document.getElementById("editar-nome");
const campoEmail = document.getElementById("editar-email");
const campoCPF = document.getElementById("editar-cpf");
const campoTelefone = document.getElementById("editar-telefone");

const tituloModal = document.getElementById("titulo-verificacao");
const descricaoModal = modalVerificacao
    ? modalVerificacao.querySelector(".modal-verificacao-conteudo > p")
    : null;

function mostrarVerificacao() {
    if (formularioVerificacao) formularioVerificacao.hidden = false;
    if (edicaoPerfil) edicaoPerfil.hidden = true;

    if (tituloModal) tituloModal.textContent = "Confirmar identidade";

    if (descricaoModal) {
        descricaoModal.textContent =
            "Informe sua senha atual para continuar com a edição do perfil.";
    }
}

function abrirModal() {
    if (
        !modalVerificacao ||
        !formularioVerificacao ||
        !formularioEdicao ||
        !edicaoPerfil
    ) {
        alert("O formulário de edição não foi encontrado no HTML.");
        return;
    }

    mostrarVerificacao();

    formularioVerificacao.reset();
    formularioEdicao.reset();

    if (erroVerificacao) erroVerificacao.textContent = "";
    if (erroEdicao) erroEdicao.textContent = "";

    modalVerificacao.hidden = false;

    if (campoSenhaVerificacao) campoSenhaVerificacao.focus();
}

function fecharModal() {
    if (modalVerificacao) modalVerificacao.hidden = true;

    if (formularioVerificacao) formularioVerificacao.reset();
    if (formularioEdicao) formularioEdicao.reset();

    if (erroVerificacao) erroVerificacao.textContent = "";
    if (erroEdicao) erroEdicao.textContent = "";

    mostrarVerificacao();
}

if (botaoEditar) {
    botaoEditar.addEventListener("click", abrirModal);
}

if (fecharVerificacao) {
    fecharVerificacao.addEventListener("click", fecharModal);
}

if (modalVerificacao) {
    modalVerificacao.addEventListener("click", function (event) {
        if (event.target === modalVerificacao) {
            fecharModal();
        }
    });
}

if (formularioVerificacao) {
    formularioVerificacao.addEventListener("submit", function (event) {
        event.preventDefault();

        const usuario = obterUsuarioAtual();

        if (!usuario) {
            alert("Não foi possível localizar sua conta. Entre novamente.");
            window.location.href = "login.html";
            return;
        }

        if (campoSenhaVerificacao.value !== usuario.senha) {
            erroVerificacao.textContent = "Senha incorreta. Tente novamente.";
            campoSenhaVerificacao.focus();
            return;
        }

        campoNome.value = usuario.nome || "";
        campoEmail.value = usuario.email || "";
        campoCPF.value = formatarCPF(usuario.cpf || "");
        campoTelefone.value = formatarTelefone(usuario.telefone || "");

        formularioVerificacao.hidden = true;
        edicaoPerfil.hidden = false;

        if (tituloModal) tituloModal.textContent = "Editar perfil";

        if (descricaoModal) {
            descricaoModal.textContent = "Atualize seus dados pessoais abaixo.";
        }

        campoNome.focus();
    });
}

if (campoCPF) {
    campoCPF.addEventListener("input", function () {
        campoCPF.value = formatarCPF(campoCPF.value);
    });
}

if (campoTelefone) {
    campoTelefone.addEventListener("input", function () {
        campoTelefone.value = formatarTelefone(campoTelefone.value);
    });
}

if (formularioEdicao) {
    formularioEdicao.addEventListener("submit", function (event) {
        event.preventDefault();

        erroEdicao.textContent = "";

        const usuarioAtual = obterUsuarioAtual();

        if (!usuarioAtual) {
            alert("Não foi possível localizar sua conta. Entre novamente.");
            window.location.href = "login.html";
            return;
        }

        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim().toLowerCase();
        const cpf = campoCPF.value.replace(/\D/g, "");
        const cpfOriginal = String(usuarioAtual.cpf || "").replace(/\D/g, "");
        const telefone = campoTelefone.value.replace(/\D/g, "");

        if (!/^[\p{L}\s]+$/u.test(nome)) {
            erroEdicao.textContent =
                "Informe um nome válido, usando apenas letras e espaços.";
            campoNome.focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            erroEdicao.textContent = "Informe um e-mail válido.";
            campoEmail.focus();
            return;
        }

        const cpfFoiMantido = cpf === cpfOriginal;

        if (!cpfFoiMantido && !validarCPF(cpf)) {
            erroEdicao.textContent =
                "O novo CPF informado não é válido. Confira os números digitados.";
            campoCPF.focus();
            return;
        }

        if (telefone.length !== 10 && telefone.length !== 11) {
            erroEdicao.textContent =
                "Informe um telefone com DDD e número válido.";
            campoTelefone.focus();
            return;
        }

        const usuarios = carregarUsuarios();
        const emailAntigo = usuarioAtual.email;
        const emailAntigoNormalizado = emailAntigo.toLowerCase();

        const emailEmUso = usuarios.some(usuario =>
            usuario.email &&
            usuario.email.toLowerCase() === email &&
            usuario.email.toLowerCase() !== emailAntigoNormalizado
        );

        if (emailEmUso) {
            erroEdicao.textContent =
                "Este e-mail já está cadastrado em outra conta.";
            campoEmail.focus();
            return;
        }

        const cpfEmUso = usuarios.some(usuario =>
            usuario.email &&
            usuario.email.toLowerCase() !== emailAntigoNormalizado &&
            String(usuario.cpf || "").replace(/\D/g, "") === cpf
        );

        if (cpfEmUso) {
            erroEdicao.textContent =
                "Este CPF já está cadastrado em outra conta.";
            campoCPF.focus();
            return;
        }

        const indiceUsuario = usuarios.findIndex(usuario =>
            usuario.email &&
            usuario.email.toLowerCase() === emailAntigoNormalizado
        );

        if (indiceUsuario === -1) {
            erroEdicao.textContent =
                "Não foi possível localizar sua conta para atualizar os dados.";
            return;
        }

        usuarios[indiceUsuario] = {
            ...usuarios[indiceUsuario],
            nome,
            email,
            cpf: formatarCPF(cpf),
            telefone: formatarTelefone(telefone)
        };

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        if (email !== emailAntigoNormalizado) {
            sessionStorage.setItem("usuarioLogado", email);

            try {
                const ocorrencias = JSON.parse(
                    localStorage.getItem("ocorrencias") || "[]"
                );

                if (Array.isArray(ocorrencias)) {
                    ocorrencias.forEach(ocorrencia => {
                        if (
                            ocorrencia.usuarioEmail &&
                            ocorrencia.usuarioEmail.toLowerCase() ===
                                emailAntigoNormalizado
                        ) {
                            ocorrencia.usuarioEmail = email;
                        }
                    });

                    localStorage.setItem(
                        "ocorrencias",
                        JSON.stringify(ocorrencias)
                    );
                }
            } catch {
                console.error("Não foi possível atualizar as ocorrências.");
            }
        }

        carregarPerfil();
        fecharModal();

        alert("Perfil atualizado com sucesso!");
    });
}

carregarPerfil();
