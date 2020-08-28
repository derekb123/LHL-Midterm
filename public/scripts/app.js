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

  const clearUserId = () => {
    localStorage.clear();
  }

  const onError = () => {
    localStorage.clear();
  }


  $('#order-now').click(function() {
    event.preventDefault();
    $("#cart-items").empty();
    $.ajax({
      method: "POST",
      url: `/api/orders/2/submit/`,
      success: clearUserId,
      error: onError
    })

  });

  $('#logout').click(() => {
    return $.ajax({
      method: "POST",
      url: "/api/users/logout",
    })
  });
});

