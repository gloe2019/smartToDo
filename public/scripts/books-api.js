$(() => {
  $('#search').on('click', '.item-input', function() {
    let $bookList = [];
    $("#book-search").on('input', function() {
      // target text in search box, pass that into API as query term...
      $('#book-res').empty();
      let input = $(this).val();
      console.log(input.length);
      //Idea: Convert AJAX req into a promise, use .then to access data to store in db...
      if (input.length >= 4) {
        $.get(`https://www.googleapis.com/books/v1/volumes?q=${input}`, function(data) {
          console.log('API call:');
        })
          .then(data => {
            const dataArr = data.items;
            $bookList = data.items;
            for (let i = 0; i < 5; i++) {
              //dynamically show search results on page
              $('#book-res').prepend(`<li data-id="${i}" id="book${i + 1}" class="search-result"><div class="left"><p class="text-1 book-title">${dataArr[i].volumeInfo.title}</p><p class="text-2 author">By ${dataArr[i].volumeInfo.authors}</p></div><div class="right"><img class="item-img thumbnail" src=${dataArr[i].volumeInfo.imageLinks.thumbnail} /></div></li> `);
            }
          })
      }
    });

    $('#book-res').on('click', 'li', function() {
      //how would I access dataArr[i] when i click the Select this button?
      // onclick i want to do selectBook(dataArr[i])
      // Do something on an existent or future .dynamicElement

      let dataSelected = $(this).attr("data-id");
      console.log('______', dataSelected);
      const bookInfo = $bookList[dataSelected];
      console.log('++++', bookInfo);
      const userId = $("#userid").val();
      console.log('userId', userId);
      const bookObj = { user: userId, title: bookInfo.volumeInfo.title, author: bookInfo.volumeInfo.authors[0], publisher: bookInfo.volumeInfo.publisher, image: bookInfo.volumeInfo.imageLinks.thumbnail };
      console.log(bookObj);
      $.post("/api/books/new", bookObj)
        .done(function(data) {
          console.log(data);
          Swal.fire({
            title: 'Book Added',
            text: "Don't forget a bookmark!",
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

// Need to write query to store data in db -- CREATED table (books_api)
