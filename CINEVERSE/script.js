// script.js
const API_KEY = 'eecd57ac4e68e7aaa5dbd19ee2091b7f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';

let currentPage = 1;
let isLoading = false;
const displayedMovieIds = new Set(); // Set to track unique movie IDs

const genreContainer = document.getElementById('genres'); // Container for genres
const main = document.getElementById('main');
const form = document.getElementById('form');
const searchInput = document.getElementById('search');

// Load genres and trending movies on startup
fetchGenres();
getTrendingMovies(); // Fetch weekly trending movies

// Event listener for search form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        searchMovies(searchQuery); // Call the search function
        searchInput.value = ''; // Clear the input after search
    }
});

// Fetch genres
function fetchGenres() {
    const GENRE_URL = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
    
    fetch(GENRE_URL)
        .then(res => res.json())
        .then(data => {
            displayGenres(data.genres);
        })
        .catch(error => console.error('Error fetching genres:', error));
}

// Display genres as buttons, adding Bollywood as a custom genre
function displayGenres(genres) {
    // Add a button for Bollywood genre
    const bollywoodButton = document.createElement('button');
    bollywoodButton.classList.add('genre');
    bollywoodButton.textContent = 'Bollywood';
    bollywoodButton.addEventListener('click', () => {
        main.innerHTML = '';
        displayedMovieIds.clear();
        currentPage = 1;
        getBollywoodMovies(); // Fetch Bollywood movies
    });
    genreContainer.appendChild(bollywoodButton);

    // Display other genres from API
    genres.forEach(genre => {
        const genreEl = document.createElement('button');
        genreEl.classList.add('genre');
        genreEl.textContent = genre.name;
        genreEl.addEventListener('click', () => {
            main.innerHTML = '';
            displayedMovieIds.clear();
            currentPage = 1;
            getMoviesByGenre(genre.id);
        });
        genreContainer.appendChild(genreEl);
    });
}

// Fetch Bollywood movies by filtering for Hindi language
function getBollywoodMovies() {
    isLoading = true;
    const BOLLYWOOD_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&page=${currentPage}`;

    fetch(BOLLYWOOD_URL)
        .then(res => res.json())
        .then(data => {
            showMovies(data.results);
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching Bollywood movies:', error);
            isLoading = false;
        });
}

// Fetch weekly trending movies
function getTrendingMovies() {
    isLoading = true;
    const TRENDING_URL = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

    fetch(TRENDING_URL)
        .then(res => res.json())
        .then(data => {
            showMovies(data.results);
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching trending movies:', error);
            isLoading = false;
        });
}

// Fetch movies by genre
function getMoviesByGenre(genreId) {
    isLoading = true;
    const API_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${currentPage}`;

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            showMovies(data.results);
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching movies by genre:', error);
            isLoading = false;
        });
}

// Function to search movies by query
function searchMovies(query) {
    const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;

    fetch(SEARCH_URL)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            main.innerHTML = ''; // Clear current movies
            displayedMovieIds.clear(); // Reset displayed movies
            showMovies(data.results); // Display search results
        })
        .catch(error => console.error('Error searching movies:', error));
}

// Display movies in the main container
function showMovies(data) {
    data.forEach(movie => {
        if (!displayedMovieIds.has(movie.id)) {
            displayedMovieIds.add(movie.id);

            const { title, poster_path, id } = movie;
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
                <img src="${IMG_URL + poster_path}" alt="${title}">
                <div class="movie-info">
                    <h3>${title}</h3>
                </div>
            `;
            movieEl.addEventListener('click', () => {
                window.location.href = `movie.html?id=${id}`;
            });
            main.appendChild(movieEl);
        }
    });
}


// Infinite scrolling (optional for trending)
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !isLoading) {
        currentPage++;
        getTrendingMovies(); // Load next page of trending movies if available
    }
});

// YM-HUB Home Button functionality
const homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    main.innerHTML = ''; // Clear current movies
    displayedMovieIds.clear(); // Reset displayed movies
    currentPage = 1; // Reset to the first page
    getTrendingMovies(); // Load trending movies on home
});

