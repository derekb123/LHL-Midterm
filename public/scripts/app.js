$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;

  $('#order_button').click( function() {
    event.preventDefault();
    console.log("in order button");
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

