import { getComputerById, updateComputer } from './api.js';

// Получаем ID из URL (?id=...)
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
    alert('ID НЕ НАЙДЕН');
    window.location.href = 'index.html';
}

const form = document.getElementById('editForm');

// Загрузка данных
async function load() {
    try {
        const pc = await getComputerById(id);
        form.gpu.value = pc.gpu;
        form.cpu.value = pc.cpu;
        form.motherboard.value = pc.motherboard;
        form.ram.value = pc.ram;
        form.cooler.value = pc.cooler;
        form.memory.value = pc.memory;
    } catch (error) {
        alert('ОШИБКА ЗАГРУЗКИ ДАННЫХ');
    }
}

// Сохранение
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        gpu: form.gpu.value,
        cpu: form.cpu.value,
        motherboard: form.motherboard.value,
        ram: form.ram.value,
        cooler: form.cooler.value,
        memory: form.memory.value
    };

    try {
        await updateComputer(id, data);
        alert('ОБНОВЛЕНО');
        window.location.href = 'index.html';
    } catch (error) {
        alert('ОШИБКА ОБНОВЛЕНИЯ');
    }
});

load();