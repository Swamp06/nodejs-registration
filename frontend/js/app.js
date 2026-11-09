const API_URL = 'http://localhost:5000';
let allComputers = [];
let currentSearchMode = 'all'; // 'all', 'text', 'id'

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

// --- ЗАГРУЗКА ВСЕХ ТОВАРОВ ---
async function loadComputers() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '<p class="message">ЗАГРУЗКА...</p>';
    
    try {
        const res = await fetch(`${API_URL}/computers`);
        allComputers = await res.json();
        
        // Сбрасываем поиски при загрузке
        document.getElementById('searchInput').value = '';
        document.getElementById('searchIdInput').value = '';
        currentSearchMode = 'all';
        
        renderComputers(allComputers);
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p class="message error">ОШИБКА ПОДКЛЮЧЕНИЯ К СЕРВЕРУ</p>';
    }
}

// --- ОТРИСОВКА КАРТОЧЕК ---
function renderComputers(list) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = '<p class="message">ТОВАРЫ НЕ НАЙДЕНЫ</p>';
        return;
    }

    list.forEach(pc => {
        const imgUrl = pc.image ? `${API_URL}/files/${pc.image}` : '';
        
        const card = document.createElement('div');
        card.className = 'card';
        
        if (imgUrl) {
            card.innerHTML = `
                <img src="${imgUrl}" alt="${pc.gpu}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="no-image" style="display:none;">НЕТ ФОТО</div>
                <div class="card-body">
                    <h3>${pc.gpu}</h3>
                    <p style="font-size: 11px; color: #94a3b8; margin-bottom: 10px; word-break: break-all;">ID: ${pc._id}</p>
                    <div class="specs">
                        <p><span class="spec-label">CPU:</span> <span class="spec-value">${pc.cpu}</span></p>
                        <p><span class="spec-label">RAM:</span> <span class="spec-value">${pc.ram}</span></p>
                        <p><span class="spec-label">MEMORY:</span> <span class="spec-value">${pc.memory}</span></p>
                    </div>
                    <div class="card-actions">
                        <button class="btn" onclick="event.stopPropagation(); openModal('${pc._id}')">ПОДРОБНЕЕ</button>
                        <button class="btn" onclick="event.stopPropagation(); openEdit('${pc._id}')">ИЗМЕНИТЬ</button>
                        <button class="btn btn-danger" onclick="event.stopPropagation(); deleteItem('${pc._id}')">УДАЛИТЬ</button>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="no-image">НЕТ ФОТО</div>
                <div class="card-body">
                    <h3>${pc.gpu}</h3>
                    <p style="font-size: 11px; color: #94a3b8; margin-bottom: 10px; word-break: break-all;">ID: ${pc._id}</p>
                    <div class="specs">
                        <p><span class="spec-label">CPU:</span> <span class="spec-value">${pc.cpu}</span></p>
                        <p><span class="spec-label">RAM:</span> <span class="spec-value">${pc.ram}</span></p>
                        <p><span class="spec-label">MEMORY:</span> <span class="spec-value">${pc.memory}</span></p>
                    </div>
                    <div class="card-actions">
                        <button class="btn" onclick="event.stopPropagation(); openModal('${pc._id}')">ПОДРОБНЕЕ</button>
                        <button class="btn" onclick="event.stopPropagation(); openEdit('${pc._id}')">ИЗМЕНИТЬ</button>
                        <button class="btn btn-danger" onclick="event.stopPropagation(); deleteItem('${pc._id}')">УДАЛИТЬ</button>
                    </div>
                </div>
            `;
        }
        
        card.onclick = () => openModal(pc._id);
        grid.appendChild(card);
    });
}

// --- ПОИСК ПО ХАРАКТЕРИСТИКАМ ---
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const idQuery = document.getElementById('searchIdInput').value.trim();
    
    // Если есть поиск по ID, приоритет у него
    if (idQuery) {
        handleSearchById();
        return;
    }
    
    if (!query) {
        renderComputers(allComputers);
        return;
    }

    const filtered = allComputers.filter(pc => {
        return (
            pc.gpu.toLowerCase().includes(query) ||
            pc.cpu.toLowerCase().includes(query) ||
            pc.motherboard.toLowerCase().includes(query) ||
            pc.ram.toLowerCase().includes(query) ||
            pc.cooler.toLowerCase().includes(query) ||
            pc.memory.toLowerCase().includes(query)
        );
    });

    renderComputers(filtered);
}

// --- ПОИСК ПО ID ---
function handleSearchById() {
    const idQuery = document.getElementById('searchIdInput').value.trim().toLowerCase();
    const textQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    
    // Если есть обычный поиск, приоритет у него
    if (textQuery) {
        handleSearch();
        return;
    }
    
    if (!idQuery) {
        renderComputers(allComputers);
        return;
    }

    // Ищем точное совпадение или частичное совпадение ID
    const filtered = allComputers.filter(pc => {
        return pc._id.toLowerCase().includes(idQuery);
    });

    renderComputers(filtered);
}

// --- МОДАЛЬНОЕ ОКНО ---
async function openModal(id) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = '<p class="message">ЗАГРУЗКА...</p>';
    modal.classList.add('active');

    try {
        const res = await fetch(`${API_URL}/computers/${id}`);
        const pc = await res.json();

        const imgUrl = pc.image ? `${API_URL}/files/${pc.image}` : '';
        
        let imgHtml = '';
        if (imgUrl) {
            imgHtml = `<img src="${imgUrl}" class="modal-image" alt="${pc.gpu}" onerror="this.style.display='none';">`;
        }

        document.getElementById('modal-title').innerText = pc.gpu + ' + ' + pc.cpu;

        body.innerHTML = `
            ${imgHtml}
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 15px; word-break: break-all;"><b>ID:</b> ${pc._id}</p>
            <div class="modal-specs">
                <p><span class="spec-label">ВИДЕОКАРТА:</span> <span class="spec-value">${pc.gpu}</span></p>
                <p><span class="spec-label">ПРОЦЕССОР:</span> <span class="spec-value">${pc.cpu}</span></p>
                <p><span class="spec-label">МАТЕРИНСКАЯ ПЛАТА:</span> <span class="spec-value">${pc.motherboard}</span></p>
                <p><span class="spec-label">ОЗУ:</span> <span class="spec-value">${pc.ram}</span></p>
                <p><span class="spec-label">ОХЛАЖДЕНИЕ:</span> <span class="spec-value">${pc.cooler}</span></p>
                <p><span class="spec-label">НАКОПИТЕЛИ:</span> <span class="spec-value">${pc.memory}</span></p>
            </div>
            <div class="card-actions" style="margin-top: 20px;">
                <button class="btn" onclick="closeModal(); openEdit('${pc._id}')">ИЗМЕНИТЬ</button>
                <button class="btn btn-danger" onclick="closeModal(); deleteItem('${pc._id}')">УДАЛИТЬ</button>
            </div>
        `;
    } catch (err) {
        body.innerHTML = '<p class="message error">ОШИБКА ЗАГРУЗКИ ДАННЫХ</p>';
    }
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function closeModalOnOverlay(event) {
    if (event.target.id === 'modal') {
        closeModal();
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
            loadComputers();
        } else {
            alert('НЕ УДАЛОСЬ УДАЛИТЬ');
        }
    } catch (err) {
        alert('ОШИБКА СЕТИ');
    }
}

// Запуск при старте
loadComputers();