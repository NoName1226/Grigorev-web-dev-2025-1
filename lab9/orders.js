const API_KEY = '39715e47-c2dd-439d-8fa6-92ad2fefd448';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';

let orders = [];
let dishes = [];

// Загрузка данных при открытии страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем блюда и заказы
    loadDishes();
    
    // Настройка обработчиков событий
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Закрытие модальных окон при клике на крестик
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Загрузка блюд
async function loadDishes() {
    try {
        const response = await fetch(`${API_URL}/dishes?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки блюд');
        }
        dishes = await response.json();
        loadOrders();
    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
        showNotification('Ошибка загрузки данных', true);
    }
}

// Загрузка заказов
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка загрузки заказов');
        }
        
        orders = await response.json();
        
        // Сортировка по убыванию даты (новые первыми)
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        displayOrders();
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        document.getElementById('ordersLoading').style.display = 'none';
        showNotification('Ошибка загрузки заказов: ' + error.message, true);
    }
}

// Отображение заказов в новом дизайне
function displayOrders() {
    document.getElementById('ordersLoading').style.display = 'none';
    
    if (orders.length === 0) {
        document.getElementById('noOrders').style.display = 'block';
        document.getElementById('ordersContainer').style.display = 'none';
        return;
    }
    
    document.getElementById('noOrders').style.display = 'none';
    document.getElementById('ordersContainer').style.display = 'block';
    
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    
    orders.forEach((order, index) => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Порядковый номер
        const numCell = document.createElement('div');
        numCell.className = 'order-cell order-number';
        numCell.textContent = index + 1;
        
        // Дата оформления
        const dateCell = document.createElement('div');
        dateCell.className = 'order-cell order-date';
        dateCell.textContent = formatDateTime(order.created_at);
        
        // Состав заказа
        const compositionCell = document.createElement('div');
        compositionCell.className = 'order-cell order-composition';
        compositionCell.textContent = getOrderComposition(order);
        
        // Стоимость
        const priceCell = document.createElement('div');
        priceCell.className = 'order-cell order-price';
        priceCell.textContent = calculateOrderPrice(order) + ' ₽';
        
        // Время доставки
        const deliveryCell = document.createElement('div');
        deliveryCell.className = 'order-cell order-delivery-time';
        deliveryCell.textContent = getDeliveryTime(order);
        
        // Действия
        const actionsCell = document.createElement('div');
        actionsCell.className = 'order-cell order-actions';
        actionsCell.innerHTML = `
            <button class="action-btn view" onclick="viewOrder(${order.id})" title="Просмотр">
                <i class="bi bi-eye"></i>
            </button>
            <button class="action-btn edit" onclick="editOrder(${order.id})" title="Редактирование">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn delete" onclick="deleteOrder(${order.id})" title="Удаление">
                <i class="bi bi-trash"></i>
            </button>
        `;
        
        // Добавляем все ячейки в карточку
        orderCard.appendChild(numCell);
        orderCard.appendChild(dateCell);
        orderCard.appendChild(compositionCell);
        orderCard.appendChild(priceCell);
        orderCard.appendChild(deliveryCell);
        orderCard.appendChild(actionsCell);
        
        ordersList.appendChild(orderCard);
    });
}

// Получение состава заказа
function getOrderComposition(order) {
    const items = [];
    
    if (order.soup_id) {
        const dish = dishes.find(d => d.id === order.soup_id);
        if (dish) items.push(dish.name);
    }
    
    if (order.main_course_id) {
        const dish = dishes.find(d => d.id === order.main_course_id);
        if (dish) items.push(dish.name);
    }
    
    if (order.salad_id) {
        const dish = dishes.find(d => d.id === order.salad_id);
        if (dish) items.push(dish.name);
    }
    
    if (order.drink_id) {
        const dish = dishes.find(d => d.id === order.drink_id);
        if (dish) items.push(dish.name);
    }
    
    if (order.dessert_id) {
        const dish = dishes.find(d => d.id === order.dessert_id);
        if (dish) items.push(dish.name);
    }
    
    return items.join(', ');
}

// Расчёт стоимости заказа
function calculateOrderPrice(order) {
    let total = 0;
    
    if (order.soup_id) {
        const dish = dishes.find(d => d.id === order.soup_id);
        if (dish) total += dish.price;
    }
    
    if (order.main_course_id) {
        const dish = dishes.find(d => d.id === order.main_course_id);
        if (dish) total += dish.price;
    }
    
    if (order.salad_id) {
        const dish = dishes.find(d => d.id === order.salad_id);
        if (dish) total += dish.price;
    }
    
    if (order.drink_id) {
        const dish = dishes.find(d => d.id === order.drink_id);
        if (dish) total += dish.price;
    }
    
    if (order.dessert_id) {
        const dish = dishes.find(d => d.id === order.dessert_id);
        if (dish) total += dish.price;
    }
    
    return total;
}

// Форматирование даты и времени
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Получение времени доставки
function getDeliveryTime(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        return order.delivery_time.substring(0, 5);
    }
    return 'Как можно скорее (с 7:00 до 23:00)';
}

// Валидация времени доставки
function validateDeliveryTime(time) {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    
    if (hours < 7 || hours > 23) {
        return false;
    }
    
    if (hours === 23 && minutes > 0) {
        return false;
    }
    
    if (minutes % 5 !== 0) {
        return false;
    }
    
    return true;
}

// Просмотр заказа - открытие модального окна с данными
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Заказ не найден', true);
        return;
    }
    
    const modalBody = document.getElementById('viewModalBody');
    
    let html = `
        <!-- Дата оформления - без выделения -->
        <div class="order-date-info">
            <div class="info-row">
                <div class="info-label">Дата оформления</div>
                <div class="info-value">${formatDateTime(order.created_at)}</div>
            </div>
        </div>
        
        <!-- Доставка -->
        <div class="view-order-section">
            <h3>Доставка</h3>
            <div class="info-row">
                <div class="info-label">Имя получателя</div>
                <div class="info-value">${order.full_name}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Адрес доставки</div>
                <div class="info-value">${order.delivery_address}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Время доставки</div>
                <div class="info-value">${getDeliveryTime(order)}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Телефон</div>
                <div class="info-value">${order.phone}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email</div>
                <div class="info-value">${order.email}</div>
            </div>
        </div>
    `;
    
    if (order.comment) {
        html += `
            <!-- Комментарий - обычный текст -->
            <div class="view-order-section">
                <h3>Комментарий</h3>
                <div class="view-order-comment">
                    ${order.comment}
                </div>
            </div>
        `;
    }
    
    html += `
        <!-- Состав заказа - цены в скобках -->
        <div class="view-order-section">
            <h3>Состав заказа</h3>
            <ul class="order-items-list">
    `;
    
    let total = 0;
    
    if (order.soup_id) {
        const dish = dishes.find(d => d.id === order.soup_id);
        if (dish) {
            html += `
                <li>
                    <div class="item-category">Суп</div>
                    <div class="item-with-price">${dish.name} (${dish.price}₽)</div>
                </li>
            `;
            total += dish.price;
        }
    }
    
    if (order.main_course_id) {
        const dish = dishes.find(d => d.id === order.main_course_id);
        if (dish) {
            html += `
                <li>
                    <div class="item-category">Основное блюдо</div>
                    <div class="item-with-price">${dish.name} (${dish.price}₽)</div>
                </li>
            `;
            total += dish.price;
        }
    }
    
    if (order.salad_id) {
        const dish = dishes.find(d => d.id === order.salad_id);
        if (dish) {
            html += `
                <li>
                    <div class="item-category">Салат</div>
                    <div class="item-with-price">${dish.name} (${dish.price}₽)</div>
                </li>
            `;
            total += dish.price;
        }
    }
    
    if (order.drink_id) {
        const dish = dishes.find(d => d.id === order.drink_id);
        if (dish) {
            html += `
                <li>
                    <div class="item-category">Напиток</div>
                    <div class="item-with-price">${dish.name} (${dish.price}₽)</div>
                </li>
            `;
            total += dish.price;
        }
    }
    
    if (order.dessert_id) {
        const dish = dishes.find(d => d.id === order.dessert_id);
        if (dish) {
            html += `
                <li>
                    <div class="item-category">Десерт</div>
                    <div class="item-with-price">${dish.name} (${dish.price}₽)</div>
                </li>
            `;
            total += dish.price;
        }
    }
    
    html += `
            </ul>
        </div>
        
        <!-- Стоимость: 1180₽ - в одной строке -->
        <div class="order-total-row">
            <div class="order-total-label">Стоимость</div>
            <div class="order-total-value">${total}₽</div>
        </div>
    `;
    
    modalBody.innerHTML = html;
    openModal('viewModal');
}

// Редактирование заказа - открытие модального окна
function editOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Заказ не найден', true);
        return;
    }
    
    let html = `
        <!-- Дата оформления - без выделения, только для чтения -->
        <div class="edit-order-date">
            <div class="form-row">
                <div class="form-label">Дата оформления</div>
                <div class="form-input-readonly">${formatDateTime(order.created_at)}</div>
            </div>
        </div>
        
        <!-- Доставка -->
        <div class="edit-order-section">
            <h3>Доставка</h3>
            
            <div class="form-row">
                <div class="form-label">Имя получателя</div>
                <input type="text" class="form-input" id="editFullName" value="${order.full_name}" required>
            </div>
            
            <div class="form-row">
                <div class="form-label">Адрес доставки</div>
                <input type="text" class="form-input" id="editAddress" value="${order.delivery_address}" required>
            </div>
            
            <div class="form-row">
                <div class="form-label">Тип доставки</div>
                <div class="radio-options">
                    <label class="radio-option">
                        <input type="radio" name="deliveryType" value="now" id="editDeliveryNow" ${order.delivery_type !== 'by_time' ? 'checked' : ''}>
                        <span class="radio-label">Как можно скорее (с 7:00 до 23:00)</span>
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="deliveryType" value="by_time" id="editDeliveryTime" ${order.delivery_type === 'by_time' ? 'checked' : ''}>
                        <span class="radio-label">Ко времени</span>
                    </label>
                </div>
            </div>
            
            <!-- Время доставки - правее, как другие пункты -->
            <div class="form-row" id="editTimeGroup" style="${order.delivery_type === 'by_time' ? 'display: flex;' : 'display: none;'}">
                <div class="form-label">Время доставки</div>
                <div style="flex: 1;">
                    <input type="time" class="time-input" id="editTime" value="${order.delivery_type === 'by_time' && order.delivery_time ? order.delivery_time.substring(0, 5) : '21:00'}">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-label">Телефон</div>
                <input type="tel" class="form-input" id="editPhone" value="${order.phone}" required>
            </div>
            
            <div class="form-row">
                <div class="form-label">Email</div>
                <input type="email" class="form-input" id="editEmail" value="${order.email}" required>
            </div>
        </div>
        
        <!-- Комментарий -->
        <div class="edit-order-section">
            <h3>Комментарий</h3>
            <div class="form-row">
                <div class="form-label" style="align-self: flex-start;">Комментарий</div>
                <textarea class="form-textarea" id="editComment">${order.comment || ''}</textarea>
            </div>
        </div>
        
        <!-- Состав заказа -->
        <div class="edit-order-section">
            <h3>Состав заказа</h3>
            <div class="order-items-edit" id="editOrderComposition">
    `;
    
    let total = 0;
    
    if (order.soup_id) {
        const dish = dishes.find(d => d.id === order.soup_id);
        if (dish) {
            html += `
                <div class="order-item-edit">
                    <div class="item-category-edit">Суп</div>
                    <div class="item-info-edit">${dish.name} (${dish.price}₽)</div>
                </div>
            `;
            total += dish.price;
        }
    }
    
    if (order.main_course_id) {
        const dish = dishes.find(d => d.id === order.main_course_id);
        if (dish) {
            html += `
                <div class="order-item-edit">
                    <div class="item-category-edit">Основное блюдо</div>
                    <div class="item-info-edit">${dish.name} (${dish.price}₽)</div>
                </div>
            `;
            total += dish.price;
        }
    }
    
    if (order.salad_id) {
        const dish = dishes.find(d => d.id === order.salad_id);
        if (dish) {
            html += `
                <div class="order-item-edit">
                    <div class="item-category-edit">Салат</div>
                    <div class="item-info-edit">${dish.name} (${dish.price}₽)</div>
                </div>
            `;
            total += dish.price;
        }
    }
    
    if (order.drink_id) {
        const dish = dishes.find(d => d.id === order.drink_id);
        if (dish) {
            html += `
                <div class="order-item-edit">
                    <div class="item-category-edit">Напиток</div>
                    <div class="item-info-edit">${dish.name} (${dish.price}₽)</div>
                </div>
            `;
            total += dish.price;
        }
    }
    
    if (order.dessert_id) {
        const dish = dishes.find(d => d.id === order.dessert_id);
        if (dish) {
            html += `
                <div class="order-item-edit">
                    <div class="item-category-edit">Десерт</div>
                    <div class="item-info-edit">${dish.name} (${dish.price}₽)</div>
                </div>
            `;
            total += dish.price;
        }
    }
    
    html += `
            </div>
        </div>
        
        <!-- Стоимость: 1180₽ - в одной строке -->
        <div class="edit-total-row">
            <div class="edit-total-label">Стоимость</div>
            <div class="edit-total-value">${total}₽</div>
        </div>
        
        <input type="hidden" id="editOrderId" value="${order.id}">
    `;
    
    document.getElementById('editForm').innerHTML = html;
    
    // Настройка обработчиков для радиокнопок доставки
    const editDeliveryNow = document.getElementById('editDeliveryNow');
    const editDeliveryTimeRadio = document.getElementById('editDeliveryTime');
    const timeGroup = document.getElementById('editTimeGroup');
    
    if (editDeliveryNow) {
        editDeliveryNow.addEventListener('change', function() {
            timeGroup.style.display = 'none';
        });
    }
    
    if (editDeliveryTimeRadio) {
        editDeliveryTimeRadio.addEventListener('change', function() {
            timeGroup.style.display = 'flex';
        });
    }
    
    openModal('editModal');
}

// Сохранение изменений заказа
async function saveOrder() {
    const orderId = document.getElementById('editOrderId').value;
    const form = document.getElementById('editForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const deliveryTime = document.getElementById('editTime').value;
    
    // Валидация времени доставки
    if (deliveryType === 'by_time') {
        if (!deliveryTime) {
            showNotification('Укажите время доставки', true);
            return;
        }
        
        if (!validateDeliveryTime(deliveryTime)) {
            showNotification('Время доставки должно быть в диапазоне с 7:00 до 23:00 с шагом 5 минут', true);
            return;
        }
    }
    
    const data = {
        full_name: document.getElementById('editFullName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        delivery_address: document.getElementById('editAddress').value,
        delivery_type: deliveryType === 'by_time' ? 'by_time' : 'now',
        comment: document.getElementById('editComment').value
    };
    
    if (deliveryType === 'by_time') {
        data.delivery_time = deliveryTime + ':00';
    } else {
        data.delivery_time = null;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.errors || 'Ошибка при сохранении заказа');
        }
        
        closeModal('editModal');
        showNotification('Заказ успешно изменён');
        await loadOrders();
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Ошибка: ' + error.message, true);
    }
}

// Удаление заказа - открытие модального окна
function deleteOrder(orderId) {
    document.getElementById('deleteOrderId').value = orderId;
    openModal('deleteModal');
}

// Подтверждение удаления заказа
async function confirmDelete() {
    const orderId = document.getElementById('deleteOrderId').value;
    
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка при удалении заказа');
        }
        
        closeModal('deleteModal');
        showNotification('Заказ успешно удалён');
        await loadOrders();
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Ошибка: ' + error.message, true);
    }
}

// Открытие модального окна
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Закрытие модального окна
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Показ уведомления
function showNotification(message, isError = false) {
    alert(message);
}