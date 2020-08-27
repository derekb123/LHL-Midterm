$(() => {
  //original skeleton
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for (user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;

<<<<<<< 233d344f1d4531f6fbbe7bd7c3831447019bae2d
<<<<<<< 968eced38a81fce53ec2f2489ecb499c4f3df122
  $('#order-now').click( function() {
    event.preventDefault();
=======
  $('#order_button').click( function() {
    event.preventDefault();
    console.log("in order button");
>>>>>>> Add route and ajex connection for logout.
=======
  $('#order-now').click( function() {
    event.preventDefault();
>>>>>>> Add id=order-now to order now button to connect submit route and twilio
    $.ajax({
      method: "POST",
      url: "/api/orders/1/submit/"
    })
  });

  $('#logout').click(() => {
    return $.ajax({
      method: "POST",
      url: "/api/users/logout",
    })
  });
});

