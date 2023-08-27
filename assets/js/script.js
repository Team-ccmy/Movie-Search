document.addEventListener("DOMContentLoaded", function () {
    
    document.getElementById("toggle").addEventListener("change", function () {
      if (this.checked) {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    });
  
    // When the page loads, check local storage for user's theme preference
    window.addEventListener("DOMContentLoaded", (event) => {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.body.setAttribute("data-theme", savedTheme);
  
      const toggleCheckbox = document.getElementById("toggle");
      if (savedTheme === "dark") {
        toggleCheckbox.checked = true;
      }
    });
  
    var searchForm = document.querySelector(".searchForm");
    var queryInput = searchForm.querySelector("input");
    var searchResultCard = document.querySelector(".searchResultCard");
  
    // Load movie genres from the API and populate the genre dropdown
    function loadGenres() {
      var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
      var apiUrl =
        "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
        apiKey +
        "&language=en-US";
  
      // Use the fetch function to get data from the API
      fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var genres = data.genres;
          console.log(genres);
          var genreFilter = document.getElementById("genre-filter");
  
          genres.forEach(function (genre) {
            var option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
          });
  
          var selectItems = document.querySelectorAll("select");
          M.FormSelect.init(selectItems);
        })
        .catch(function (error) {
          console.error("Error fetching genres:", error);
        });
    }
  
    // The function to load years
    function loadYears() {
      const currentYear = new Date().getFullYear();
      const earliestYear = 1950;
      const yearFilter = document.getElementById("year-filter");
  
      for (let i = currentYear; i >= earliestYear; i--) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearFilter.appendChild(option);
      }
    }
  
    // The function to load countries
  
    loadGenres();
    loadYears();
  
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (searchHistory.length > 0) {
      const apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
      const apiUrl =
        "https://api.themoviedb.org/3/search/movie?api_key=" +
        apiKey +
        "&query=" +
        searchHistory[searchHistory.length - 1];
      fetchMovies(apiUrl);
    }
    displaySearchHistory();
  
    document.getElementById("btn-search").addEventListener("click", function () {
      var query = document.getElementById("search-input").value.trim();
      var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
      var apiUrl =
        "https://api.themoviedb.org/3/search/movie?api_key=" +
        apiKey +
        "&query=" +
        query;
      fetchMovies(apiUrl);
    });
  
    // Separate function to handle fetching movies
    function fetchMovies(apiUrl) {
      fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var movies = data.results;
          console.log(movies);
          searchResultCard.innerHTML = "";
  
          saveToSearchHistory(
            document.getElementById("search-input").value.trim()
          );
  
          movies.forEach(function (movie) {
            var title = movie.title,
              description = movie.overview,
              poster_path = movie.poster_path;
            var result = document.createElement("div");
            result.classList.add("result");
            result.innerHTML =
              '<div class="card">' +
              '<div class="card-image waves-effect waves-block waves-light">' +
              '<img class="activator" src="https://image.tmdb.org/t/p/w185/' +
              poster_path +
              '" alt="' +
              title +
              ' poster">' +
              "</div>" +
              '<div class="card-content">' +
              '<span class="card-title activator grey-text text-darken-4 movieTitle">' +
              title +
              "</span>" +
              '<i class="material-icons center-align"><a href="#">delete_sweep</a></i>' +
              '<i class="material-icons center-align"><a href="#">queue_play_next</a></i>' +
              "</div>" +
              '<div class="card-reveal">' +
              '<span class="card-title grey-text text-darken-4">' +
              title +
              '<i class="material-icons right">close</i></span>' +
              "<p>" +
              description +
              "</p>" +
              "</div>" +
              "</div>";
            searchResultCard.appendChild(result);
          });
        })
        .catch((error) => {
          console.error("Error fetching movie data:", error);
        });
    }
  
    function saveToSearchHistory(movieTitle) {
      var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
      if (searchHistory.includes(movieTitle)) return; // Si ya existe, salimos de la función.
      searchHistory.push(movieTitle);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      displaySearchHistory();
    }
  
    // Display the search history from local storage as a list of clickable buttons
    function displaySearchHistory() {
      var historyList = document.getElementById("searchHistory");
      historyList.innerHTML = "";
      var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
      for (var i = 0; i < searchHistory.length; i++) {
        (function (movie) {
          var searchButton = document.createElement("li");
          searchButton.textContent = movie;
          searchButton.className = "history-item";
          searchButton.addEventListener("click", function () {
            const apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
            const apiUrl =
              "https://api.themoviedb.org/3/search/movie?api_key=" +
              apiKey +
              "&query=" +
              movie;
            fetchMovies(apiUrl);
          });
          historyList.appendChild(searchButton);
        })(searchHistory[i]);
      }
    }
  
    // Event listener for the form submission with both query and filters
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = queryInput.value.trim();
      var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
  
      // Check if a search query is provided or not
      var apiUrl;
      if (query) {
        apiUrl =
          "https://api.themoviedb.org/3/search/movie?api_key=" +
          apiKey +
          "&query=" +
          query;
      } else {
        apiUrl = "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey;
      }
  
      // Fetch by applied filters
      var genreFilter = document.getElementById("genre-filter").value;
      var ratingFilter = document.getElementById("rating-filter").value;
      var yearFilter = document.getElementById("year-filter").value;
      var languageFilter = document.getElementById("language-filter").value;
  
      if (genreFilter) apiUrl += "&with_genres=" + genreFilter;
      if (ratingFilter) apiUrl += "&vote_average.gte=" + ratingFilter;
      if (yearFilter) apiUrl += "&primary_release_year=" + yearFilter;
      if (languageFilter) apiUrl += "&with_original_language=" + languageFilter;
  
      fetchMovies(apiUrl);
    });
  
    // Function to load movies from local storage
    function loadMoviesFromLocalStorage(listSelector) {
      const storageKey = listSelector.replace(" ", "").replace(".", "");
      const savedMovies = JSON.parse(localStorage.getItem(storageKey) || "[]");
      savedMovies.forEach((movie) => addMovieToList(movie, listSelector));
    }
  
    loadMoviesFromLocalStorage(".bucket ul");
    loadMoviesFromLocalStorage(".queue ul");
  
    // Function to add movie to a specific list
    function addMovieToList(movieTitle, listSelector) {
      var list = document.querySelector(listSelector);
  
      // Check for duplicates
      var listItemExists = Array.from(list.children).some(function (li) {
        return li.textContent === movieTitle;
      });
  
      if (listItemExists) {
        console.log("Movie: " + movieTitle + " already exists in the list.");
        return;
      }
  
      var listItem = document.createElement("li");
      listItem.textContent = movieTitle;
      list.appendChild(listItem);
  
      var storageKey = listSelector.replace(" ", "").replace(".", "");
      var currentList = JSON.parse(localStorage.getItem(storageKey) || "[]");
      currentList.push(movieTitle);
      localStorage.setItem(storageKey, JSON.stringify(currentList));
    }
  
    // Function to handle the click event on the movie icons
    function handleIconClick(event) {
      var target = event.target;
  
      console.log("Clicked on:", target.textContent);
  
      if (target.tagName !== "A") {
        target = target.parentElement;
      }
  
      if (!["delete_sweep", "queue_play_next"].includes(target.textContent))
        return;
  
      var card = target.closest(".card");
      console.log("Parent card:", card);
      if (!card) return;
  
      var titleElement = card.querySelector(".movieTitle");
      console.log("Title element:", titleElement);
      if (!titleElement) return;
  
      var movieTitle = titleElement.textContent;
      console.log("Movie title:", movieTitle);
  
      if (target.textContent === "delete_sweep") {
        addMovieToList(movieTitle, ".bucket ul");
      } else if (target.textContent === "queue_play_next") {
        addMovieToList(movieTitle, ".queue ul");
      }
  
      event.preventDefault();
    }
  
    document.addEventListener("click", handleIconClick);
  
    function clearList(listSelector, storageKey) {
      // Clear the list from the DOM
      document.querySelector(listSelector).innerHTML = "";
  
      // Clear the list from localStorage
      localStorage.setItem(storageKey, JSON.stringify([]));
  
      if (storageKey === "searchHistory") {
        localStorage.removeItem("searchHistory");
      }
    }
  
    // Usage:
    document
      .getElementById("clear-bucket")
      .addEventListener("click", function (event) {
        clearList(".bucket ul", "bucketul");
        event.preventDefault(); // Prevent any default behavior
      });
  
    document
      .getElementById("clear-queue")
      .addEventListener("click", function (event) {
        clearList(".queue ul", "queueul");
        event.preventDefault(); // Prevent any default behavior
      });
  
    document
      .getElementById("clear-result")
      .addEventListener("click", function (event) {
        clearList("#searchHistory", "searchHistory"); // Nota: he cambiado el selector y la clave de almacenamiento aquí
        event.preventDefault(); // Prevent any default behavior
      });
  });