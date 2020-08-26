const sendSms = require('./twilio');


$(() => {
  $('.cart_footer').click( function() {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/api/orders"
      data:
    }).done((users) => {
      for(user of users) {
        $("<div>").text(user.name).appendTo($("body"));
      }
    });;
    const msg = 'Your order will be ready in 20 minutes';
    console.log('send msg to customer')
    sendSms(msg);
  });

});
