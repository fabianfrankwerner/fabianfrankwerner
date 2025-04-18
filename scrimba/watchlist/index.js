let lastSearchResults = [];

const searchForm = document.querySelector("form");
const searchInput = document.getElementById("search");
const key = "a82e8107";

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const query = searchInput.value;
  const moviesContainer = document.querySelector(".movies");
  const mainContent = document.querySelector(".main-content");

  // Show loading state
  mainContent.style.display = "flex";
  moviesContainer.innerHTML = "";

  fetch(`http://www.omdbapi.com/?s=${query}&apikey=${key}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network error occurred!");
      }
    })
    .then((data) => {
      if (data.Response === "False") {
        throw new Error(data.Error);
      } else {
        mainContent.style.display = "none";
        moviesContainer.style.display = "block";
        updateMoviesUI(data.Search);
      }
    })
    .catch((error) => {
      mainContent.style.display = "flex";
      document.getElementById("main-h2").textContent = error.message;
      document.getElementById("main-h2").style.color = `var(--cool-gray)`;
      moviesContainer.style.display = "none";
    });
});

function updateMoviesUI(movies) {
  lastSearchResults = movies; // Store the last search results
  const moviesContainer = document.querySelector(".movies");
  moviesContainer.innerHTML = "";

  const moviesWrapper = document.createElement("div");
  moviesWrapper.className = "movies-wrapper";

  let completedMovies = 0;
  const totalMovies = movies.length;

  movies.forEach((movie) => {
    fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${key}`)
      .then((response) => response.json())
      .then((movieDetails) => {
        const movieElement = createMovieElement(movieDetails);
        moviesWrapper.appendChild(movieElement);
        completedMovies++;

        if (completedMovies < totalMovies) {
          moviesWrapper.appendChild(createDivider());
        }

        if (completedMovies === totalMovies) {
          moviesContainer.appendChild(moviesWrapper);
        }
      });
  });
}

function createMovieElement(movieDetails) {
  const movieDiv = document.createElement("div");
  movieDiv.className = "movie";

  const isWatchlisted = isInWatchlist(movieDetails.imdbID);

  movieDiv.innerHTML = `
        <div class="left">
            <div class="poster-wrapper">
                <img 
                    class="movie-poster" 
                    src="${
                      movieDetails.Poster !== "N/A"
                        ? movieDetails.Poster
                        : "./assets/icons/film.svg"
                    }" 
                    alt="${movieDetails.Title} poster"
                    onerror="this.src='./assets/icons/film.svg'"
                />
            </div>
        </div>
        <div class="right">
            <div class="one">
                <h2 class="movie-title">${movieDetails.Title}</h2>
                <img class="movie-star" src="./assets/icons/star.svg" />
                <p class="movie-rating">${movieDetails.imdbRating}</p>
            </div>
            <div class="two">
                <p class="movie-runtime">${movieDetails.Runtime}</p>
                <p class="movie-genre">${movieDetails.Genre}</p>
                <div class="movie-watchlist-wrapper">
                    <img class="movie-${
                      isWatchlisted ? "minus" : "plus"
                    }" src="./assets/icons/${
    isWatchlisted ? "minus" : "plus"
  }.svg" />
                    <button class="movie-watchlist" data-imdbid="${
                      movieDetails.imdbID
                    }">${isWatchlisted ? "Remove" : "Watchlist"}</button>
                </div>
            </div>
            <div class="three">
                <p class="movie-description">${movieDetails.Plot}</p>
            </div>
        </div>
    `;

  const watchlistBtn = movieDiv.querySelector(".movie-watchlist-wrapper");
  watchlistBtn.addEventListener("click", () => toggleWatchlist(movieDetails));

  return movieDiv;
}

function createDivider() {
  const divider = document.createElement("div");
  divider.className = "divider";
  return divider;
}

function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function isInWatchlist(imdbID) {
  const watchlist = getWatchlist();
  return watchlist.some((movie) => movie.imdbID === imdbID);
}

function toggleWatchlist(movieDetails) {
  const watchlist = getWatchlist();
  const index = watchlist.findIndex(
    (movie) => movie.imdbID === movieDetails.imdbID
  );

  if (index === -1) {
    // Add to watchlist
    watchlist.push(movieDetails);
  } else {
    // Remove from watchlist
    watchlist.splice(index, 1);
  }

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  updateMoviesUI(lastSearchResults); // We'll need to store the last search results
}
