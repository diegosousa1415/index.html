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
        alert("Digite um usuário!");
    }
}

function depositar() {
    const valor = parseFloat(document.getElementById('valor-deposito').value);
    if (valor >= 60) {
        const chavePix = "01f92187-bc64-4c33-b5e9-c9d563e9b966"; 
        const pixPayload = `00020101021126580014br.gov.bcb.pix0136${chavePix}5204000053039865405${valor.toFixed(2)}5802BR5915JN_LUXS_INVEST6008BRASILIA62070503***6304`;

        document.getElementById('area-pix').style.display = 'block';
        document.getElementById('pix-copia-cola').value = pixPayload;

        const qrCodeUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(pixPayload)}`;
        document.getElementById('qrcode-img').innerHTML = `<img src="${qrCodeUrl}" style="width: 180px;">`;

        alert("QR Code Gerado! Pague e confirme no WhatsApp.");
    } else {
        alert("O valor mínimo é R$ 60,00");
    }
}

function copiarPix() {
    const copiaTexto = document.getElementById('pix-copia-cola');
    copiaTexto.select();
    document.execCommand("copy");
    alert("Código copiado!");
}

function confirmarNoWhatsapp() {
    const msg = "Olá, acabei de fazer um depósito no JN LUXS. Aqui está meu comprovante:";
    window.open(`https://wa.me/5589994222704?text=${encodeURIComponent(msg)}`);
}

function comprarPlano(custo, rendimento) {
    if (saldoGeral >= custo) {
        saldoGeral -= custo;
        atualizarTela();
        alert(`Plano ativado! Rende R$ ${rendimento} por dia.`);
    } else {
        alert("Saldo insuficiente!");
    }
}

function sacar() {
    const chave = document.getElementById('chave-pix-saque').value;
    const valor = parseFloat(document.getElementById('valor-saque').value);
    if (chave === "" || valor < 20 || valor > saldoGeral) {
        alert("Verifique a chave, valor mínimo (20) ou saldo.");
    } else {
        saldoGeral -= valor;
        atualizarTela();
        alert("Pedido de saque enviado!");
    }
}
