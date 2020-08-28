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

    const renderTotals = function(orderObj) {
      $(".cart-total").empty();
      const $cartTotals = updateCartTotals(orderObj);
        $(".cart-total").prepend($cartTotals);
      }

  //composes cart item as template literal string in html format
  const createCartItem = function(orderItem) {
      let itemTotals;
      const $cartItem =(`
        <li class="cart-item">
          <div class="cart-item-quantity">${orderItem.qty}</div>
          <h2 class="cart-item-title">${orderItem.dish}</h2>
          <div class="cart-item-price">$${orderItem.price}</div>
        </li>
        `);
    return $cartItem;
  }

  const updateCartTotals = function(objs) {
      let fullTotal = 0;
      let timeTotal = 0;
      for (obj of objs) {
        // console.log(obj.price);
        // console.log(obj.qty);
        // console.log(obj.prep_time);
        fullTotal += Number((obj.price * obj.qty));
        timeTotal += Number((obj.prep_time * obj.qty));
      }

      const $totalsElement =(`
        <li class="cart-item">
        <div class="cart-total-amount"><span class="" style="color: rgba(38,42,52,1);font-size: 17px;">Your order total is <strong>$${fullTotal}</strong></span>
        <div class="cart-total-time"><span class="" style="color: rgba(38,42,52,1);font-size: 12px;">Your estimated order time is <strong>${timeTotal} minutes </strong></span>
        </li>
        `);
    return $totalsElement;
  }

  //Way to use variable to access any button clicked..?
  // let $addItemButton = $(`#into-cart${menu_item_id}`);


  let $addItemButton = $('.order_button');
  $addItemButton.on('click', function(event) {
    event.preventDefault();
  //need to use "target" button?
    let menu_item_id = Number($(this).data( "menu-id" ));
    let order_id = localStorage.getItem("order_id") ? localStorage.getItem("order_id") : '';
    console.log('order_items.js ln36 order_id:', order_id)

    $.post(`/api/orders/${order_id}`, {"qty" : 1, "menu_item_id" : menu_item_id})
    //Is the responseString below receiving the post response data from server??
      .then((responseString) => {
        renderCartItems(responseString);
        console.log(responseString);
        renderTotals(responseString);

        localStorage.setItem('order_id', responseString[0].order_id);
        console.log('order_items.js ln43 local storage:', localStorage)
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

