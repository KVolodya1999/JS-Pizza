/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

var basil = require('basil.js');
basil = new basil();

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var price = 0;
var amount = 0;
var $amount = $(".amountOfOrders");
var $price = $(".sum");

//HTML едемент куди будуть додаватися піци
var $cart = $(".allOrders");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var bool = false;
    var elem;

    Cart.forEach(function (t) {
       if(pizza.title==t.pizza.title&&t.size==size){
           bool=true;
           elem = t;
       }
   });

    if(!bool){
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        amount = amount + 1;
        price = price + pizza[size].price;
    }
    else {
        elem.quantity++;
        price += pizza[size].price;
        amount++;
    }


    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика

    var p = cart_item.quantity*(cart_item.pizza[cart_item.size].price);
    price -= p;
    amount -= cart_item.quantity;
    delete Cart[Cart.indexOf(cart_item)];

    Cart = Cart.filter(function(x) {
        if(x) return true;
        return false;
    });

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його

    var amountOfPizzasInStorage = basil.get('amount');
        if(amountOfPizzasInStorage>0){
                Cart = basil.get('pizzas');
                Cart = Cart.filter(function(t) {
                        if(t)return true;
                        else return false;
                });

                amount = basil.get('amount');
                price = basil.get('price');
            }

    $('.clearLabel').click(function () {
        Cart.forEach(removeFromCart);
    });

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    basil.set("pizzas",Cart);
    basil.set("amount",amount);
    basil.set("price",price);


    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".clearButton").click(function(){
            removeFromCart(cart_item);
        });

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            amount += 1;
            var p = cart_item.pizza[cart_item.size].price;
            price += p;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Зменшуємо кількість замовлених піц
            if(cart_item.quantity!=1) {
                cart_item.quantity -= 1;
                amount -= 1;
                var p = cart_item.pizza[cart_item.size].price;
                price -= p;
            }
            else {
                removeFromCart(cart_item);
            }
            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }


    $cart.html("");

    $price.html("");
    $price.text(price+" грн");
    $amount.html("");
    $amount.append(amount);

    Cart.forEach(showOnePizzaInCart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;