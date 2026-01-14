import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, set, update, onValue, increment } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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
let dadosUser = {};

window.entrarOuCadastrar = async function() {
    const email = document.getElementById('campo-email').value;
    const senha = document.getElementById('campo-senha').value;
    const params = new URLSearchParams(window.location.search);
    const indicadoPor = params.get('ref');

    signInWithEmailAndPassword(auth, email, senha).catch(() => {
        return createUserWithEmailAndPassword(auth, email, senha).then((res) => {
            set(ref(db, 'usuarios/' + res.user.uid), { email, saldo: 0, rendimentoDiario: 0, comprouPlano: false });
            // VALOR DO CONVITE ATUALIZADO PARA 1.80
            if(indicadoPor) update(ref(db, 'usuarios/' + indicadoPor), { saldo: increment(1.80) });
        });
    }).catch(e => alert("Erro: " + e.message));
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioAtual = user;
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('painel-usuario').style.display = 'block';
        document.getElementById('link-afiliado').value = window.location.origin + window.location.pathname + "?ref=" + user.uid;
        onValue(ref(db, 'usuarios/' + user.uid), (snap) => {
            dadosUser = snap.val() || {};
            document.getElementById('valor-saldo').innerText = "R$ " + (dadosUser.saldo || 0).toFixed(2);
            if(dadosUser.comprouPlano) { document.getElementById('area-contador').style.display = 'block'; iniciarContador(); }
        });
    }
});

function iniciarContador() {
    const tempoRestante = Math.max(0, 86400000 - (Date.now() - (dadosUser.ultimaAtualizacao || Date.now())));
    const h = Math.floor(tempoRestante / 3600000);
    const m = Math.floor((tempoRestante % 3600000) / 60000);
    const s = Math.floor((tempoRestante % 60000) / 1000);
    document.getElementById('contador-tempo').innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    if (tempoRestante <= 0) processarRendimento(); else setTimeout(iniciarContador, 1000);
}

async function processarRendimento() {
    if (!usuarioAtual || !dadosUser.rendimentoDiario) return;
    await update(ref(db, 'usuarios/' + usuarioAtual.uid), { saldo: (dadosUser.saldo || 0) + (dadosUser.rendimentoDiario || 0), ultimaAtualizacao: Date.now() });
}

window.sacar = () => {
    const valor = parseFloat(document.getElementById('valor-saque').value);
    if (valor < 10) { alert("Mínimo para saque: R$ 10,00"); return; }
    if (valor > (dadosUser.saldo || 0)) { alert("Saldo insuficiente!"); return; }
    const msg = `Olá, solicito saque de R$ ${valor.toFixed(2)}.\nNome: ${document.getElementById('saque-nome').value}\nChave: ${document.getElementById('saque-chave').value}`;
    window.open(`https://wa.me/5589994713178?text=${encodeURIComponent(msg)}`);
};

window.depositar = () => {
    const valor = parseFloat(document.getElementById('valor-deposito').value);
    if (valor >= 5) {
        window.valorAtualDeposito = valor;
        document.getElementById('meuModalPix').style.display = "block";
    } else { alert("Mínimo para depósito: R$ 5,00"); }
};

window.copiarChaveNoModal = () => {
    navigator.clipboard.writeText("adc98ef9-90d1-4851-ab20-e9cee3a2d9a4").then(() => alert("Copiado com sucesso!"));
};

window.fecharModalEIrProWhats = () => {
    document.getElementById('meuModalPix').style.display = "none";
    const msg = `Olá! Depositei R$ ${window.valorAtualDeposito.toFixed(2)}. Segue comprovante.`;
    window.open(`https://wa.me/5589994713178?text=${encodeURIComponent(msg)}`);
};

window.comprarPlano = async (custo, rend) => {
    if (dadosUser.saldo >= custo) {
        await update(ref(db, 'usuarios/' + usuarioAtual.uid), { saldo: (dadosUser.saldo || 0) - custo, rendimentoDiario: rend, ultimaAtualizacao: Date.now(), comprouPlano: true });
        alert("Plano ativado!");
    } else { alert("Saldo insuficiente!"); }
};

window.copiarLink = () => { document.getElementById('link-afiliado').select(); document.execCommand("copy"); alert("Link copiado!"); };
window.chamarSuporte = () => { window.open(`https://wa.me/5589994713178?text=Olá! Preciso de Suporte VIP JN LUXS.`); };
