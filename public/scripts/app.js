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

<<<<<<< 968eced38a81fce53ec2f2489ecb499c4f3df122
  $('#order-now').click( function() {
    event.preventDefault();
=======
  $('#order_button').click( function() {
    event.preventDefault();
    console.log("in order button");
>>>>>>> Add route and ajex connection for logout.
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

