// Carrega o saldo salvo no navegador ou começa com 0
let saldoGeral = parseFloat(localStorage.getItem('saldoJN')) || 0;

function atualizarTela() {
    document.getElementById('valor-saldo').innerText = "R$ " + saldoGeral.toFixed(2);
    localStorage.setItem('saldoJN', saldoGeral);
}

function entrarNoSite() {
    const user = document.getElementById('campo-usuario').value;
    if (user !== "") {
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('painel-usuario').style.display = 'block';
        document.getElementById('nome-cliente').innerText = user;
        atualizarTela();
    } else {
        alert("Digite um nome de usuário!");
    }
}

function depositar() {
    const valor = parseFloat(document.getElementById('valor-deposito').value);
    if (valor >= 60) {
        alert("QR Code PIX de R$ " + valor.toFixed(2) + " gerado!\n(O saldo será creditado após a confirmação)");
        // Simulação de crédito após 2 segundos
        setTimeout(() => {
            saldoGeral += valor;
            atualizarTela();
            alert("Depósito de R$ " + valor + " confirmado!");
        }, 2000);
    } else {
        alert("O valor mínimo de depósito é R$ 60,00");
    }
}

function comprarPlano(custo, rendimento) {
    if (saldoGeral >= custo) {
        saldoGeral -= custo;
        atualizarTela();
        alert("Plano ativado com sucesso! Você receberá R$ " + rendimento + " por dia.");
    } else {
        alert("Saldo insuficiente! Deposite pelo menos R$ " + (custo - saldoGeral).toFixed(2));
    }
}

function sacar() {
    const chave = document.getElementById('chave-pix').value;
    const valor = parseFloat(document.getElementById('valor-saque').value);

    if (chave === "") {
        alert("Informe sua chave PIX!");
        return;
    }

    if (valor >= 20) {
        if (saldoGeral >= valor) {
            saldoGeral -= valor;
            atualizarTela();
            alert("Saque solicitado para a chave " + chave + "!\nPrazo de 24h para cair na conta.");
        } else {
            alert("Saldo insuficiente para este saque!");
        }
    } else {
        alert("O valor mínimo de saque é R$ 20,00");
    }
}
