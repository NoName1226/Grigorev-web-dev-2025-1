const dishes = [
    {
        keyword: 'borshch',
        name: 'Борщ с говядиной',
        price: 250,
        category: 'soup',
        count: '350 мл',
        image: 'images/soup1.jpg',
        kind: 'meat'
    },
    {
        keyword: 'chicken_soup',
        name: 'Куриный суп с лапшой',
        price: 200,
        category: 'soup',
        count: '350 мл',
        image: 'images/soup2.jpg',
        kind: 'meat'
    },
    {
        keyword: 'mushroom_soup',
        name: 'Грибной крем-суп',
        price: 280,
        category: 'soup',
        count: '300 мл',
        image: 'images/soup3.jpg',
        kind: 'veg'
    },

    {
        keyword: 'tom_yam',
        name: 'Том ям с креветками',
        price: 650,
        category: 'soup',
        count: '500 г',
        image: 'images/soup4.jpg',
        kind: 'fish'
    },
    {
        keyword: 'norwegian_soup',
        name: 'Норвежский суп',
        price: 270,
        category: 'soup',
        count: '330 г',
        image: 'images/soup5.jpg',
        kind: 'fish'
    },
    {
        keyword: 'gaspacho',
        name: 'Гаспачо',
        price: 195,
        category: 'soup',
        count: '350 г',
        image: 'images/soup6.jpg',
        kind: 'veg'
    },

    {
        keyword: 'chicken_vegetables',
        name: 'Курица с овощами',
        price: 350,
        category: 'main',
        count: '300 г',
        image: 'images/main1.jpg',
        kind: 'meat'
    },
    {
        keyword: 'pasta_carbonara',
        name: 'Паста Карбонара',
        price: 320,
        category: 'main',
        count: '250 г',
        image: 'images/main2.jpg',
        kind: 'meat'
    },
    {
        keyword: 'grilled_salmon',
        name: 'Лосось на гриле',
        price: 450,
        category: 'main',
        count: '200 г',
        image: 'images/main3.jpg',
        kind: 'fish'
    },

    {
        keyword: 'fried_potatoes_mushrooms',
        name: 'Жареная картошка с грибами',
        price: 150,
        category: 'main',
        count: '250 г',
        image: 'images/main4.jpg',
        kind: 'veg'
    },
    {
        keyword: 'pizza_margarita',
        name: 'Пицца Маргарита',
        price: 450,
        category: 'main',
        count: '470 г',
        image: 'images/main5.jpg',
        kind: 'veg'
    },
    {
        keyword: 'pasta_shrimp',
        name: 'Паста с креветками',
        price: 340,
        category: 'main',
        count: '280 г',
        image: 'images/main6.jpg',
        kind: 'fish'
    },

    {
        keyword: 'orange_juice',
        name: 'Апельсиновый сок',
        price: 150,
        category: 'drink',
        count: '330 мл',
        image: 'images/drink1.jpg',
        kind: 'cold'
    },
    {
        keyword: 'coffee_latte',
        name: 'Кофе латте',
        price: 180,
        category: 'drink',
        count: '250 мл',
        image: 'images/drink2.jpg',
        kind: 'hot'
    },
    {
        keyword: 'green_tea',
        name: 'Зеленый чай',
        price: 120,
        category: 'drink',
        count: '300 мл',
        image: 'images/drink3.jpg',
        kind: 'hot'
    },
 
    {
        keyword: 'apple_juice',
        name: 'Яблочный сок',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: 'images/drink4.jpg',
        kind: 'cold'
    },
    {
        keyword: 'carrot_juice',
        name: 'Морковный сок',
        price: 110,
        category: 'drink',
        count: '300 мл',
        image: 'images/drink5.jpg',
        kind: 'cold'
    },
    {
        keyword: 'black_tea',
        name: 'Черный чай',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: 'images/drink6.jpg',
        kind: 'hot'
    },


    {
        keyword: 'korean_salad',
        name: 'Корейский салат с овощами и яйцом',
        price: 330,
        category: 'starter',
        count: '250 г',
        image: 'images/starter1.jpg',
        kind: 'veg'
    },
    {
        keyword: 'tuna_salad',
        name: 'Салат с тунцом',
        price: 480,
        category: 'starter',
        count: '250 г',
        image: 'images/starter2.jpg',
        kind: 'fish'
    },
    {
        keyword: 'caesar_chicken',
        name: 'Цезарь с цыпленком',
        price: 370,
        category: 'starter',
        count: '220 г',
        image: 'images/starter3.jpg',
        kind: 'meat'
    },
    {
        keyword: 'fries_caesar',
        name: 'Картофель фри с соусом Цезарь',
        price: 280,
        category: 'starter',
        count: '235 г',
        image: 'images/starter4.jpg',
        kind: 'veg'
    },
    {
        keyword: 'caprese',
        name: 'Капрезе с моцареллой',
        price: 350,
        category: 'starter',
        count: '235 г',
        image: 'images/starter5.jpg',
        kind: 'veg'
    },
    {
        keyword: 'fries_ketchup',
        name: 'Картофель фри с кетчупом',
        price: 260,
        category: 'starter',
        count: '235 г',
        image: 'images/starter6.jpg',
        kind: 'veg'
    },

    {
        keyword: 'baklava',
        name: 'Пахлава',
        price: 220,
        category: 'dessert',
        count: '300 г',
        image: 'images/dessert1.jpg',
        kind: 'small'
    },
    {
        keyword: 'chocolate_cake',
        name: 'Шоколадный торт',
        price: 270,
        category: 'dessert',
        count: '140 г',
        image: 'images/dessert2.jpg',
        kind: 'small'
    },
    {
        keyword: 'cheesecake',
        name: 'Чизкейк',
        price: 240,
        category: 'dessert',
        count: '125 г',
        image: 'images/dessert3.jpg',
        kind: 'small'
    },
    {
        keyword: 'donuts_3',
        name: 'Пончики (3 штуки)',
        price: 410,
        category: 'dessert',
        count: '350 г',
        image: 'images/dessert4.jpg',
        kind: 'medium'
    },
    {
        keyword: 'chocolate_cheesecake',
        name: 'Шоколадный чизкейк',
        price: 260,
        category: 'dessert',
        count: '125 г',
        image: 'images/dessert5.jpg',
        kind: 'medium'
    },
    {
        keyword: 'donuts_6',
        name: 'Пончики (6 штук)',
        price: 650,
        category: 'dessert',
        count: '700 г',
        image: 'images/dessert6.jpg',
        kind: 'large'
    }

];
