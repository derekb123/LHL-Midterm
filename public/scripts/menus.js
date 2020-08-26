
$(() => {


  function getAllMenuItems(params) {
    let url = "/api/menu";
    if (params) {
      url += "?" + params;
    }
    return $.ajax({
      url,
    });
  }



});
