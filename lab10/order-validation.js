function initOrderValidation() {
    const orderForm = document.getElementById('orderForm');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const okButton = document.getElementById('okButton');

    if (!orderForm) return;

    orderForm.addEventListener('submit', function(event) {
        const soup = document.getElementById('soupHidden').value;
        const main = document.getElementById('mainHidden').value;
        const starter = document.getElementById('starterHidden').value;
        const drink = document.getElementById('drinkHidden').value;
        const dessert = document.getElementById('dessertHidden').value;
        
        const selected = {
            soup: soup !== '',
            main: main !== '',
            starter: starter !== '',
            drink: drink !== '',
            dessert: dessert !== ''
        };

        if (!selected.soup && !selected.main && !selected.starter && !selected.drink && !selected.dessert) {
            event.preventDefault();
            notificationMessage.textContent = 'Ничего не выбрано. Выберите блюда для заказа';
            notification.style.display = 'block';
            return;
        }
        
        const validCombinations = [
            { soup: true, main: true, starter: true, drink: true },
            { soup: true, main: true, drink: true },
            { soup: true, main: true, starter: true },
            { main: true, starter: true, drink: true },
            { main: true, drink: true },

            { soup: true, starter: true, drink: true },
            { soup: true, starter: true },
            { soup: true, drink: true },
            { starter: true, drink: true },
            { soup: true },
            { starter: true },
            { drink: true }
        ];
        
        let isValid = false;
        for (const combo of validCombinations) {
            let match = true;
            for (const key in combo) {
                if (combo[key] !== selected[key]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                isValid = true;
                break;
            }
        }
        
        if (!isValid) {
            event.preventDefault();
            showNotification(selected, notificationMessage, notification);
        }
    });
    
    function showNotification(selected, notificationMessage, notification) {
        let message = '';

        if (selected.main && !selected.drink) {
            message = 'Выберите напиток';
        } else if (!selected.main && !selected.soup && !selected.starter) {
            message = 'Выберите суп или салат';
        } else {
            message = 'Комбинация блюд недопустима. Выберите другую комбинацию';
        }
        
        notificationMessage.textContent = message;
        notification.style.display = 'block';
    }
    
    if (okButton) {
        okButton.addEventListener('click', function() {
            notification.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initOrderValidation();
});