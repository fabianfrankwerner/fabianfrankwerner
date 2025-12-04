function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function removeFromWatchlist(imdbID) {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.filter((movie) => movie.imdbID !== imdbID);
  localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  displayWatchlist();
}

function createMovieElement(movieDetails) {
  const movieDiv = document.createElement("div");
  movieDiv.className = "movie";

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
                    <img class="movie-minus" src="./assets/icons/minus.svg" />
                    <button class="movie-watchlist" data-imdbid="${
                      movieDetails.imdbID
                    }">Remove</button>
                </div>
            </div>
            <div class="three">
                <p class="movie-description">${movieDetails.Plot}</p>
            </div>
        </div>
    `;

  const watchlistBtn = movieDiv.querySelector(".movie-watchlist-wrapper");
  watchlistBtn.addEventListener("click", () =>
    removeFromWatchlist(movieDetails.imdbID)
  );

  return movieDiv;
}

function createDivider() {
  const divider = document.createElement("div");
  divider.className = "divider";
  return divider;
}

function displayWatchlist() {
  const watchlist = getWatchlist();
  const moviesContainer = document.querySelector(".movies");
  const mainContent = document.querySelector(".main-content");

  // Clear existing content
  moviesContainer.innerHTML = "";

  if (watchlist.length === 0) {
    mainContent.style.display = "flex";
    moviesContainer.style.display = "none";
    return;
  }

  // Create wrapper for movies
  const moviesWrapper = document.createElement("div");
  moviesWrapper.className = "movies-wrapper";

  // Hide the main content and show movies container
  mainContent.style.display = "none";
  moviesContainer.style.display = "block";

  // Add each movie to the wrapper
  watchlist.forEach((movie, index) => {
    const movieElement = createMovieElement(movie);
    moviesWrapper.appendChild(movieElement);

    // Add divider if not the last movie
    if (index < watchlist.length - 1) {
      moviesWrapper.appendChild(createDivider());
    }
  });

  // Add the wrapper to the container
  moviesContainer.appendChild(moviesWrapper);
}

// Initialize the watchlist display when the page loads
document.addEventListener("DOMContentLoaded", displayWatchlist);
