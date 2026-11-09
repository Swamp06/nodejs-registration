import { createComputer } from './api.js';

document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);

    try {
        await createComputer(formData);
        alert('СБОРКА ДОБАВЛЕНА');
        window.location.href = 'index.html';
    } catch (error) {
        console.error(error);
        alert('ОШИБКА ПРИ СОХРАНЕНИИ');
    }
});