import { getComputers, deleteComputer } from './api.js';

async function render() {
    const grid = document.getElementById('grid');
    try {
        const computers = await getComputers();
        
        grid.innerHTML = '';
        
        computers.forEach(pc => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Путь к картинке: http://localhost:5000/files/имя.jpg
            const imgUrl = pc.image ? `http://localhost:5000/files/${pc.image}` : 'assets/images/placeholder.jpg';

            card.innerHTML = `
                <img src="${imgUrl}" alt="${pc.gpu}">
                <h3>${pc.gpu} + ${pc.cpu}</h3>
                <div class="specs">
                    <p><span class="spec-label">GPU:</span> ${pc.gpu}</p>
                    <p><span class="spec-label">CPU:</span> ${pc.cpu}</p>
                    <p><span class="spec-label">RAM:</span> ${pc.ram}</p>
                    <p><span class="spec-label">MB:</span> ${pc.motherboard}</p>
                    <p><span class="spec-label">SSD/HDD:</span> ${pc.memory}</p>
                    <p><span class="spec-label">COOLER:</span> ${pc.cooler}</p>
                </div>
                <div>
                    <a href="edit.html?id=${pc._id}" class="btn">РЕДАКТИРОВАТЬ</a>
                    <button class="btn btn-danger" onclick="handleDelete('${pc._id}')">УДАЛИТЬ</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p>ОШИБКА ЗАГРУЗКИ ДАННЫХ</p>';
    }
}

// Функция удаления должна быть глобальной, чтобы работать из HTML onclick
window.handleDelete = async (id) => {
    if(confirm('ТОЧНО УДАЛИТЬ ЭТУ СБОРКУ?')) {
        try {
            await deleteComputer(id);
            alert('УДАЛЕНО');
            render(); // Перерисовать список
        } catch (e) {
            alert('НЕ УДАЛОСЬ УДАЛИТЬ');
        }
    }
};

render();