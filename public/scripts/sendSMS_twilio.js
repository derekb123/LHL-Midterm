const sendSms = require('./twilio');


$(() => {
  $('.cart_footer').click( function() {
    event.preventDefault();
    const msg = 'Your order will be ready in 20 minutes';
    console.log('send msg to customer')
    sendSms(msg);
  });

});
