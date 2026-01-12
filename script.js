// Carrega o saldo salvo no navegador ou começa com 0
let saldoGeral = parseFloat(localStorage.getItem('saldoJN')) || 0;

function atualizarTela() {
    document.getElementById('valor-saldo').innerText = "R$ " + saldoGeral.toFixed(2);
    localStorage.setItem('saldoJN', saldoGeral);
}

// Função de Login
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

// FUNÇÃO DE DEPÓSITO (ABRE O MERCADO PAGO)
function depositar() {
    const valor = parseFloat(document.getElementById('valor-deposito').value);
    
    if (valor >= 60) {
        const linkMercadoPago = "https://mpago.la/1S7yFMw"; 

        alert("REDIRECIONANDO...\n\n1. Pague o PIX no Mercado Pago.\n2. Tire um print do comprovante.\n3. Clique no botão verde 'Confirmar no WhatsApp' para eu liberar seu saldo.");
        
        // Abre o Mercado Pago
        window.open(linkMercadoPago, '_blank');
    } else {
        alert("O valor mínimo de depósito é R$ 60,00");
    }
}

// FUNÇÃO PARA CONFIRMAR PAGAMENTO COM VOCÊ
function confirmarNoWhatsapp() {
    const meuNumero = "5589994222704"; // SEU NÚMERO CONFIGURADO
    const texto = "Olá JN LUXS, acabei de fazer um depósito de R$ 60 e quero meu saldo. Segue o comprovante:";
    window.open("https://wa.me/" + meuNumero + "?text=" + encodeURI(texto));
}

// Comprar Planos
function comprarPlano(custo, rendimento) {
    if (saldoGeral >= custo) {
        saldoGeral -= custo;
        atualizarTela();
        alert("Plano ativado com sucesso! Seus rendimentos começaram.");
    } else {
        alert("Saldo insuficiente! Deposite primeiro para ativar este plano.");
    }
}

// Saque
function sacar() {
    const chave = document.getElementById('chave-pix').value;
    const valor = parseFloat(document.getElementById('valor-saque').value);

    if (chave === "" || isNaN(valor)) {
        alert("Preencha a chave PIX e o valor!");
        return;
    }

    if (valor >= 20) {
        if (saldoGeral >= valor) {
            saldoGeral -= valor;
            atualizarTela();
            alert("Saque de R$ " + valor.toFixed(2) + " solicitado!\nEnvie o comprovante no WhatsApp para agilizar.");
        } else {
            alert("Você não tem saldo suficiente.");
        }
    } else {
        alert("O valor mínimo de saque é R$ 20,00");
    }
}
