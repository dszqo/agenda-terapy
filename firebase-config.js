// Configuração do Firebase
// Credenciais configuradas para sincronização entre dispositivos
const firebaseConfig = {
    apiKey: "AIzaSyB8TEymYQ5VsPBy7HE4ebRHNQ8ZsENvW20",
    authDomain: "agenda-terapy-d888d.firebaseapp.com",
    projectId: "agenda-terapy-d888d",
    storageBucket: "agenda-terapy-d888d.firebasestorage.app",
    messagingSenderId: "1028026861998",
    appId: "1:1028026861998:web:73b3b5bec7829e6b3be03f",
    databaseURL: "https://agenda-terapy-d888d-default-rtdb.firebaseio.com"
};

// Variável global para indicar se o Firebase está configurado
let firebaseConfigured = false;

// Inicializar Firebase
function initializeFirebase( ) {
    try {
        firebase.initializeApp(firebaseConfig);
        firebaseConfigured = true;
        console.log('✅ Firebase inicializado com sucesso! Dados sincronizando...');
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar Firebase:', error);
        console.log('⚠️ Usando LocalStorage como fallback.');
        return false;
    }
}
