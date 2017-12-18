/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var pizzaFilters = {
        all: 'all',
        vega: 'vega',
        meat: 'meat',
        ocean: 'ocean',
        pineapple: 'pineapple',
        mushroom: 'mushroom'
}

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

        if(filter==pizzaFilters.all) Pizza_List.forEach(function(t){
            pizza_shown.push(t);
        });

        else {
            if (filter != pizzaFilters.vega) {
                Pizza_List.forEach(function (t) {
                    if (t.content.hasOwnProperty(filter)) pizza_shown.push(t);

                });
            }
            else Pizza_List.forEach(function (t) {
                if (t.type=='Вега піца') pizza_shown.push(t);
            });
        }



    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);

    var filtrs = $(".filter");

    $(".filter").each(function (i,val) {

        $(val).click(function () {
            for(var j=0;j<$(".filter").length;j++) if(j!=i) $($(".filter")[j]).removeClass("activeFilter");
            $(val).addClass("activeFilter");
            var fil = $(val).attr("id");
            filterPizza(fil);
        });
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;