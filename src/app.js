angular.module('LibraryApp', [])
  .controller('LibraryController', function ($http) {
    var library = this;

    library.searchTerm = '';
    library.books = [];
    library.currentPage = 1;
    library.errorMessage = '';

    library.searchBooks = function () {
      library.currentPage = 1;
      library.fetchBooks();
    };

    library.fetchBooks = function () {
      var startIndex = (library.currentPage - 1) * 10;
      var searchUrl = 'https://openlibrary.org/search.json?title=' + library.searchTerm + '&limit=10&offset=' + startIndex;

      $http.get(searchUrl)
        .then(function (response) {
          if (response.data.numFound > 0) {
            library.books = response.data.docs.map(function (book) {
              return {
                title: book.title,
                author: book.author_name ? book.author_name.join(', ') : 'Unknown',
                publishYear: book.first_publish_year || 'N/A',
                cover: 'https://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg'
              };
            });
            library.errorMessage = '';
          } else {
            library.books = [];
            library.errorMessage = 'The book does not exist or is not available.';
          }
        })
        .catch(function (error) {
          console.log('Error fetching books:', error);
          library.books = [];
          library.errorMessage = 'An error occurred while fetching books. Please try again later.';
        });
    };

    library.previousPage = function () {
      if (library.currentPage > 1) {
        library.currentPage--;
        library.fetchBooks();
      }
    };

    library.nextPage = function () {
      library.currentPage++;
      library.fetchBooks();
    };
  });
