import getMovies from "./getMovies.js";
import getMovie from "./getMovie.js";
import applyTheme from "./theme.js";
import getCharacters from "./getCharacters.js";
import getCharacter from "./getCharacter.js";

const hamburgerBtn = document.querySelector(".hamburgerBtn");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const exitBtn = document.querySelector(".exitBtn");
const themeBtn = document.querySelectorAll(".themeBtn");
const body = document.querySelector("body");
const films = document.querySelector(".films");
const movieDetails = document.querySelector(".movie-detail");
const moviePoster = document.querySelector(".movie-poster");
const movieTitle = document.querySelector(".movie-title");
const movieOverview = document.querySelector(".movie-overview");
const movieRating = document.querySelector(".movie-rating");
const movieRelease = document.querySelector(".movie-release");
const watchMovie = document.querySelector(".watchMovie");
const videoContainer = document.querySelector(".video-container");
const searchForms = document.querySelectorAll(".searchForm");
const searchInputs = document.querySelectorAll(".searchInput");
const searchPopup = document.querySelector(".search-popup");
const navListEls = document.querySelectorAll(".nav-list");
const videoPopup = document.querySelector(".video-popup");
const characters = document.querySelector(".characters");
const characterPoster = document.querySelector(".character-poster");
const characterName = document.querySelector(".character-name");
const characterBirthday = document.querySelector(".character-birthday");
const characterDeathDay = document.querySelector(".character-deathday");
const wishlistAddBtn = document.querySelector(".wishlistAddBtn");
const wishedFilmsContainer = document.querySelector(".wishedFilms-container");
const wishlistMessageDiv = document.querySelector(".wishlist-message");
const characterBiography = document.querySelector(".character-biography")
const genresURL = "https://api.themoviedb.org/3/genre/movie/list";
const genreSelect = document.querySelector("#genre-select");
let popupVideo = document.querySelector("#popupVideo");

let filmID;
let characterID;
const urlParams = new URLSearchParams(window.location.search);
filmID = urlParams.get("id");
let searchID = urlParams.get("search");
characterID = urlParams.get("id");

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// theme functionality

applyTheme();

navListEls.forEach((navItem) => {
  navItem.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      hamburgerMenu.classList.remove("active");
    }
  });
});

themeBtn.forEach((el) => {
  el.addEventListener("click", () => {
    body.classList.add("fade");

    setTimeout(() => {
      let currentTheme = localStorage.getItem("theme") || "dark";

      if (currentTheme === "dark") {
        localStorage.setItem("theme", "light");
      } else {
        localStorage.setItem("theme", "dark");
      }

      applyTheme();
      hamburgerMenu.classList.remove("active");
      body.classList.remove("fade");
    }, 300);
  });
});

// hamburger functionality

hamburgerBtn.addEventListener("click", (e) => {
  hamburgerMenu.classList.add("active");
});
exitBtn.addEventListener("click", (e) => {
  hamburgerMenu.classList.remove("active");
});

// (getting all movies and returning array) functionality

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmNhYTZiZWVjMWI0MzIyYmM2NDZmZWQ1ZTNiN2E3ZCIsIm5iZiI6MTc3MDQ4MDIxNC4zOTMsInN1YiI6IjY5ODc2MjU2NDYzYWNmZDBjNTJjZTM1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2qlYITW6YDjwyK2bgh_Es1krbhP04qRW35am3sAoLBE",
  },
};

const moviesURL = "https://api.themoviedb.org/3/discover/movie?page=";
const searchMoviesURL = "https://api.themoviedb.org/3/search/movie?query=";

function getAllMoviesBySearch(options, searchValue) {
  const data = getMovies(`${searchMoviesURL}${searchValue}`, options);
  return data;
}

function getAllMovies(options) {
  let allMovies = [];
  let slideMovies = [];

  for (let page = 1; page <= 5; page++) {
    const data = getMovies(`${moviesURL}${page}`, options);
    allMovies.push(data);
  }

  const data = getMovies(`${moviesURL}1`, options);
  slideMovies.push(data);

  return [allMovies, slideMovies];
}

if (films) films.innerHTML = "";

function renderMoviesToDetails(movies) {
  if (!movieDetails) return;
  movies.forEach((movie) => {
    if (!movie.poster_path) return;
    const movieID = movie.id;

    const filmLink = document.createElement("a");
    filmLink.href = `./movie.html?id=${movieID}`;

    const filmImage = document.createElement("img");
    filmImage.src = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
    filmImage.alt = movie.title;

    filmLink.append(filmImage);
    movieDetails.append(filmLink);

    filmLink.addEventListener("click", () => {
      filmID = movieID;
    });
  });
}

function loadDefaultMovies() {
  if (!movieDetails) return;
  movieDetails.innerHTML = "";
  getAllMovies(options)[0].forEach((el) => {
    el.then((data) => {
      if (data && data.results) {
        renderMoviesToDetails(data.results);
      }
    });
  });
}

function loadSearchMovies(query) {
  if (!movieDetails) return;
  movieDetails.innerHTML = "";
  getAllMoviesBySearch(options, query).then((data) => {
    const movies = data.results || [];
    if (movies.length === 0) {
      const noResults = document.createElement("div");
      noResults.textContent = "No movies found matching your search.";
      noResults.style.color = "red";
      noResults.style.fontSize = "1.5rem";
      noResults.style.textAlign = "center";
      noResults.style.width = "100%";
      noResults.style.marginTop = "2rem";
      movieDetails.appendChild(noResults);
      return;
    }
    renderMoviesToDetails(movies);
  });
}

// drawing movies on movies.html and index.html

if (window.location.pathname.endsWith("movies.html") || window.location.pathname.endsWith("movies")) {
  if (searchID) {
    searchInputs.forEach((input) => {
      input.value = searchID;
    });
    loadSearchMovies(searchID);
  } else {
    loadDefaultMovies();
  }
}

getAllMovies(options)[1].forEach((el) => {
  el.then((data) => data.results).then((movies) => {
    let filteredMovies = movies;

    if (searchID) {
      filteredMovies = movies.filter((movie) => {
        return (
          movie.title &&
          movie.title.toLowerCase().includes(searchID.toLowerCase())
        );
      });
    }

    filteredMovies.forEach((movie) => {
      const movieID = movie.id;

      const filmLink = document.createElement("a");
      filmLink.href = `./movie.html?id=${movieID}`;

      const filmImage = document.createElement("img");
      filmImage.src = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
      filmImage.alt = movie.title;

      filmLink.append(filmImage);
      if (films && movie.poster_path !== null) films.append(filmLink);

      filmLink.addEventListener("click", () => {
        filmID = movieID;
      });

      if (films && filteredMovies.length > 0) {
        let widthFilm = 300;
        let gap = 10;
        let multiply = 0;
        const totalFilms = films.children.length;

        const visibleFilms = Math.floor(
          films.parentElement.offsetWidth / (widthFilm + gap),
        );

        setInterval(() => {
          multiply++;
          if (multiply > totalFilms - visibleFilms - 1) multiply = 0;
          films.style.transform = `translateX(-${multiply * (widthFilm + gap)}px)`;
          films.style.transition = "transform 0.6s ease";
        }, 2000);
      }
    });
  });
});

// characters functionality

const charactersURL = "https://api.themoviedb.org/3/person/popular";

function getAllCharacters(options) {
  let allCharacters = [];

  for (let page = 1; page <= 1; page++) {
    const data = getCharacters(charactersURL, options);
    allCharacters.push(data);
  }
  return allCharacters;
}
if (
  window.location.pathname === "/" ||
  window.location.pathname === "/index.html"
) {
  getAllCharacters(options).forEach((el) => {
    el.then((data) => data.results).then((charactersData) => {
      charactersData.forEach((character) => {
        const characterId = character.id;

        const characterLink = document.createElement("a");
        characterLink.href = `./character.html?id=${characterId}`;

        const characterImage = document.createElement("img");
        characterImage.src = `https://image.tmdb.org/t/p/w342${character.profile_path}`;
        characterImage.alt = character.name;

        characterLink.append(characterImage);
        if (characters && character.profile_path !== null)
          characters.append(characterLink);

        characterLink.addEventListener("click", () => {
          characterID = characterId;
        });

        if (characters && characters.children.length) {
          let widthCharacter = 300;
          let gap = 10;
          let multiply = 0;
          const totalCharacters = characters.children.length;

          const visibleCharacters = Math.floor(
            characters.parentElement.offsetWidth / (widthCharacter + gap),
          );

          setInterval(() => {
            multiply++;
            if (multiply > totalCharacters - visibleCharacters - 1)
              multiply = 0;
            characters.style.transform = `translateX(-${multiply * (widthCharacter + gap)}px)`;
            characters.style.transition = "transform 0.6s ease";
          }, 2000);
        }
      });
    });
  });
}

if (window.location.pathname.endsWith("character.html")) {
  if (characterID !== null) {
    getCharacter(characterID).then((character) => {
      console.log(character);

      characterPoster.src = `https://image.tmdb.org/t/p/w342${character.profile_path}`;
      characterName.textContent = character.name;
      characterBirthday.textContent = `Birth date - ${character.birthday}`;
      if (character.deathday !== null) {
        characterDeathDay.textContent = `Death Date - ${character.deathday}`;
      }
      characterBiography.textContent = character.biography
    });
  }
}
// drawing movie details and trailer

if (window.location.pathname.endsWith("movie.html")) {
  if (filmID !== null) {
    getMovie(filmID).then((movie) => {
      moviePoster.src = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
      movieTitle.textContent = movie.title;
      movieOverview.textContent = movie.overview;
      // movieRating.textContent = `Rating: ${Math.floor(movie.vote_average)} out of 10`;
      let step = 0;
      let move = movie.vote_average * 10;

      const id = setInterval(() => {
        if (step < move) {
          step++;
        } else {
          clearInterval(id);
        }

        if (step < 50) {
          movieRating.style.backgroundImage = `conic-gradient(red 0% ${step}% , gray ${step}%)`;
          movieRating.style.border = "1px solid red"
        }

        if (step < 75 && step > 50) {
          movieRating.style.backgroundImage = `conic-gradient(yellow 0% ${step}% , gray ${step}%)`;
          movieRating.style.border = "1px solid yellow"
        }

        if (step > 75) {
          movieRating.style.backgroundImage = `conic-gradient(green 0% ${step}% , gray ${step}%)`;
          movieRating.style.border = "1px solid green"
        }
      }, 10);
      movieRelease.textContent = `Release: ${movie.release_date}`;
      document.getElementById("round").innerHTML =
        parseInt(movie.vote_average * 10) + "<sup>%</sup>";

      //wishlist adding button functionality

      wishlistAddBtn.addEventListener("click", () => {
        const wishlist = getWishlist();

        const movieData = {
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path,
        };

        const alreadyExists = wishlist.some((item) => item.id === movie.id);

        if (alreadyExists) {
          wishlistMessageDiv.textContent = "Movie is already in wishlist";
          wishlistMessageDiv.style.color = "orange";
        } else {
          wishlist.push(movieData);
          saveWishlist(wishlist);

          wishlistMessageDiv.textContent = "Added to wishlist";
          wishlistMessageDiv.style.color = "green";
        }

        wishlistMessageDiv.style.opacity = "1";

        setTimeout(() => {
          wishlistMessageDiv.style.opacity = "0";
        }, 2000);
      });
    });
  }

  if (filmID !== null) {
    watchMovie.addEventListener("click", (e) => {
      e.preventDefault();
      popupVideo.src = `https://vidsrc.sbs/embed/movie/${filmID}`;
      videoPopup.style.display = "flex";
    });

    videoContainer.addEventListener("click", (e) => {
      e.preventDefault();
      videoPopup.style.display = "none";
      popupVideo.src = "";
    });
  }

  videoPopup.addEventListener("click", (e) => {
    if (!document.querySelector(".video-container").contains(e.target)) {
      videoPopup.style.display = "none";
      popupVideo.src = "";
    }
  });
}
// search functionality

searchForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInputField = form.querySelector(".searchInput");
    const search = searchInputField.value.trim();
    if (!search) return;

    hamburgerMenu.classList.remove("active");

    window.location.href = `./movies.html?search=${encodeURIComponent(search)}`;
  });
});

let searchDebounceTimeout;

function changeFilmsAsSearch(value = "") {
  if (!movieDetails) return;

  clearTimeout(searchDebounceTimeout);

  if (value && value.trim() !== "") {
    searchDebounceTimeout = setTimeout(() => {
      loadSearchMovies(value);
    }, 300);
  } else {
    loadDefaultMovies();
  }
}



function updateSearchPopup(value = "") {
  if (window.innerWidth <= 1092) return;
  if (!searchPopup) return;

  searchPopup.innerHTML = "";

  if (!value.trim()) {
    searchPopup.style.display = "none";
    return;
  }

  searchPopup.style.display = "block";

  getAllMoviesBySearch(options, value).then((res) => {
    const filmsData = res.results;

    const filtered = filmsData.filter(
      (movie) =>
        movie.title &&
        movie.title.toLowerCase().includes(value.toLowerCase())
    );

    filtered.forEach((movie) => {
      if (!movie.poster_path) return;

      const link = document.createElement("a");
      link.href = `./movie.html?id=${movie.id}`;

      const img = document.createElement("img");
      img.src = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
      img.alt = movie.title;

      const span = document.createElement("span");
      span.textContent = movie.title;

      link.appendChild(img);
      link.appendChild(span);

      searchPopup.appendChild(link);
    });
  });
}


searchInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    const searchValue = e.target.value;

    // Sync all search inputs
    searchInputs.forEach((otherInput) => {
      if (otherInput !== input) {
        otherInput.value = searchValue;
      }
    });

    if (genreSelect) genreSelect.value = "";

    changeFilmsAsSearch(searchValue);
    updateSearchPopup(searchValue);
  });

  input.addEventListener("focus", () => {
    if (window.innerWidth <= 1092) return;
    if (input.value.trim() !== "") {
      searchPopup.style.display = "block";
    }
  });
});

document.addEventListener("click", (e) => {
  if (window.innerWidth <= 1092 || !searchPopup || !searchInputs.length) return;

  const isClickInsideInput = Array.from(searchInputs).some((input) => input.contains(e.target));
  if (!searchPopup.contains(e.target) && !isClickInsideInput) {
    searchPopup.style.display = "none";
  }
});

// rendering whishlist

function renderWishlist() {
  if (!wishedFilmsContainer) return;

  wishedFilmsContainer.innerHTML = "";
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty-wishlist");
    emptyDiv.style.color = "red";
    emptyDiv.textContent = "There are no wishlisted films";

    wishedFilmsContainer.appendChild(emptyDiv);
    return;
  }

  wishlist.forEach((movie) => {
    const div = document.createElement("div");

    const link = document.createElement("a");
    link.href = `./movie.html?id=${movie.id}`;

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w342${movie.poster}`;
    img.alt = movie.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove From Wishlist";

    deleteBtn.addEventListener("click", () => {
      const updatedWishlist = wishlist.filter((item) => item.id !== movie.id);

      saveWishlist(updatedWishlist);
      renderWishlist();
    });

    link.appendChild(img);
    div.append(link);
    div.append(deleteBtn);
    wishedFilmsContainer.appendChild(div);
  });
}

renderWishlist();

// genre functionality

async function fetchGenres() {
  if (!genreSelect) return;
  try {
    const res = await fetch(`${genresURL}`, options);
    const data = await res.json();
    const genres = data.genres;
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Genres";
    genreSelect.appendChild(allOption);
    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching genres:", err);
  }
}

fetchGenres();

function fetchMoviesByGenre(genreId) {
  if (!genreId || genreId === "all") {
    const allMoviesPromises = getAllMovies(options)[0];
    return Promise.all(allMoviesPromises).then((resolvedMovies) => {
      let allMovies = [];
      resolvedMovies.forEach((data) => {
        allMovies = allMovies.concat(data.results);
      });
      return allMovies;
    });
  }
  const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=1`;
  return getMovies(url, options)
    .then((moviesData) => {
      return moviesData.results || [];
    })
    .catch((err) => {
      console.error("Error fetching movies by genre:", err);
      return [];
    });
}

if (genreSelect) {
  genreSelect.addEventListener("change", (e) => {
    const genreId = e.target.value;

    fetchMoviesByGenre(genreId).then((movies) => {
      if (movieDetails) movieDetails.innerHTML = "";

      movies.forEach((movie) => {
        const filmLink = document.createElement("a");
        filmLink.href = `./movie.html?id=${movie.id}`;

        const filmImage = document.createElement("img");
        filmImage.src = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
        filmImage.alt = movie.title;

        filmLink.appendChild(filmImage);
        movieDetails.appendChild(filmLink);
      });
    });
  });
}
