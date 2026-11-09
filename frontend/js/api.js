const API_URL = 'http://localhost:5000';

// --- УПРАВЛЕНИЕ СТРАНИЦАМИ ---
function showPage(pageName) {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('add-page').style.display = 'none';
    document.getElementById('edit-page').style.display = 'none';

    if (pageName === 'home') {
        document.getElementById('home-page').style.display = 'block';
        loadComputers();
    } else if (pageName === 'add') {
        document.getElementById('add-page').style.display = 'block';
        document.getElementById('addForm').reset();
    } else if (pageName === 'edit') {
        document.getElementById('edit-page').style.display = 'block';
    }
}

// --- ЗАГРУЗКА ТОВАРОВ ---
async function loadComputers() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '<p>ЗАГРУЗКА...</p>';
    
    try {
        const res = await fetch(`${API_URL}/computers`);
        const computers = await res.json();
        
        grid.innerHTML = '';
        if (computers.length === 0) {
            grid.innerHTML = '<p>ТОВАРОВ ПОКА НЕТ</p>';
            return;
        }

        computers.forEach(pc => {
            const imgUrl = pc.image ? `${API_URL}/files/${pc.image}` : '';
            const imgTag = imgUrl ? `<img src="${imgUrl}">` : '<div style="height:200px; background:#333; display:flex; align-items:center; justify-content:center;">НЕТ ФОТО</div>';

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                ${imgTag}
                <h3>${pc.gpu}</h3>
                <div class="specs">
                    <p><span class="spec-label">CPU:</span> ${pc.cpu}</p>
                    <p><span class="spec-label">RAM:</span> ${pc.ram}</p>
                </div>
                <button class="btn" onclick="openEdit('${pc._id}')">ИЗМЕНИТЬ</button>
                <button class="btn btn-danger" onclick="deleteItem('${pc._id}')">УДАЛИТЬ</button>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="color:red">ОШИБКА ПОДКЛЮЧЕНИЯ К СЕРВЕРУ</p>';
    }
}

// --- ДОБАВЛЕНИЕ ---
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
        const res = await fetch(`${API_URL}/addComputer`, {
            method: 'POST',
            body: formData
        });
        
        if (res.ok) {
            alert('УСПЕШНО ДОБАВЛЕНО');
            showPage('home');
        } else {
            alert('ОШИБКА ПРИ СОХРАНЕНИИ');
        }
    } catch (err) {
        alert('ОШИБКА СЕТИ');
    }
});

// --- ОТКРЫТИЕ РЕДАКТИРОВАНИЯ ---
async function openEdit(id) {
    showPage('edit');
    try {
        const res = await fetch(`${API_URL}/computers/${id}`);
        const pc = await res.json();
        
        document.getElementById('edit-id').value = pc._id;
        document.getElementById('edit-gpu').value = pc.gpu;
        document.getElementById('edit-cpu').value = pc.cpu;
        document.getElementById('edit-mb').value = pc.motherboard;
        document.getElementById('edit-ram').value = pc.ram;
        document.getElementById('edit-cooler').value = pc.cooler;
        document.getElementById('edit-memory').value = pc.memory;
    } catch (err) {
        alert('НЕ УДАЛОСЬ ЗАГРУЗИТЬ ДАННЫЕ');
    }
}

// --- СОХРАНЕНИЕ ИЗМЕНЕНИЙ ---
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    
    const data = {
        gpu: document.getElementById('edit-gpu').value,
        cpu: document.getElementById('edit-cpu').value,
        motherboard: document.getElementById('edit-mb').value,
        ram: document.getElementById('edit-ram').value,
        cooler: document.getElementById('edit-cooler').value,
        memory: document.getElementById('edit-memory').value
    };

    try {
        const res = await fetch(`${API_URL}/updatecomputer/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert('ОБНОВЛЕНО');
            showPage('home');
        } else {
            alert('ОШИБКА ОБНОВЛЕНИЯ');
        }
    } catch (err) {
        alert('ОШИБКА СЕТИ');
    }
});

// --- УДАЛЕНИЕ ---
async function deleteItem(id) {
    if (!confirm('ТЫ УВЕРЕН, ЧТО ХОЧЕШЬ УДАЛИТЬ ЭТУ СБОРКУ?')) return;

    try {
        const res = await fetch(`${API_URL}/deletecomputer/${id}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            loadComputers(); // Перезагружаем список
        } else {
            alert('НЕ УДАЛОСЬ УДАЛИТЬ');
        }
    } catch (err) {
        alert('ОШИБКА СЕТИ');
    }
}

// Запуск при старте
loadComputers();