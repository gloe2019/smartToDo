$(document).ready(function() {
  let $restaurantList = [];
  $('#search').on('click', '.item-input', function() {

    $("#food-search").on('input', function() {
      // target text in search box, pass that into API as query term...
      $('#food-res').empty();
      let input = $(this).val();
      if (input.length >= 4) {

        let queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search";
         //Add your key here

        $.ajax({
          url: queryURL,
          method: "GET",
          headers: {
            "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${config.restaurantApiKey}`
          },
          data: {
            term: `${input}`,
            location: 'Toronto',
            sort_by: 'rating',
            categories: 'restaurants',
            limit: 5
          }
        }).then(data => {
          console.log(data);
          const dataArr = data.businesses;
          $restaurantList = data.businesses;

          for (let i = 0; i < 4; i++) {
            $('#food-res').append(`
            <li data-id="${i}" class="search-result"> <div class="left"><p class="text-1">${dataArr[i].name}</p> <p class="text-2 address" >${dataArr[i].location.address1}, ${dataArr[i].location.city}, ${dataArr[i].location.state}</p><p class="text-3">Rating: ${dataArr[i].rating}</p></div><div class="right"><img src=${dataArr[i].image_url} class="item-img"/></div></li>`)

          }
        });
      }
    });
    $('#food-res').on('click', 'li', function() {
      let dataSelected = $(this).attr("data-id");
      console.log('______', dataSelected);
      const restaurantInfo = $restaurantList[dataSelected];
      console.log('++++', restaurantInfo);
      const userId = $("#userid").val();
      console.log('userId', userId);
      const restObj = { user: userId, name: restaurantInfo.name, address: restaurantInfo.location.address1 || null, city: restaurantInfo.location.city, image: restaurantInfo.image_url, rating: restaurantInfo.rating, type: "restaurant" };
      console.log('restObj', restObj);
      $.post("/api/restaurants/new", restObj)
        .done((data) => {
          console.log(data);
          Swal.fire({
            title: 'Restaurant Added',
            text: "Hope you're hungry!",
            timer: 2000,
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false
          })
          window.location = "/";
        });
    });
  });
});

