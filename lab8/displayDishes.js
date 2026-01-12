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
    loadFromLocalStorage();
    if (dishes && dishes.length > 0) {
        showDishes();
        showOrder();
    }
    document.addEventListener('click', handleClicks);
});

function loadFromLocalStorage() {
    const saved = localStorage.getItem('order');
    if (saved) {
        const ids = JSON.parse(saved);
        setTimeout(() => {
            selected.soup = dishes.find(d => d.id == ids.soup) || null;
            selected.main = dishes.find(d => d.id == ids.main) || null;
            selected.starter = dishes.find(d => d.id == ids.starter) || null;
            selected.drink = dishes.find(d => d.id == ids.drink) || null;
            selected.dessert = dishes.find(d => d.id == ids.dessert) || null;
            showOrder();
            highlightSelectedDishes();
        }, 100);
    }
}

function saveToLocalStorage() {
    const ids = {
        soup: selected.soup?.id || '',
        main: selected.main?.id || '',
        starter: selected.starter?.id || '',
        drink: selected.drink?.id || '',
        dessert: selected.dessert?.id || ''
    };
    localStorage.setItem('order', JSON.stringify(ids));
}

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
    highlightSelectedDishes();
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
            saveToLocalStorage();
            showOrder();
            highlightCard(card, ourCategory);
        }
    }
}

function highlightSelectedDishes() {
    document.querySelectorAll('.dish-card').forEach(card => {
        card.style.border = '2px solid transparent';
    });
    
    Object.keys(selected).forEach(category => {
        if (selected[category]) {
            const card = document.querySelector(`[data-dish="${selected[category].keyword}"]`);
            if (card) {
                card.style.border = '2px solid tomato';
            }
        }
    });
}

function showOrder() {
    const orderPanel = document.getElementById('orderPanel');
    const orderTotal = document.getElementById('orderTotal');
    const checkoutLink = document.getElementById('checkoutLink');
    
    const hasSelection = selected.soup || selected.main || selected.starter || selected.drink || selected.dessert;
    
    if (!hasSelection) {
        orderPanel.style.display = 'none';
        return;
    }
    
    orderPanel.style.display = 'block';
    
    const total = (selected.soup?.price || 0) + 
                  (selected.main?.price || 0) + 
                  (selected.starter?.price || 0) + 
                  (selected.drink?.price || 0) + 
                  (selected.dessert?.price || 0);
    
    orderTotal.textContent = total + ' ₽';
    
    const isValidCombo = checkCombo();
    if (isValidCombo) {
        checkoutLink.classList.remove('disabled');
    } else {
        checkoutLink.classList.add('disabled');
    }
}

function checkCombo() {
    const hasSelection = {
        soup: !!selected.soup,
        main: !!selected.main,
        starter: !!selected.starter,
        drink: !!selected.drink,
        dessert: !!selected.dessert
    };
    
    // Точно 5 комбинаций из таблицы (десерт можно добавить к любой)
    const validCombinations = [
        { soup: true, main: true, starter: true, drink: true },  // Комбо 1
        { soup: true, main: true, drink: true },                  // Комбо 2
        { soup: true, starter: true, drink: true },               // Комбо 3
        { main: true, starter: true, drink: true },               // Комбо 4
        { main: true, drink: true }                               // Комбо 5
    ];
    
    // Проверяем без десерта
    for (const combo of validCombinations) {
        let match = true;
        for (const key of ['soup', 'main', 'starter', 'drink']) {
            const expected = combo[key] || false;
            if (expected !== hasSelection[key]) {
                match = false;
                break;
            }
        }
        if (match) {
            return true;
        }
    }
    
    return false;
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