import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, set, get, update, onValue, increment } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// COLETAR IP DO USUÁRIO
async function obterIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch { return "Não identificado"; }
}

window.entrarOuCadastrar = async function() {
    const email = document.getElementById('campo-email').value;
    const senha = document.getElementById('campo-senha').value;
    const ip = await obterIP();
    const params = new URLSearchParams(window.location.search);
    const indicadoPor = params.get('ref');

    signInWithEmailAndPassword(auth, email, senha).catch(() => {
        return createUserWithEmailAndPassword(auth, email, senha).then((res) => {
            set(ref(db, 'usuarios/' + res.user.uid), { 
                email, saldo: 0, rendimentoDiario: 0, depositou: false, comprouPlano: false, ip: ip 
            });
            if(indicadoPor) update(ref(db, 'usuarios/' + indicadoPor), { saldo: increment(3.20) });
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
            dadosUser = snap.val();
            document.getElementById('valor-saldo').innerText = "R$ " + (dadosUser.saldo || 0).toFixed(2);
            if(dadosUser.comprouPlano) {
                document.getElementById('area-contador').style.display = 'block';
                iniciarContador();
            }
        });
    }
});

function iniciarContador() {
    const agora = Date.now();
    const ultima = dadosUser.ultimaAtualizacao || agora;
    const tempoPassado = agora - ultima;
    const tempoRestante = Math.max(0, 86400000 - tempoPassado);

    const horas = Math.floor(tempoRestante / 3600000);
    const minutos = Math.floor((tempoRestante % 3600000) / 60000);
    const segundos = Math.floor((tempoRestante % 60000) / 1000);
    
    document.getElementById('contador-tempo').innerText = 
        `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    if (tempoRestante <= 0) {
        processarRendimento();
    } else {
        setTimeout(iniciarContador, 1000);
    }
}

async function processarRendimento() {
    if (!usuarioAtual || !dadosUser.rendimentoDiario) return;
    const novoSaldo = dadosUser.saldo + dadosUser.rendimentoDiario;
    await update(ref(db, 'usuarios/' + usuarioAtual.uid), { 
        saldo: novoSaldo, ultimaAtualizacao: Date.now() 
    });
}

window.sacar = () => {
    const nome = document.getElementById('saque-nome').value;
    const tipo = document.getElementById('saque-tipo-chave').value;
    const chave = document.getElementById('saque-chave').value;
    const valor = parseFloat(document.getElementById('valor-saque').value);

    if (!nome || !chave || !valor) { alert("Preencha todos os campos de saque!"); return; }

    if (!dadosUser.depositou || !dadosUser.comprouPlano) {
        alert("Erro: Para sacar o saldo de bônus, você só saca se comprar o produto e ter depositado!");
    } else if (valor > dadosUser.saldo) {
        alert("Saldo insuficiente!");
    } else {
        const msg = `Olá, solicito saque de R$ ${valor.toFixed(2)}. \nNome: ${nome}\nChave ${tipo}: ${chave}`;
        window.open(`https://wa.me/5589994222704?text=${encodeURIComponent(msg)}`);
    }
};

window.comprarPlano = async (custo, rend) => {
    if (dadosUser.saldo >= custo) {
        await update(ref(db, 'usuarios/' + usuarioAtual.uid), { 
            saldo: dadosUser.saldo - custo, rendimentoDiario: rend, ultimaAtualizacao: Date.now(), comprouPlano: true 
        });
        alert("Plano DIAMANTE ativado!");
    } else { alert("Saldo insuficiente!"); }
};

window.depositar = () => { /* Mantém lógica anterior de Pix */ };
window.copiarLink = () => { document.getElementById('link-afiliado').select(); document.execCommand("copy"); alert("Link copiado!"); };
