// const { parse } = require("dotenv");
// const { json } = require("body-parser");

$(document).ready(function() {

  //empties pre-existing items from container, renders and adds the new item @ top of list
    const renderCartItems = function(cartItemsArr) {
      $("#cart-items").empty();
      for (const cartItem of cartItemsArr) {
        const $cartItemRender = createCartItem(cartItem);
        $("#cart-items").prepend($cartItemRender);
      }
    }

  //composes cart item as template literal string in html format
  const createCartItem = function(orderItem) {
      const $cartItem =(`
        <li class="cart-item">
          <div class="cart-item-quantity">${orderItem.qty}</div>
          <h2 class="cart-item-title">${orderItem.dish}</h2>
          <div class="cart-item-price">${orderItem.price}</div>
        </li>
        `);
    return $cartItem;
  }

  //Way to use variable to access any button clicked..?
  // let $addItemButton = $(`#into-cart${menu_item_id}`);

  let $addItemButton = $('.order_button');
  $addItemButton.on('click', function(event) {
    event.preventDefault();
  //need to use "target" button?
    let menu_item_id = Number($(this).data( "menu-id" ));
    let order_id = localStorage.getItem("order_id") ? localStorage.getItem("order_id") : '';

    $.post(`/api/orders/${order_id}`, {"qty" : 1, "menu_item_id" : menu_item_id})
    //Is the responseString below receiving the post response data from server??
      .then((responseString) => {
        renderCartItems(responseString);
        localStorage.setItem('order_id', responseString[0].order_id);
    });
  });
});

  //***NOTES***/
  //INCREMENT QUANITY: QTY ++

  //JSON.stringify instead of serialize

  // order_id = document.getElementById("order_id").value;
  //MIGHT WANT TO USE FORMS SO THAT
  //THE SECOND ARGUMENT IN .POST IS THE BODY INFORMATION, WHICH IS SERIALZED BEFORE SENDING

  //FOR LOOP TO GO THROUGH MENU ITEMS, GENERATE LI TAGS AS WE GO THROUGH!
  //[STRETCH - EDGE CASES LIKE IF MENU ITEMS IS EMPTY]
  //APPEND OR PREPEND??

  // LOADMENU ITEMS FUNCTION THAT CALLS OTHER ABOVE FUNCTIONS AND IS CALLED IN THE POST QUERY
  // loadMenuItems(menu_items){
  //   loopThroughItems() {
  //     somethingelse ()
  //   }
  // }

