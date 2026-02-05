// Dados dos pacientes e sessões
const patientsData = [
    { id: 1, name: "Allany Mourao", day: "friday", time: "17:00", balance: 1, notes: "" },
    { id: 2, name: "Andreia Paula", day: "thursday", time: "13:00", balance: 0, notes: "" },
    { id: 3, name: "Bruno Picolo", day: "monday", time: "13:00", balance: -2, notes: "" },
    { id: 4, name: "Emilio Silvestre", day: "wednesday", time: "09:00", balance: 0, notes: "" },
    { id: 5, name: "Evaldo Mello", day: "monday", time: "20:30", balance: -3, notes: "" },
    { id: 6, name: "Fernando Miguel Caycho Feria", day: "friday", time: "07:30", balance: 0, notes: "" },
    { id: 7, name: "Giovanna Pissolato", day: "friday", time: "15:00", balance: -3, notes: "" },
    { id: 8, name: "Gustavo Polar", day: "tuesday", time: "20:30", balance: 0, notes: "" },
    { id: 9, name: "Ingrid Monteiro", day: "thursday", time: "17:00", balance: 0, notes: "a cada 15 dias prox 05-02" },
    { id: 10, name: "Joao Campanholo", day: "tuesday", time: "19:00", balance: -3, notes: "" },
    { id: 11, name: "Joao Vitor", day: "friday", time: "13:00", balance: -1, notes: "Dar garrinha de presente" },
    { id: 12, name: "Josiane Aparecida de Oliveira", day: "wednesday", time: "11:00", balance: 0, notes: "" },
    { id: 13, name: "Juliana Rocha", day: "wednesday", time: "18:00", balance: 0, notes: "" },
    { id: 14, name: "Lucas Souza", day: "thursday", time: "11:00", balance: -4, notes: "" },
    { id: 15, name: "Maria da Gloria dos Santos (Gloria)", day: "monday", time: "16:00", balance: -3, notes: "" },
    { id: 16, name: "Maria Gallo", day: "tuesday", time: "16:00", balance: 0, notes: "" },
    { id: 17, name: "Maria Iraci Nunes", day: "monday", time: "09:00", balance: 1, notes: "" },
    { id: 18, name: "Mateus Miranda de Souza", day: "thursday", time: "10:00", balance: -3, notes: "" },
    { id: 19, name: "Michele Hernandes", day: "wednesday", time: "19:30", balance: 0, notes: "" },
    { id: 20, name: "Paloma Muller", day: "friday", time: "11:00", balance: -4, notes: "" },
    { id: 21, name: "Patrick Oliveira", day: "tuesday", time: "21:00", balance: -2, notes: "precisa pagar" },
    { id: 22, name: "Tiago Cremonesi", day: "thursday", time: "20:00", balance: 0, notes: "" },
    { id: 23, name: "Vilma Ormenese", day: "monday", time: "19:00", balance: 0, notes: "" },
    { id: 24, name: "Wendell Oliveira", day: "thursday", time: "15:00", balance: -4, notes: "" },
    { id: 25, name: "Willian dos Reis", day: "wednesday", time: "13:00", balance: 0, notes: "" },
    { id: 26, name: "Yuri Andrei Bressan", day: "friday", time: "13:00", balance: 0, notes: "" }
];

const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
};

// Função para salvar dados no localStorage
function saveData() {
    localStorage.setItem('patientsData', JSON.stringify(patientsData));
}

// Função para carregar dados do localStorage
function loadData() {
    const saved = localStorage.getItem('patientsData');
    if (saved) {
        const loaded = JSON.parse(saved);
        patientsData.length = 0;
        patientsData.push(...loaded);
    }
}

// Carregar dados ao iniciar
loadData();
