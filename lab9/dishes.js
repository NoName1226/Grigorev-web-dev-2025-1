let dishes = [];

async function loadDishes() {
    const apiKey = '39715e47-c2dd-439d-8fa6-92ad2fefd448';
    const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=${apiKey}`);
    dishes = await response.json();
    
    if (typeof showDishes === 'function') {
        showDishes();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadDishes();
});