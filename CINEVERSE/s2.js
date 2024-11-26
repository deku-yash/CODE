const API_KEY = 'eecd57ac4e68e7aaa5dbd19ee2091b7f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';

let isLoading = false; // Initialize as false
let currentPage = 1; // Initialize as 1 to track pagination

const movieDetails = document.getElementById('movie-details');

// Get the movie ID from the URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

// Fetch and display movie details
if (movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=YOUR_API_KEY`)
        .then(response => response.json()) 
        .then(data => console.log(data)) 
        .catch(error => console.error('Error fetching movie videos:', error));
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => renderMovieDetails(data))
        .catch(error => console.error('Error fetching movie details:', error));

    fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => renderWatchProviders(data.results))
        .catch(error => console.error('Error fetching watch providers:', error));
}

// Render the movie details on the page
function renderMovieDetails(movie) {
    const { title, poster_path, overview, vote_average, runtime, release_date, genres } = movie;

    movieDetails.innerHTML = `
        <div class="movie-detail">
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h1>${title}</h1>
                <p>${overview}</p>
                <p><strong>Rating:</strong> ${vote_average} ⭐</p>
                <p><strong>Runtime:</strong> ${runtime} minutes</p>
                <p><strong>Release Date:</strong> ${release_date}</p>
                <p><strong>Genres:</strong> ${genres.map(genre => genre.name).join(', ')}</p>
                <div id="watch-providers">
                    <h2>Available On:</h2>
                    <p>Loading platforms...</p>
                </div>
            </div>
        </div>
    `;
}

// Render watch providers (platforms)
function renderWatchProviders(results) {
    const country = 'US'; // Change this to dynamically detect user region if needed
    const providers = results[country];

    const watchProvidersContainer = document.getElementById('watch-providers');
    if (!providers) {
        watchProvidersContainer.innerHTML = `<p>No platform information available for this region.</p>`;
        return;
    }

    let platformsHTML = '';

    // Free streaming platforms
    if (providers.adsupported) {
        platformsHTML += `<h3>Free Streaming:</h3><ul>`;
        providers.adsupported.forEach(platform => {
            platformsHTML += `<li>
                <a href="${providers.link}" target="_blank">
                    <img src="${IMG_URL + platform.logo_path}" alt="${platform.provider_name}" title="${platform.provider_name}">
                </a>
            </li>`;
        });
        platformsHTML += `</ul>`;
    }

    // Streaming platforms
    if (providers.flatrate) {
        platformsHTML += `<h3>Streaming:</h3><ul>`;
        providers.flatrate.forEach(platform => {
            platformsHTML += `<li>
                <a href="${providers.link}" target="_blank">
                    <img src="${IMG_URL + platform.logo_path}" alt="${platform.provider_name}" title="${platform.provider_name}">
                </a>
            </li>`;
        });
        platformsHTML += `</ul>`;
    }

    // Rent platforms
    if (providers.rent) {
        platformsHTML += `<h3>Rent:</h3><ul>`;
        providers.rent.forEach(platform => {
            platformsHTML += `<li>
                <a href="${providers.link}" target="_blank">
                    <img src="${IMG_URL + platform.logo_path}" alt="${platform.provider_name}" title="${platform.provider_name}">
                </a>
            </li>`;
        });
        platformsHTML += `</ul>`;
    }

    // Buy platforms
    if (providers.buy) {
        platformsHTML += `<h3>Buy:</h3><ul>`;
        providers.buy.forEach(platform => {
            platformsHTML += `<li>
                <a href="${providers.link}" target="_blank">
                    <img src="${IMG_URL + platform.logo_path}" alt="${platform.provider_name}" title="${platform.provider_name}">
                </a>
            </li>`;
        });
        platformsHTML += `</ul>`;
    }

    watchProvidersContainer.innerHTML = platformsHTML || `<p>No platform information available.</p>`;
}


