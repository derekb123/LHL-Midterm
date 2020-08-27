$(() => {
  $('#order_button').click( function() {
    event.preventDefault();
    console.log("in order button");
    $.ajax({
      method: "POST",
      url: "/api/orders/1/submit/"
    })
  });
});
