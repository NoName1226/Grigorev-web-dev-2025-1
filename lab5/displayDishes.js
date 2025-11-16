let selected = { 
    soup: null, 
    main: null, 
    starter: null, 
    drink: null, 
    dessert: null 
};

let activeFilters = {
    soup: null,
    main: null,
    starter: null,
    drink: null,
    dessert: null
};

document.addEventListener('DOMContentLoaded', function() {
    showDishes();
    document.addEventListener('click', handleClicks);
});

function showDishes() {
    const sorted = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    // Отображаем блюда для каждой категории
    displayCategoryDishes('soup', sorted);
    displayCategoryDishes('main', sorted);
    displayCategoryDishes('starter', sorted);
    displayCategoryDishes('drink', sorted);
    displayCategoryDishes('dessert', sorted);
}

function displayCategoryDishes(category, sortedDishes) {
    const container = document.getElementById(`${category}-dishes`);
    const filteredDishes = getFilteredDishes(sortedDishes, category);
    
    container.innerHTML = filteredDishes.map(dish => createDishCard(dish)).join('');
}

function getFilteredDishes(dishesList, category) {
    const categoryDishes = dishesList.filter(dish => dish.category === category);
    const activeFilter = activeFilters[category];
    
    if (!activeFilter) {
        return categoryDishes;
    }
    
    return categoryDishes.filter(dish => dish.kind === activeFilter);
}

function createDishCard(dish) {
    return `
        <div class="dish-card" data-dish="${dish.keyword}">
            <img src="${dish.image}" alt="${dish.name}" onerror="this.src='images/placeholder.jpg'">
            <p class="price">${dish.price} ₽</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button>Добавить</button>
        </div>
    `;
}

function handleClicks(e) {
    // Обработка кликов по кнопкам фильтров
    if (e.target.classList.contains('filter-btn')) {
        const category = e.target.getAttribute('data-category');
        const kind = e.target.getAttribute('data-kind');
        
        // Снимаем активный класс со всех фильтров этой категории
        document.querySelectorAll(`.filter-btn[data-category="${category}"]`).forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Если кликнули на уже активный фильтр - снимаем фильтр
        if (activeFilters[category] === kind) {
            activeFilters[category] = null;
        } else {
            // Иначе применяем новый фильтр
            activeFilters[category] = kind;
            e.target.classList.add('active');
        }
        
        // Обновляем отображение блюд этой категории
        const sorted = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
        displayCategoryDishes(category, sorted);
        return;
    }
    
    // Обработка кликов по кнопкам "Добавить"
    if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Добавить') {
        const card = e.target.closest('.dish-card');
        const keyword = card.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === keyword);
        
        if (dish) {
            selected[dish.category] = dish;
            showOrder();
            highlightCard(card, dish.category);
        }
    }
}

function showOrder() {
    const orderSection = document.querySelector('.order-section');
    const orderForm = document.getElementById('orderForm');
    
    const hasSelection = selected.soup || selected.main || selected.starter || selected.drink || selected.dessert;
    
    if (!hasSelection) {
        orderSection.innerHTML = '<p>Ничего не выбрано</p>';
        orderForm.style.display = 'none';
        return;
    }
    
    orderForm.style.display = 'block';
    
    const total = (selected.soup?.price || 0) + 
                  (selected.main?.price || 0) + 
                  (selected.starter?.price || 0) + 
                  (selected.drink?.price || 0) + 
                  (selected.dessert?.price || 0);
    
    let orderHTML = `
        <div class="order-category">
            <h3>Супы</h3>
            <p>${selected.soup ? selected.soup.name + ' - ' + selected.soup.price + ' ₽' : 'Блюдо не выбрано'}</p>
        </div>
        <div class="order-category">
            <h3>Главные блюда</h3>
            <p>${selected.main ? selected.main.name + ' - ' + selected.main.price + ' ₽' : 'Блюдо не выбрано'}</p>
        </div>
        <div class="order-category">
            <h3>Салаты и стартеры</h3>
            <p>${selected.starter ? selected.starter.name + ' - ' + selected.starter.price + ' ₽' : 'Блюдо не выбрано'}</p>
        </div>
        <div class="order-category">
            <h3>Напитки</h3>
            <p>${selected.drink ? selected.drink.name + ' - ' + selected.drink.price + ' ₽' : 'Напиток не выбран'}</p>
        </div>
        <div class="order-category">
            <h3>Десерты</h3>
            <p>${selected.dessert ? selected.dessert.name + ' - ' + selected.dessert.price + ' ₽' : 'Десерт не выбран'}</p>
        </div>
        <div class="order-total">
            <h3>Стоимость заказа</h3>
            <p>${total} ₽</p>
        </div>
    `;
    
    orderSection.innerHTML = orderHTML;
    
    document.getElementById('soupInput').value = selected.soup?.keyword || '';
    document.getElementById('mainInput').value = selected.main?.keyword || '';
    document.getElementById('starterInput').value = selected.starter?.keyword || '';
    document.getElementById('drinkInput').value = selected.drink?.keyword || '';
    document.getElementById('dessertInput').value = selected.dessert?.keyword || '';
    document.getElementById('totalInput').value = total;
}

function highlightCard(selectedCard, category) {
    // Снимаем выделение со всех карточек этой категории
    document.querySelectorAll('.dish-card').forEach(card => {
        const dish = dishes.find(d => d.keyword === card.getAttribute('data-dish'));
        if (dish?.category === category) {
            card.style.border = '2px solid transparent';
        }
    });
    
    // Выделяем выбранную карточку
    selectedCard.style.border = '2px solid tomato';
}