// Autenticação Firebase
let auth = null;
let currentUser = null;

// Inicializar autenticação
function initAuth() {
    if (firebaseConfigured && firebase.auth) {
        auth = firebase.auth();
        
        // Verificar estado de autenticação
        auth.onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                showApp();
                console.log('✅ Usuário autenticado:', user.email);
            } else {
                currentUser = null;
                showLogin();
                console.log('⚠️ Usuário não autenticado');
            }
        });
    } else {
        console.error('❌ Firebase Auth não configurado');
        showApp(); // Fallback: mostrar app sem autenticação
    }
}

// Fazer login
async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('✅ Login realizado com sucesso!');
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('❌ Erro no login:', error);
        let message = 'Erro ao fazer login';
        
        switch (error.code) {
            case 'auth/invalid-email':
                message = 'Email inválido';
                break;
            case 'auth/user-disabled':
                message = 'Usuário desativado';
                break;
            case 'auth/user-not-found':
                message = 'Usuário não encontrado';
                break;
            case 'auth/wrong-password':
                message = 'Senha incorreta';
                break;
            case 'auth/invalid-credential':
                message = 'Email ou senha incorretos';
                break;
            default:
                message = error.message;
        }
        
        return { success: false, error: message };
    }
}

// Fazer logout
async function logout() {
    try {
        await auth.signOut();
        console.log('✅ Logout realizado com sucesso!');
        showLogin();
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        alert('Erro ao fazer logout: ' + error.message);
    }
}

// Mostrar tela de login
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('appScreen').style.display = 'none';
}

// Mostrar aplicativo
function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'block';
    
    // Carregar dados do app
    if (typeof loadData === 'function') {
        loadData();
    }
}

// Handler do formulário de login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    // Limpar erro anterior
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    
    // Desabilitar botão durante login
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrando...';
    
    const result = await login(email, password);
    
    if (!result.success) {
        errorDiv.textContent = result.error;
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
    }
}

// Verificar se usuário está autenticado
function isAuthenticated() {
    return currentUser !== null;
}

// Obter email do usuário atual
function getCurrentUserEmail() {
    return currentUser ? currentUser.email : null;
}
