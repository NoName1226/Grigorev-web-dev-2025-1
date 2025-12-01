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

const categoryMapping = {
    'soup': 'soup',
    'main-course': 'main',
    'salad': 'starter',
    'drink': 'drink',
    'dessert': 'dessert'
};

document.addEventListener('DOMContentLoaded', function() {
    if (dishes && dishes.length > 0) {
        showDishes();
    }
    document.addEventListener('click', handleClicks);
});


function showDishes() {
    const sorted = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    displayCategoryDishes('soup', sorted);
    displayCategoryDishes('main', sorted);
    displayCategoryDishes('starter', sorted);
    displayCategoryDishes('drink', sorted);
    displayCategoryDishes('dessert', sorted);
}

function displayCategoryDishes(ourCategory, sortedDishes) {
    const container = document.getElementById(`${ourCategory}-dishes`);
    const filteredDishes = getFilteredDishes(sortedDishes, ourCategory);
    
    container.innerHTML = filteredDishes.map(dish => createDishCard(dish)).join('');
}

function getFilteredDishes(dishesList, ourCategory) {
    const apiCategories = Object.keys(categoryMapping).filter(
        apiCat => categoryMapping[apiCat] === ourCategory
    );

    const categoryDishes = dishesList.filter(dish => 
        apiCategories.includes(dish.category)
    );

    const activeFilter = activeFilters[ourCategory];

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
    if (e.target.classList.contains('filter-btn')) {
        const category = e.target.getAttribute('data-category');
        const kind = e.target.getAttribute('data-kind');
        
        document.querySelectorAll(`.filter-btn[data-category="${category}"]`).forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (activeFilters[category] === kind) {
            activeFilters[category] = null;
        } else {
            activeFilters[category] = kind;
            e.target.classList.add('active');
        }
        
        const sorted = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
        displayCategoryDishes(category, sorted);
        return;
    }
    
    if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Добавить') {
        const card = e.target.closest('.dish-card');
        const keyword = card.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === keyword);
        
        if (dish) {
            const ourCategory = categoryMapping[dish.category] || dish.category;
            selected[ourCategory] = dish;
            showOrder();
            highlightCard(card, ourCategory);
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
    document.querySelectorAll('.dish-card').forEach(card => {
        const dish = dishes.find(d => d.keyword === card.getAttribute('data-dish'));
        if (dish) {
            const ourCategory = categoryMapping[dish.category] || dish.category;
            if (ourCategory === category) {
                card.style.border = '2px solid transparent';
            }
        }
    });
    
    selectedCard.style.border = '2px solid tomato';
}