// Carrega o saldo salvo no navegador ou começa com 0
let saldoGeral = parseFloat(localStorage.getItem('saldoJN')) || 0;

function atualizarTela() {
    // Atualiza o valor na tela do site
    document.getElementById('valor-saldo').innerText = "R$ " + saldoGeral.toFixed(2);
    // Salva na memória do navegador para não sumir ao atualizar
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

// Função de Depósito com seu link do Mercado Pago
function depositar() {
    const valor = parseFloat(document.getElementById('valor-deposito').value);
    
    if (valor >= 60) {
        // Seu link real do Mercado Pago
        const linkMercadoPago = "https://mpago.la/1S7yFMw"; 

        alert("Redirecionando para o Pagamento de R$ " + valor.toFixed(2));
        
        // Abre o seu link do Mercado Pago em uma nova aba
        window.open(linkMercadoPago, '_blank');

        alert("Após pagar, o saldo cairá automaticamente em sua conta em instantes.");

        // Simulação: Adiciona o saldo após 5 segundos (tempo do cliente pagar)
        setTimeout(() => {
            saldoGeral += valor;
            atualizarTela();
            alert("Sucesso! O depósito de R$ " + valor.toFixed(2) + " foi creditado.");
        }, 5000); 

    } else {
        alert("O valor mínimo de depósito é R$ 60,00");
    }
}

// Função para comprar os planos
function comprarPlano(custo, rendimento) {
    if (saldoGeral >= custo) {
        saldoGeral -= custo;
        atualizarTela();
        alert("Plano ativado com sucesso! Você receberá R$ " + rendimento.toFixed(2) + " por dia.");
        
        // Inicia o rendimento automático para este usuário
        iniciarRendimento(rendimento);
    } else {
        alert("Saldo insuficiente! Deposite pelo menos R$ " + (custo - saldoGeral).toFixed(2));
    }
}

// Função de Saque
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
            alert("Saque solicitado para a chave " + chave + "!\nO prazo para cair na conta é de 24h.");
        } else {
            alert("Saldo insuficiente para este saque!");
        }
    } else {
        alert("O valor mínimo de saque é R$ 20,00");
    }
}

// FUNÇÃO EXTRA: Faz o dinheiro render enquanto o site estiver aberto
function iniciarRendimento(valorDiario) {
    // Para teste rápido: rende um pouco a cada 30 segundos
    setInterval(() => {
        let rendimentoPorMinuto = valorDiario / 1440; // divide o ganho do dia por minutos
        saldoGeral += rendimentoPorMinuto;
        atualizarTela();
    }, 30000); 
}
