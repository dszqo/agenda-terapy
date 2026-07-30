// Estado da aplicação
let currentDay = 'all';
let currentTab = 'schedule';
let editingPatientId = null;

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar storage (Firebase ou LocalStorage)
    await storage.init();
    
    setupEventListeners();
    updateStats();
    renderContent();
});

// Configurar event listeners
function setupEventListeners() {
    // Filtro de dias
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDay = btn.dataset.day;
            renderContent();
        });
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(`${currentTab}-view`).classList.add('active');
            
            renderContent();
        });
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('patientModal');
        if (e.target === modal) {
            closePatientModal();
        }
    });
}

// Atualizar estatísticas
function updateStats() {
    // Sessões pagas = pacientes com saldo positivo
    const paidSessionsCount = patientsData.reduce((sum, p) => sum + (p.balance > 0 ? p.balance : 0), 0);
    
    // Sessões pendentes = soma dos valores negativos (débito total)
    const pendingSessionsCount = Math.abs(patientsData.reduce((sum, p) => sum + (p.balance < 0 ? p.balance : 0), 0));
    
    const owingCount = patientsData.filter(p => p.balance < 0).length;
    
    // Calcular sessões de hoje
    const today = new Date();
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayDay = dayMap[today.getDay()];
    const sessionsToday = patientsData.filter(p => p.day === todayDay).length;
    
    document.getElementById('totalPatients').textContent = patientsData.length;
    document.getElementById('activePatients').textContent = paidSessionsCount;
    document.getElementById('pendingSessions').textContent = pendingSessionsCount;
    document.getElementById('sessionsToday').textContent = sessionsToday;
    
    // Atualizar contadores de dias
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
        const count = patientsData.filter(p => p.day === day).length;
        const el = document.getElementById(`count-${day}`);
        if (el) el.textContent = count;
    });
    
    // Atualizar vista de pendentes
    const evenCount = patientsData.filter(p => p.balance === 0).length;
    document.getElementById('pendingCount').textContent = evenCount;
    document.getElementById('owingCount').textContent = owingCount;
}

// Renderizar conteúdo baseado no tab atual
function renderContent() {
    if (currentTab === 'schedule') {
        renderScheduleGrid();
    } else if (currentTab === 'list') {
        renderPatientList();
    } else if (currentTab === 'pending') {
        renderPendingList();
    }
}

// Calcular horário seguinte (adiciona 30 minutos)
function getNextTimeSlot(time) {
    const [hours, minutes] = time.split(':').map(Number);
    let nextMinutes = minutes + 30;
    let nextHours = hours;
    
    if (nextMinutes >= 60) {
        nextMinutes = 0;
        nextHours += 1;
    }
    
    return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`;
}

// Verificar se horário está bloqueado (hora seguinte de uma sessão)
function isTimeSlotBlocked(day, time) {
    // Sessão de 60min ocupa 2 slots (30min + 30min)
    // Verifica se existe paciente 30min antes OU 60min antes
    const [hours, minutes] = time.split(':').map(Number);
    
    // Verificar 30 minutos antes
    let prev30Minutes = minutes - 30;
    let prev30Hours = hours;
    if (prev30Minutes < 0) {
        prev30Minutes = 30;
        prev30Hours -= 1;
    }
    const prev30Time = `${prev30Hours.toString().padStart(2, '0')}:${prev30Minutes.toString().padStart(2, '0')}`;
    
    // Verificar 60 minutos antes
    let prev60Minutes = minutes - 60;
    let prev60Hours = hours;
    if (prev60Minutes < 0) {
        prev60Minutes = minutes + 60; // Ajustar para hora anterior
        prev60Hours -= 1;
        if (prev60Minutes >= 60) {
            prev60Minutes -= 60;
        }
    }
    const prev60Time = `${prev60Hours.toString().padStart(2, '0')}:${prev60Minutes.toString().padStart(2, '0')}`;
    
    // Retorna true se houver paciente em qualquer um dos horários
    return patientsData.some(p => p.day === day && (p.time === prev30Time || p.time === prev60Time));
}

// Renderizar grade de horários (otimizada para mobile)
function renderScheduleGrid() {
    const container = document.getElementById('scheduleGrid');
    const days = currentDay === 'all' 
        ? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        : [currentDay];
    
    // Verificar se é mobile
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Vista mobile: lista por dia
        renderMobileSchedule(container, days);
    } else {
        // Vista desktop: grade completa
        renderDesktopSchedule(container, days);
    }
}

// Renderizar grade para desktop
function renderDesktopSchedule(container, days) {
    // Gerar slots de horário (07:00 - 22:00) em intervalos de 5 minutos
    const timeSlots = [];
    for (let hour = 7; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
        }
    }
    
    let html = '<div class="schedule-grid">';
    
    // Cabeçalho
    html += '<div class="schedule-header">';
    html += '<div class="schedule-time-header">Horário</div>';
    days.forEach(day => {
        html += `<div class="schedule-day-header">${getDayAbbrev(day)}</div>`;
    });
    html += '</div>';
    
    // Linhas de horário
    html += '<div class="schedule-body">';
    timeSlots.forEach(time => {
        html += '<div class="schedule-row">';
        html += `<div class="schedule-time">${time}</div>`;
        
        days.forEach(day => {
            const patient = patientsData.find(p => p.day === day && p.time === time);
            const isBlocked = isTimeSlotBlocked(day, time);
            
            if (patient) {
                // Sessão agendada - cores baseadas no saldo
                const statusClass = patient.balance > 0 ? 'paid' : patient.balance < 0 ? 'owing' : 'even';
                const statusText = patient.balance > 0 ? 'Pago' : patient.balance < 0 ? 'A pagar' : 'Em dia';
                
                html += `<div class="schedule-cell filled ${statusClass}">
                    <div class="patient-name">${patient.name}</div>
                    ${patient.notes ? `<div class="patient-notes">${patient.notes}</div>` : ''}
                    <div class="patient-balance ${statusClass}">${patient.balance > 0 ? '+' : ''}${patient.balance}</div>
                    <div class="cell-actions">
                        <button class="btn-icon" onclick="editPatient(${patient.id})" title="Editar">✏️</button>
                        <button class="btn-icon" onclick="confirmDeletePatient(${patient.id})" title="Remover">🗑️</button>
                    </div>
                </div>`;
            } else if (isBlocked) {
                // Horário bloqueado (sessão em andamento)
                html += '<div class="schedule-cell blocked">🔒 Ocupado</div>';
            } else {
                // Horário livre
                html += '<div class="schedule-cell free">✓</div>';
            }
        });
        
        html += '</div>';
    });
    html += '</div>';
    
    html += '</div>';
    
    // Legenda
    html += `<div class="legend">
        <div class="legend-item"><span class="legend-dot paid"></span> Pago (crédito)</div>
        <div class="legend-item"><span class="legend-dot even"></span> Em dia</div>
        <div class="legend-item"><span class="legend-dot owing"></span> A pagar</div>
        <div class="legend-item"><span class="legend-dot blocked"></span> Ocupado (sessão 60min)</div>
        <div class="legend-item"><span class="legend-dot free"></span> Livre</div>
    </div>`;
    
    container.innerHTML = html;
}

// Renderizar grade para mobile
function renderMobileSchedule(container, days) {
    let html = '<div class="mobile-schedule">';
    
    days.forEach(day => {
        const dayPatients = patientsData
            .filter(p => p.day === day)
            .sort((a, b) => a.time.localeCompare(b.time));
        
        if (dayPatients.length === 0 && currentDay !== 'all') {
            html += '<div class="empty-state">Nenhuma sessão agendada para este dia.</div>';
            return;
        }
        
        if (dayPatients.length > 0) {
            html += `<div class="mobile-day-section">
                <h3 class="mobile-day-title">${dayNames[day]}</h3>`;
            
            dayPatients.forEach(patient => {
                const statusClass = patient.balance > 0 ? 'paid' : patient.balance < 0 ? 'owing' : 'even';
                const statusText = patient.balance > 0 ? 'Pago' : patient.balance < 0 ? 'A pagar' : 'Em dia';
                const nextSlot = getNextTimeSlot(patient.time);
                
                html += `<div class="mobile-schedule-item ${statusClass}">
                    <div class="mobile-time-block">
                        <div class="mobile-time">${patient.time}</div>
                        <div class="mobile-duration">60min</div>
                        <div class="mobile-blocked-time">🔒 ${nextSlot}</div>
                    </div>
                    <div class="mobile-patient-info">
                        <div class="mobile-patient-name">${patient.name}</div>
                        <div class="mobile-status-badge ${statusClass}">${statusText}</div>
                        ${patient.notes ? `<div class="mobile-patient-notes">${patient.notes}</div>` : ''}
                        <div class="mobile-patient-balance">Saldo: ${patient.balance > 0 ? '+' : ''}${patient.balance}</div>
                    </div>
                    <div class="mobile-actions">
                        <button class="btn-icon" onclick="editPatient(${patient.id})">✏️</button>
                        <button class="btn-icon" onclick="confirmDeletePatient(${patient.id})">🗑️</button>
                    </div>
                </div>`;
            });
            
            html += '</div>';
        }
    });
    
    html += '</div>';
    
    // Legenda
    html += `<div class="legend">
        <div class="legend-item"><span class="legend-dot paid"></span> Pago</div>
        <div class="legend-item"><span class="legend-dot even"></span> Em dia</div>
        <div class="legend-item"><span class="legend-dot owing"></span> A pagar</div>
    </div>`;
    
    container.innerHTML = html;
}

// Renderizar lista de pacientes
function renderPatientList() {
    const container = document.getElementById('patientList');
    const days = currentDay === 'all'
        ? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        : [currentDay];
    
    let html = '';
    
    days.forEach(day => {
        const dayPatients = patientsData.filter(p => p.day === day);
        if (dayPatients.length === 0) return;
        
        html += `<div class="day-section">
            <h3 class="day-title">${dayNames[day]} (${dayPatients.length})</h3>
            <div class="patient-cards">`;
        
        dayPatients.forEach(patient => {
            const statusClass = patient.balance > 0 ? 'paid' : patient.balance < 0 ? 'owing' : 'even';
            const statusText = patient.balance > 0 ? 'Pago' : patient.balance < 0 ? 'A pagar' : 'Em dia';
            
            html += `<div class="patient-card">
                <div class="patient-card-header">
                    <h4>${patient.name}</h4>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="patient-card-body">
                    <div class="patient-info">
                        <span class="info-icon">🕐</span>
                        <span>${patient.time} (60min)</span>
                    </div>
                    <div class="patient-info">
                        <span class="info-icon">📅</span>
                        <span>${getDayAbbrev(patient.day)}</span>
                    </div>
                    <div class="patient-info">
                        <span class="info-icon">💳</span>
                        <span>Mensal</span>
                    </div>
                </div>
                <div class="patient-card-footer">
                    <span class="balance-label">Saldo: <strong class="${statusClass}">${patient.balance > 0 ? '+' : ''}${patient.balance} sessões</strong></span>
                    ${patient.notes ? `<div class="patient-note">📝 ${patient.notes}</div>` : ''}
                </div>
                <div class="patient-card-actions">
                    <button class="btn-edit" onclick="editPatient(${patient.id})">✏️ Editar</button>
                    <button class="btn-delete" onclick="confirmDeletePatient(${patient.id})">🗑️ Remover</button>
                </div>
            </div>`;
        });
        
        html += '</div></div>';
    });
    
    if (html === '') {
        html = '<div class="empty-state">Nenhuma sessão agendada.</div>';
    }
    
    container.innerHTML = html;
}

// Renderizar lista de pendentes
function renderPendingList() {
    const container = document.getElementById('pendingList');
    const sortedPatients = [...patientsData].sort((a, b) => a.name.localeCompare(b.name));
    
    let html = '<div class="pending-list">';
    
    sortedPatients.forEach(patient => {
        const statusClass = patient.balance > 0 ? 'paid' : patient.balance < 0 ? 'owing' : 'even';
        const statusText = patient.balance > 0 ? 'Pago' : patient.balance < 0 ? 'A pagar' : 'Em dia';
        
        html += `<div class="pending-item">
            <div class="pending-item-header">
                <span class="pending-name">${patient.name}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="pending-item-body">
                <button class="balance-btn minus" onclick="updateBalance(${patient.id}, -1)">-</button>
                <span class="balance-display ${statusClass}">${patient.balance}</span>
                <button class="balance-btn plus" onclick="updateBalance(${patient.id}, 1)">+</button>
            </div>
            ${patient.notes ? `<div class="pending-note">${patient.notes}</div>` : ''}
        </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Atualizar saldo de paciente
function updateBalance(patientId, change) {
    if (storage.updateBalance(patientId, change)) {
        updateStats();
        renderContent();
    }
}

// Abrir modal para adicionar paciente
function openAddPatientModal() {
    editingPatientId = null;
    document.getElementById('modalTitle').textContent = 'Adicionar Paciente';
    document.getElementById('patientForm').reset();
    document.getElementById('patientId').value = '';
    document.getElementById('patientModal').classList.add('active');
}

// Abrir modal para editar paciente
function editPatient(patientId) {
    const patient = patientsData.find(p => p.id === patientId);
    if (!patient) return;
    
    editingPatientId = patientId;
    document.getElementById('modalTitle').textContent = 'Editar Paciente';
    document.getElementById('patientId').value = patient.id;
    document.getElementById('patientName').value = patient.name;
    document.getElementById('patientDay').value = patient.day;
    document.getElementById('patientTime').value = patient.time;
    document.getElementById('patientBalance').value = patient.balance;
    document.getElementById('patientNotes').value = patient.notes || '';
    document.getElementById('patientModal').classList.add('active');
}

// Fechar modal
function closePatientModal() {
    document.getElementById('patientModal').classList.remove('active');
    editingPatientId = null;
}

// Salvar paciente (adicionar ou editar)
function savePatient(event) {
    event.preventDefault();
    
    const patientData = {
        name: document.getElementById('patientName').value.trim(),
        day: document.getElementById('patientDay').value,
        time: document.getElementById('patientTime').value,
        balance: parseInt(document.getElementById('patientBalance').value) || 0,
        notes: document.getElementById('patientNotes').value.trim()
    };
    
    if (editingPatientId) {
        // Editar paciente existente
        storage.updatePatient(editingPatientId, patientData);
    } else {
        // Adicionar novo paciente
        storage.addPatient(patientData);
    }
    
    closePatientModal();
    updateStats();
    renderContent();
}

// Confirmar remoção de paciente
function confirmDeletePatient(patientId) {
    const patient = patientsData.find(p => p.id === patientId);
    if (!patient) return;
    
    if (confirm(`Tem certeza que deseja remover o paciente "${patient.name}"?`)) {
        storage.removePatient(patientId);
        updateStats();
        renderContent();
    }
}

// Obter abreviação do dia
function getDayAbbrev(day) {
    const abbrev = {
        monday: 'Seg',
        tuesday: 'Ter',
        wednesday: 'Qua',
        thursday: 'Qui',
        friday: 'Sex',
        saturday: 'Sáb',
        sunday: 'Dom'
    };
    return abbrev[day] || day;
}

// Atualizar visualização ao redimensionar janela
window.addEventListener('resize', () => {
    if (currentTab === 'schedule') {
        renderScheduleGrid();
    }
});
