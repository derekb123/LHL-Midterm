

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
      const $cartItem =(`
        <li class="cart-item">
          <div class="cart-item-quantity">${orderItem.qty}</div>
          <h2 class="cart-item-title">${orderItem.dish}</h2>
          <div class="cart-item-price">$${orderItem.price * orderItem.qty}</div>
        </li>
        `);
    return $cartItem;
  }

  const updateCartTotals = function(objs) {
      let fullTotal = 0;
      let timeTotal = 0;
      for (obj of objs) {
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


  let $addItemButton = $('.order_button');
  $addItemButton.on('click', function(event) {
    event.preventDefault();
    let menu_item_id = Number($(this).data( "menu-id" ));
    let order_id = localStorage.getItem("order_id") ? localStorage.getItem("order_id") : '';
    console.log('order_items.js ln36 order_id:', order_id)

    $.post(`/api/orders/${order_id}`, {"qty" : 1, "menu_item_id" : menu_item_id})
      .then((responseString) => {
        renderCartItems(responseString);
        renderTotals(responseString);

        localStorage.setItem('order_id', responseString[0].order_id);
    });
  });
});

