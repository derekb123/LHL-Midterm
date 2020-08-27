const { parse } = require("dotenv");
const { json } = require("body-parser");

//How do we get and store the object from the original request?
const $grilledSalmon = {/*grilled salmon object*/}
const $prawnPasta = {/*grilled salmon object*/}



//How do we get and store the object from the original request?
const createCartItems = function(orderItemArr) {
  let $orderItemsResult = [];
  for (orderItem in orderItemArr) {
    $orderItemsResult.push($(`
    <ul class="cart-items">
      <li class="cart-item">
        <div class="cart-item-quantity">${orderItem.qty}</div>
        <h2 class="cart-item-title">${orderItem.qty}</h2>
        <div class="cart-item-price">${orderItem.price}</div>
      </li>
    </ul>
    </article>`));
  }
  return $orderItemsResult;
}

// LOADMENU ITEMS FUNCTION THAT CALLS OTHER ABOVE FUNCTIONS AND IS CALLED IN THE POST QUERY
// loadMenuItems(menu_items){
//   loopThroughItems() {
//     somethingelse ()
//   }
// }

let $addItemButton = $(`#into-cart${menu_item_id}`);
$addItemButton.on('click', (event) => {
  event.preventDefault();
//INCREMENT QUANITY: QTY ++



//JSON.stringify instead of serialize
  const serialized = $($addItemButton).serialize();
  order_id = document.document.getElementById("order_id").value;
//MIGHT WANT TO USE FORMS SO THAT
//THE SECOND ARGUMENT IN .POST IS THE BODY INFORMATION, WHICH IS SERIALZED BEFORE SENDING
  $.post(`/api/orders/${order_id}`, serialized)
//NEED TO SEND
    .then((menu_items) => {
      json.parse(menu_items)
      loadMenuItems(menu_items);
      localStorage.setItem('order_id', menu_items.order_id);
      order_id = menu_items.order_id;

//FOR LOOP TO GO THROUGH MENU ITEMS, GENERATE LI TAGS AS WE GO THROUGH!
//[STRETCH - EDGE CASES LIKE IF MENU ITEMS IS EMPTY]
//APPEND OR PREPEND??
});
