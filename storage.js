// Módulo de armazenamento com suporte a Firebase e LocalStorage

class StorageManager {
    constructor() {
        this.useFirebase = false;
        this.db = null;
        this.patientsRef = null;
    }

    // Inicializar storage
    async init() {
        // Tentar inicializar Firebase
        if (typeof firebase !== 'undefined' && initializeFirebase()) {
            this.useFirebase = true;
            this.db = firebase.database();
            this.patientsRef = this.db.ref('patients');
            console.log('Usando Firebase para armazenamento');
            
            // Sincronizar dados do Firebase
            await this.syncFromFirebase();
        } else {
            console.log('Usando LocalStorage para armazenamento');
            this.loadFromLocalStorage();
        }
    }

    // Sincronizar dados do Firebase
    async syncFromFirebase() {
        return new Promise((resolve) => {
            this.patientsRef.once('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    patientsData.length = 0;
                    Object.values(data).forEach(patient => {
                        patientsData.push(patient);
                    });
                    console.log('Dados sincronizados do Firebase');
                } else {
                    // Se não houver dados no Firebase, enviar dados locais
                    this.saveAllToFirebase();
                }
                resolve();
            });

            // Escutar mudanças em tempo real
            this.patientsRef.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    patientsData.length = 0;
                    Object.values(data).forEach(patient => {
                        patientsData.push(patient);
                    });
                    // Atualizar interface
                    if (typeof updateStats === 'function') updateStats();
                    if (typeof renderContent === 'function') renderContent();
                }
            });
        });
    }

    // Salvar todos os pacientes no Firebase
    saveAllToFirebase() {
        if (!this.useFirebase) return;
        
        const patientsObj = {};
        patientsData.forEach(patient => {
            patientsObj[patient.id] = patient;
        });
        
        this.patientsRef.set(patientsObj);
    }

    // Salvar dados
    save() {
        if (this.useFirebase) {
            this.saveAllToFirebase();
        } else {
            this.saveToLocalStorage();
        }
    }

    // Adicionar paciente
    addPatient(patient) {
        // Gerar ID único
        const maxId = patientsData.length > 0 
            ? Math.max(...patientsData.map(p => p.id)) 
            : 0;
        patient.id = maxId + 1;
        
        patientsData.push(patient);
        this.save();
        return patient;
    }

    // Atualizar paciente
    updatePatient(patientId, updates) {
        const index = patientsData.findIndex(p => p.id === patientId);
        if (index !== -1) {
            patientsData[index] = { ...patientsData[index], ...updates };
            this.save();
            return true;
        }
        return false;
    }

    // Remover paciente
    removePatient(patientId) {
        const index = patientsData.findIndex(p => p.id === patientId);
        if (index !== -1) {
            patientsData.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    // Atualizar saldo
    updateBalance(patientId, change) {
        const patient = patientsData.find(p => p.id === patientId);
        if (patient) {
            patient.balance += change;
            this.save();
            return true;
        }
        return false;
    }

    // Salvar no LocalStorage
    saveToLocalStorage() {
        localStorage.setItem('patientsData', JSON.stringify(patientsData));
    }

    // Carregar do LocalStorage
    loadFromLocalStorage() {
        const saved = localStorage.getItem('patientsData');
        if (saved) {
            const loaded = JSON.parse(saved);
            patientsData.length = 0;
            patientsData.push(...loaded);
        }
    }
}

// Instância global do gerenciador de armazenamento
const storage = new StorageManager();
