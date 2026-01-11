// Função para simular o login
function entrarNoSite() {
    const usuario = document.getElementById('campo-usuario').value;
    const senha = document.getElementById('campo-senha').value;

    if (usuario !== "" && senha !== "") {
        // Esconde a tela de login e mostra o painel
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('painel-usuario').style.display = 'block';
        
        // Coloca o nome do usuário na tela
        document.getElementById('nome-cliente').innerText = usuario;
    } else {
        alert("Por favor, preencha o usuário e a senha!");
    }
}

// Função para o botão de investimento
function pagar(valor) {
    alert("Você escolheu o plano de R$ " + valor + ". \n\nSistema: Aguardando integração com o PIX...");
}
