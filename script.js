import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC9itAsl1TKllIoVmhCq0KNDiJ4OanaPLw",
    authDomain: "jn-luxs-invest.firebaseapp.com",
    databaseURL: "https://jn-luxs-invest-default-rtdb.firebaseio.com",
    projectId: "jn-luxs-invest",
    storageBucket: "jn-luxs-invest.firebasestorage.app",
    messagingSenderId: "120002983828",
    appId: "1:120002983828:web:a9437ea04198852c6ec181"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let usuarioAtual = null;

// LOGIN E CADASTRO
window.entrarOuCadastrar = function() {
    const email = document.getElementById('campo-email').value;
    const senha = document.getElementById('campo-senha').value;

    if(!email || !senha) { alert("Preencha e-mail e senha!"); return; }

    signInWithEmailAndPassword(auth, email, senha)
    .catch(() => {
        return createUserWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                set(ref(db, 'usuarios/' + userCredential.user.uid), {
                    email: email,
                    saldo: 0
                });
            });
    })
    .catch(error => alert("Erro ao acessar: " + error.message));
};

// CONTROLE DE SESSÃO
onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioAtual = user;
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('painel-usuario').style.display = 'block';
        document.getElementById('nome-cliente').innerText = user.email.split('@')[0];
        
        onValue(ref(db, 'usuarios/' + user.uid + '/saldo'), (snapshot) => {
            const saldo = snapshot.val() || 0;
            document.getElementById('valor-saldo').innerText = "R$ " + saldo.toFixed(2);
        });
    }
});

// DEPÓSITO
window.depositar = function() {
    const valor = parseFloat(document.getElementById('valor-deposito').value);
    if (valor >= 60) {
        const chavePix = "01f92187-bc64-4c33-b5e9-c9d563e9b966"; 
        const pixPayload = `00020101021126580014br.gov.bcb.pix0136${chavePix}5204000053039865405${valor.toFixed(2)}5802BR5915JN_LUXS_INVEST6008BRASILIA62070503***6304`;
        document.getElementById('area-pix').style.display = 'block';
        document.getElementById('pix-copia-cola').value = pixPayload;
        const qrCodeUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(pixPayload)}`;
        document.getElementById('qrcode-img').innerHTML = `<img src="${qrCodeUrl}" style="width: 180px;">`;
    } else { alert("Mínimo R$ 60"); }
};

window.copiarPix = function() {
    const copiaTexto = document.getElementById('pix-copia-cola');
    copiaTexto.select();
    document.execCommand("copy");
    alert("Copiado!");
};

window.confirmarNoWhatsapp = function() {
    window.open(`https://wa.me/5589994222704?text=Olá, acabei de fazer um depósito.`);
};

window.comprarPlano = async function(custo, rendimento) {
    const snapshot = await get(ref(db, 'usuarios/' + usuarioAtual.uid + '/saldo'));
    let saldoAtual = snapshot.val() || 0;
    if (saldoAtual >= custo) {
        update(ref(db, 'usuarios/' + usuarioAtual.uid), { saldo: saldoAtual - custo });
        alert("Plano ativado!");
    } else { alert("Saldo insuficiente!"); }
};

window.sacar = async function() {
    const valor = parseFloat(document.getElementById('valor-saque').value);
    const snapshot = await get(ref(db, 'usuarios/' + usuarioAtual.uid + '/saldo'));
    let saldoAtual = snapshot.val() || 0;
    if (valor >= 20 && saldoAtual >= valor) {
        update(ref(db, 'usuarios/' + usuarioAtual.uid), { saldo: saldoAtual - valor });
        alert("Saque solicitado!");
    } else { alert("Erro no saque."); }
};
