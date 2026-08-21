import getMovies from "./getMovies.js";
import getMovie from "./getMovie.js";
import applyTheme from "./theme.js";
import getCharacters from "./getCharacters.js";
import getCharacter from "./getCharacter.js";
import getTV from "./getTV.js";
import getTVSeason from "./getTVSeason.js";
import getTVs from "./getTVs.js";

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
const characterBiography = document.querySelector(".character-biography");
const genresURL = "https://api.themoviedb.org/3/genre/movie/list";
const genreSelect = document.querySelector("#genre-select");
let popupVideo = document.querySelector("#popupVideo");

// TV Show elements
const tvPoster = document.querySelector(".tv-poster");
const tvTitle = document.querySelector(".tv-title");
const tvTagline = document.querySelector(".tv-tagline");
const tvOverview = document.querySelector(".tv-overview");
const tvRating = document.querySelector(".tv-rating");
const tvRelease = document.querySelector(".tv-release");
const tvEpisodesInfo = document.querySelector(".tv-episodes-info");
const watchTvShow = document.querySelector(".watchTvShow");
const tvWishlistBtn = document.querySelector(".tvWishlistBtn");
const seasonsTabs = document.querySelector("#seasonsTabs");
const episodesGrid = document.querySelector("#episodesGrid");
const activeEpisodeIndicator = document.querySelector("#activeEpisodeIndicator");
const currentSeasonTitle = document.querySelector("#currentSeasonTitle");

let filmID;
let characterID;
let tvID;
const urlParams = new URLSearchParams(window.location.search);
filmID = urlParams.get("id");
tvID = urlParams.get("id");
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

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", (e) => {
    hamburgerMenu.classList.add("active");
  });
}
if (exitBtn) {
  exitBtn.addEventListener("click", (e) => {
    hamburgerMenu.classList.remove("active");
  });
}

// options & search URLs

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
const searchTvURL = "https://api.themoviedb.org/3/search/tv?query=";

function getAllMediaBySearch(options, searchValue) {
  const encodedQuery = encodeURIComponent(searchValue);
  const moviePromise = getMovies(`${searchMoviesURL}${encodedQuery}`, options);
  const tvPromise = getTVs(`${searchTvURL}${encodedQuery}`, options);

  return Promise.all([moviePromise, tvPromise]).then(([movieRes, tvRes]) => {
    const movies = (movieRes.results || []).map((m) => ({ ...m, media_type: "movie" }));
    const tvs = (tvRes.results || []).map((t) => ({ ...t, media_type: "tv" }));

    // Interleave or combine results nicely
    const combined = [];
    const maxLen = Math.max(movies.length, tvs.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < movies.length) combined.push(movies[i]);
      if (i < tvs.length) combined.push(tvs[i]);
    }
    return combined;
  });
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

function renderMoviesToDetails(items) {
  if (!movieDetails) return;
  items.forEach((item) => {
    if (!item.poster_path) return;
    const isTV = item.media_type === "tv" || (item.name && !item.title);
    const itemID = item.id;
    const itemTitle = item.title || item.name;

    const cardLink = document.createElement("a");
    cardLink.href = isTV ? `./tv.html?id=${itemID}` : `./movie.html?id=${itemID}`;
    cardLink.style.position = "relative";

    const filmImage = document.createElement("img");
    filmImage.src = `https://image.tmdb.org/t/p/w342${item.poster_path}`;
    filmImage.alt = itemTitle;

    const badge = document.createElement("span");
    badge.classList.add("card-media-type");
    badge.textContent = isTV ? "TV SHOW" : "MOVIE";

    cardLink.append(filmImage);
    cardLink.append(badge);
    movieDetails.append(cardLink);
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
  getAllMediaBySearch(options, query).then((items) => {
    if (items.length === 0) {
      const noResults = document.createElement("div");
      noResults.textContent = "No movies or TV shows found matching your search.";
      noResults.style.color = "red";
      noResults.style.fontSize = "1.5rem";
      noResults.style.textAlign = "center";
      noResults.style.width = "100%";
      noResults.style.marginTop = "2rem";
      movieDetails.appendChild(noResults);
      return;
    }
    renderMoviesToDetails(items);
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

if (films) {
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
}

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
  window.location.pathname === "/index.html" ||
  window.location.pathname.endsWith("index.html")
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
      if (characterPoster) characterPoster.src = `https://image.tmdb.org/t/p/w342${character.profile_path}`;
      if (characterName) characterName.textContent = character.name;
      if (characterBirthday) characterBirthday.textContent = `Birth date - ${character.birthday}`;
      if (characterDeathDay && character.deathday !== null) {
        characterDeathDay.textContent = `Death Date - ${character.deathday}`;
      }
      if (characterBiography) characterBiography.textContent = character.biography;
    });
  }
}

// drawing movie details and trailer

if (window.location.pathname.endsWith("movie.html")) {
  if (filmID !== null) {
    getMovie(filmID).then((movie) => {
      if (moviePoster) moviePoster.src = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
      if (movieTitle) movieTitle.textContent = movie.title;
      if (movieOverview) movieOverview.textContent = movie.overview;
      let step = 0;
      let move = (movie.vote_average || 0) * 10;

      const id = setInterval(() => {
        if (step < move) {
          step++;
        } else {
          clearInterval(id);
        }

        if (movieRating) {
          if (step < 50) {
            movieRating.style.backgroundImage = `conic-gradient(red 0% ${step}% , gray ${step}%)`;
            movieRating.style.border = "1px solid red";
          } else if (step < 75) {
            movieRating.style.backgroundImage = `conic-gradient(yellow 0% ${step}% , gray ${step}%)`;
            movieRating.style.border = "1px solid yellow";
          } else {
            movieRating.style.backgroundImage = `conic-gradient(green 0% ${step}% , gray ${step}%)`;
            movieRating.style.border = "1px solid green";
          }
        }
      }, 10);
      if (movieRelease) movieRelease.textContent = `Release: ${movie.release_date}`;
      const roundEl = document.getElementById("round");
      if (roundEl) roundEl.innerHTML = parseInt((movie.vote_average || 0) * 10) + "<sup>%</sup>";

      // wishlist adding button functionality
      if (wishlistAddBtn) {
        wishlistAddBtn.addEventListener("click", () => {
          const wishlist = getWishlist();

          const movieData = {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            media_type: "movie",
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
      }
    });
  }

  if (filmID !== null && watchMovie) {
    watchMovie.addEventListener("click", (e) => {
      e.preventDefault();
      if (popupVideo) popupVideo.src = `https://player.vidlove.cc/embed/movie/${filmID}`;
      if (videoPopup) videoPopup.style.display = "flex";
    });
  }
}

// TV SHOW PAGE FUNCTIONALITY (tv.html)

if (window.location.pathname.endsWith("tv.html") || window.location.pathname.endsWith("tv")) {
  if (tvID !== null) {
    let activeSeasonNum = 1;
    let activeEpisodeNum = 1;

    getTV(tvID).then((tv) => {
      if (!tv || !tv.name) return;

      if (tvPoster) tvPoster.src = `https://image.tmdb.org/t/p/w342${tv.poster_path}`;
      if (tvTitle) tvTitle.textContent = tv.name;
      if (tvTagline) tvTagline.textContent = tv.tagline ? `"${tv.tagline}"` : "";
      if (tvOverview) tvOverview.textContent = tv.overview;
      if (tvRelease) tvRelease.textContent = `First Air Date: ${tv.first_air_date || "N/A"}`;
      if (tvEpisodesInfo) {
        tvEpisodesInfo.textContent = `Total Seasons: ${tv.number_of_seasons || 0} | Total Episodes: ${tv.number_of_episodes || 0}`;
      }

      // Rating animation
      let step = 0;
      let move = (tv.vote_average || 0) * 10;
      const id = setInterval(() => {
        if (step < move) {
          step++;
        } else {
          clearInterval(id);
        }

        if (tvRating) {
          if (step < 50) {
            tvRating.style.backgroundImage = `conic-gradient(red 0% ${step}% , gray ${step}%)`;
            tvRating.style.border = "1px solid red";
          } else if (step < 75) {
            tvRating.style.backgroundImage = `conic-gradient(yellow 0% ${step}% , gray ${step}%)`;
            tvRating.style.border = "1px solid yellow";
          } else {
            tvRating.style.backgroundImage = `conic-gradient(green 0% ${step}% , gray ${step}%)`;
            tvRating.style.border = "1px solid green";
          }
        }
      }, 10);

      const roundEl = document.getElementById("round");
      if (roundEl) roundEl.innerHTML = parseInt((tv.vote_average || 0) * 10) + "<sup>%</sup>";

      // Wishlist functionality for TV show
      if (tvWishlistBtn) {
        tvWishlistBtn.addEventListener("click", () => {
          const wishlist = getWishlist();
          const tvData = {
            id: tv.id,
            title: tv.name,
            poster: tv.poster_path,
            media_type: "tv",
          };

          const alreadyExists = wishlist.some((item) => item.id === tv.id);

          if (alreadyExists) {
            wishlistMessageDiv.textContent = "TV Show is already in wishlist";
            wishlistMessageDiv.style.color = "orange";
          } else {
            wishlist.push(tvData);
            saveWishlist(wishlist);
            wishlistMessageDiv.textContent = "Added to wishlist";
            wishlistMessageDiv.style.color = "green";
          }

          wishlistMessageDiv.style.opacity = "1";
          setTimeout(() => {
            wishlistMessageDiv.style.opacity = "0";
          }, 2000);
        });
      }

      // Render Season Tabs
      if (seasonsTabs && tv.seasons && tv.seasons.length > 0) {
        seasonsTabs.innerHTML = "";

        // Filter valid seasons (prefer regular seasons >= 1, but if none available show season 0)
        const validSeasons = tv.seasons.filter((s) => s.season_number > 0);
        const seasonsToDisplay = validSeasons.length > 0 ? validSeasons : tv.seasons;

        if (seasonsToDisplay.length > 0) {
          activeSeasonNum = seasonsToDisplay[0].season_number;
        }

        seasonsToDisplay.forEach((season, index) => {
          const btn = document.createElement("button");
          btn.classList.add("season-btn");
          if (season.season_number === activeSeasonNum) {
            btn.classList.add("active");
          }
          btn.textContent = season.name || `Season ${season.season_number}`;

          btn.addEventListener("click", () => {
            seasonsTabs.querySelectorAll(".season-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            activeSeasonNum = season.season_number;
            activeEpisodeNum = 1;
            loadSeasonEpisodes(tvID, activeSeasonNum, tv.poster_path);
          });

          seasonsTabs.appendChild(btn);
        });

        // Load first season episodes
        loadSeasonEpisodes(tvID, activeSeasonNum, tv.poster_path);
      }

      // Main Watch Show Button
      if (watchTvShow) {
        watchTvShow.addEventListener("click", (e) => {
          e.preventDefault();
          playTvVideo(tvID, activeSeasonNum, activeEpisodeNum);
        });
      }
    });
  }
}

function loadSeasonEpisodes(tvShowID, seasonNumber, showPoster) {
  if (!episodesGrid) return;
  episodesGrid.innerHTML = "<p style='color: #228ee5; font-size: 1.2rem;'>Loading episodes...</p>";

  if (currentSeasonTitle) {
    currentSeasonTitle.textContent = `Season ${seasonNumber} Episodes`;
  }

  getTVSeason(tvShowID, seasonNumber)
    .then((seasonData) => {
      episodesGrid.innerHTML = "";
      const episodes = seasonData.episodes || [];

      if (episodes.length === 0) {
        episodesGrid.innerHTML = "<p style='color: orange;'>No episodes found for this season.</p>";
        return;
      }

      episodes.forEach((ep) => {
        const card = document.createElement("div");
        card.classList.add("episode-card");
        if (ep.episode_number === 1) {
          card.classList.add("active-episode");
        }

        const stillSrc = ep.still_path
          ? `https://image.tmdb.org/t/p/w342${ep.still_path}`
          : showPoster
          ? `https://image.tmdb.org/t/p/w342${showPoster}`
          : "./Images/logo.png";

        card.innerHTML = `
          <div class="episode-img-wrapper">
            <img src="${stillSrc}" alt="${ep.name}" />
            <span class="episode-badge">E${ep.episode_number}</span>
            <div class="play-overlay">
              <i class="bi bi-play-circle-fill"></i>
            </div>
          </div>
          <div class="episode-info">
            <h4 class="episode-title">${ep.episode_number}. ${ep.name}</h4>
            <div class="episode-meta">
              <span><i class="bi bi-calendar"></i> ${ep.air_date || "N/A"}</span>
              ${ep.runtime ? `<span style="margin-left: 10px;"><i class="bi bi-clock"></i> ${ep.runtime} min</span>` : ""}
            </div>
            <p class="episode-overview">${ep.overview || "No description available for this episode."}</p>
            <button class="episode-watch-btn">
              <i class="bi bi-play-fill"></i> Watch Episode ${ep.episode_number}
            </button>
          </div>
        `;

        card.addEventListener("click", () => {
          episodesGrid.querySelectorAll(".episode-card").forEach((c) => c.classList.remove("active-episode"));
          card.classList.add("active-episode");

          if (activeEpisodeIndicator) {
            activeEpisodeIndicator.textContent = `Selected: Season ${seasonNumber}, Episode ${ep.episode_number}`;
          }

          playTvVideo(tvShowID, seasonNumber, ep.episode_number);
        });

        episodesGrid.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error loading season episodes:", err);
      episodesGrid.innerHTML = "<p style='color: red;'>Failed to load episodes.</p>";
    });
}

function playTvVideo(tmdbID, season, episode) {
  if (!popupVideo || !videoPopup) return;
  const embedURL = `https://player.vidlove.cc/embed/tv/${tmdbID}/${season}/${episode}?primarycolor=0084ff&secondarycolor=002570`;
  popupVideo.src = embedURL;
  videoPopup.style.display = "flex";
}

// Modal video close handlers
if (videoContainer) {
  videoContainer.addEventListener("click", (e) => {
    e.preventDefault();
    if (videoPopup) videoPopup.style.display = "none";
    if (popupVideo) popupVideo.src = "";
  });
}

if (videoPopup) {
  videoPopup.addEventListener("click", (e) => {
    if (!document.querySelector(".video-container").contains(e.target)) {
      videoPopup.style.display = "none";
      if (popupVideo) popupVideo.src = "";
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

    if (hamburgerMenu) hamburgerMenu.classList.remove("active");

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

  getAllMediaBySearch(options, value).then((items) => {
    const filtered = items.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(value.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(value.toLowerCase()))
    );

    filtered.forEach((item) => {
      if (!item.poster_path) return;
      const isTV = item.media_type === "tv" || (item.name && !item.title);
      const titleText = item.title || item.name;

      const link = document.createElement("a");
      link.href = isTV ? `./tv.html?id=${item.id}` : `./movie.html?id=${item.id}`;

      const img = document.createElement("img");
      img.src = `https://image.tmdb.org/t/p/w342${item.poster_path}`;
      img.alt = titleText;

      const span = document.createElement("span");
      span.textContent = `${titleText} ${isTV ? "(TV Show)" : "(Movie)"}`;

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

    if (genreSelect) {
      genreSelect.querySelectorAll(".genre-pill").forEach((pill) => {
        if (pill.dataset.value === "all") {
          pill.classList.add("active");
        } else {
          pill.classList.remove("active");
        }
      });
    }

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

// rendering wishlist

function renderWishlist() {
  if (!wishedFilmsContainer) return;

  wishedFilmsContainer.innerHTML = "";
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty-wishlist");
    emptyDiv.style.color = "red";
    emptyDiv.textContent = "There are no wishlisted items";

    wishedFilmsContainer.appendChild(emptyDiv);
    return;
  }

  wishlist.forEach((item) => {
    const div = document.createElement("div");

    const link = document.createElement("a");
    const isTV = item.media_type === "tv";
    link.href = isTV ? `./tv.html?id=${item.id}` : `./movie.html?id=${item.id}`;

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w342${item.poster}`;
    img.alt = item.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove From Wishlist";

    deleteBtn.addEventListener("click", () => {
      const updatedWishlist = wishlist.filter((w) => w.id !== item.id);

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

    genreSelect.innerHTML = "";

    const allPill = document.createElement("button");
    allPill.classList.add("genre-pill", "active");
    allPill.dataset.value = "all";
    allPill.textContent = "All Genres";
    genreSelect.appendChild(allPill);

    genres.forEach((genre) => {
      const pill = document.createElement("button");
      pill.classList.add("genre-pill");
      pill.dataset.value = genre.id;
      pill.textContent = genre.name;
      genreSelect.appendChild(pill);
    });

    genreSelect.querySelectorAll(".genre-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        genreSelect.querySelectorAll(".genre-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        const genreId = pill.dataset.value;
        handleGenreSelection(genreId);
      });
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

function handleGenreSelection(genreId) {
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
}

// TV SHOWS PAGE (tvshows.html) - 100 POPULAR TV SHOWS & GENRE FILTERS

const tvGenreSelect = document.querySelector("#tv-genre-select");
const tvGenresURL = "https://api.themoviedb.org/3/genre/tv/list";
const popularTVURL = "https://api.themoviedb.org/3/tv/popular?page=";

function getAllPopularTVShows(options) {
  let tvPromises = [];
  for (let page = 1; page <= 5; page++) {
    tvPromises.push(getTVs(`${popularTVURL}${page}`, options));
  }
  return Promise.all(tvPromises).then((results) => {
    let allShows = [];
    results.forEach((res) => {
      if (res && res.results) {
        allShows = allShows.concat(res.results);
      }
    });
    return allShows; // 100 TV shows (5 pages x 20)
  });
}

function loadDefaultTVShows() {
  if (!movieDetails || (!window.location.pathname.endsWith("tvshows.html") && !window.location.pathname.endsWith("tvshows"))) return;
  movieDetails.innerHTML = "";
  getAllPopularTVShows(options).then((shows) => {
    renderMoviesToDetails(shows.map((s) => ({ ...s, media_type: "tv" })));
  });
}

function loadSearchTVShows(query) {
  if (!movieDetails || (!window.location.pathname.endsWith("tvshows.html") && !window.location.pathname.endsWith("tvshows"))) return;
  movieDetails.innerHTML = "";
  const encodedQuery = encodeURIComponent(query);
  getTVs(`https://api.themoviedb.org/3/search/tv?query=${encodedQuery}`, options).then((data) => {
    const shows = data.results || [];
    if (shows.length === 0) {
      const noResults = document.createElement("div");
      noResults.textContent = "No TV shows found matching your search.";
      noResults.style.color = "red";
      noResults.style.fontSize = "1.5rem";
      noResults.style.textAlign = "center";
      noResults.style.width = "100%";
      noResults.style.marginTop = "2rem";
      movieDetails.appendChild(noResults);
      return;
    }
    renderMoviesToDetails(shows.map((s) => ({ ...s, media_type: "tv" })));
  });
}

if (window.location.pathname.endsWith("tvshows.html") || window.location.pathname.endsWith("tvshows")) {
  if (searchID) {
    searchInputs.forEach((input) => {
      input.value = searchID;
    });
    loadSearchTVShows(searchID);
  } else {
    loadDefaultTVShows();
  }
}

async function fetchTVGenres() {
  if (!tvGenreSelect) return;
  try {
    const res = await fetch(`${tvGenresURL}`, options);
    const data = await res.json();
    const genres = data.genres;

    tvGenreSelect.innerHTML = "";

    const allPill = document.createElement("button");
    allPill.classList.add("genre-pill", "active");
    allPill.dataset.value = "all";
    allPill.textContent = "All Genres";
    tvGenreSelect.appendChild(allPill);

    genres.forEach((genre) => {
      const pill = document.createElement("button");
      pill.classList.add("genre-pill");
      pill.dataset.value = genre.id;
      pill.textContent = genre.name;
      tvGenreSelect.appendChild(pill);
    });

    tvGenreSelect.querySelectorAll(".genre-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        tvGenreSelect.querySelectorAll(".genre-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        const genreId = pill.dataset.value;
        handleTVGenreSelection(genreId);
      });
    });
  } catch (err) {
    console.error("Error fetching TV genres:", err);
  }
}

fetchTVGenres();

function fetchTVShowsByGenre(genreId) {
  if (!genreId || genreId === "all") {
    return getAllPopularTVShows(options);
  }
  let pagePromises = [];
  for (let page = 1; page <= 5; page++) {
    const url = `https://api.themoviedb.org/3/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;
    pagePromises.push(getTVs(url, options));
  }
  return Promise.all(pagePromises)
    .then((results) => {
      let shows = [];
      results.forEach((res) => {
        if (res && res.results) {
          shows = shows.concat(res.results);
        }
      });
      return shows;
    })
    .catch((err) => {
      console.error("Error fetching TV shows by genre:", err);
      return [];
    });
}

function handleTVGenreSelection(genreId) {
  fetchTVShowsByGenre(genreId).then((shows) => {
    if (movieDetails) movieDetails.innerHTML = "";
    renderMoviesToDetails(shows.map((s) => ({ ...s, media_type: "tv" })));
  });
}


