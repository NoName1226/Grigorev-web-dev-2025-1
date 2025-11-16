let selected = { soup: null, main: null, drink: null };

document.addEventListener('DOMContentLoaded', function() {
    showDishes();
    document.addEventListener('click', handleClicks);
});

function showDishes() {
    const sorted = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
    
    ['soup', 'main', 'drink'].forEach(category => {
        const container = document.querySelector(`section:nth-child(${getSectionIndex(category)}) .dishes-grid`);
        const categoryDishes = sorted.filter(dish => dish.category === category);
        
        container.innerHTML = categoryDishes.map(dish => `
            <div class="dish-card" data-dish="${dish.keyword}">
                <img src="${dish.image}" alt="${dish.name}">
                <p class="price">${dish.price} ₽</p>
                <p class="name">${dish.name}</p>
                <p class="weight">${dish.count}</p>
                <button>Добавить</button>
            </div>
        `).join('');
    });
}

function handleClicks(e) {
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
    
    const hasSelection = selected.soup || selected.main || selected.drink;
    
    if (!hasSelection) {
        orderSection.innerHTML = '<p>Ничего не выбрано</p>';
        orderForm.style.display = 'none';
        return;
    }
    
    orderForm.style.display = 'block';
    
    const total = (selected.soup?.price || 0) + (selected.main?.price || 0) + (selected.drink?.price || 0);
    
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
            <h3>Напитки</h3>
            <p>${selected.drink ? selected.drink.name + ' - ' + selected.drink.price + ' ₽' : 'Напиток не выбран'}</p>
        </div>
        <div class="order-total">
            <h3>Стоимость заказа</h3>
            <p>${total} ₽</p>
        </div>
    `;
    
    orderSection.innerHTML = orderHTML;
    
    document.getElementById('soupInput').value = selected.soup?.keyword || '';
    document.getElementById('mainInput').value = selected.main?.keyword || '';
    document.getElementById('drinkInput').value = selected.drink?.keyword || '';
    document.getElementById('totalInput').value = total;
}

function highlightCard(selectedCard, category) {
    document.querySelectorAll('.dish-card').forEach(card => {
        const dish = dishes.find(d => d.keyword === card.getAttribute('data-dish'));
        if (dish?.category === category) {
            card.style.border = '2px solid transparent';
        }
    });
    
    selectedCard.style.border = '2px solid tomato';
}

function getSectionIndex(category) {
    return { soup: 1, main: 2, drink: 3 }[category];
}