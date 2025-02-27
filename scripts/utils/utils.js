import {
    fetchOMDBMovieDetails,
    fetchOMDBMovies
} from "../modules/api.js";

let isEventListenerSet = false;

export function listenForFavorites() {
    if (isEventListenerSet) return;

    document.addEventListener('click', async (event) => {
        if (event.target.closest('.moviePoster__favoritesBtn')) {
            event.preventDefault();
            const button = event.target.closest('.moviePoster__favoritesBtn');
            if (button) {
                const imdbID = button.closest('.movieLink').getAttribute('href').split('=')[1];
                const movie = await fetchOMDBMovieDetails(imdbID);
                toggleFavoriteMovie(movie, event);
            }
        }
    });
    isEventListenerSet = true;
};

export function listenForFavoritesMovies() {
    if (isEventListenerSet) return;

    document.addEventListener('click', async (event) => {
        if (event.target.closest('.movieCard__favoritesBtn')) {
            event.preventDefault();
            const movieCard = event.target.closest('.movieCard')
            const imdbID = movieCard ? movieCard.dataset.imdbid : null
            const movie = await fetchOMDBMovieDetails(imdbID);
            toggleFavoriteMovie(movie, event);
        }
    });
};

function toggleFavoriteMovie(movie, event) {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const isFavorite = favoriteMovies.some(favMovie => favMovie.imdbID === movie.imdbID);

    if (!isFavorite) {
        favoriteMovies.push(movie);
        event.target.classList.remove('fa-regular');
        event.target.classList.add('fa-solid');
    } else {
        const movieIndex = favoriteMovies.findIndex(favMovie => favMovie.imdbID === movie.imdbID);
        if (movieIndex !== -1) {
            favoriteMovies.splice(movieIndex, 1);
            event.target.classList.add('fa-regular');
            event.target.classList.remove('fa-solid');
        }
    }

    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
};

export async function setupSearchForm() {
    const inputRef = document.querySelector('#searchInput');
    const formRef = document.querySelector('#searchForm');

    formRef.addEventListener('submit', async (event) => {
        event.preventDefault();
        await fetchOMDBMovies(inputRef.value);
        window.location.href = `../search.html?movie=${inputRef.value}`;
    });
}

export function getRandomTrailers(trailers) {
    for (let i = trailers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trailers[i], trailers[j]] = [trailers[j], trailers[i]];
    }
    return trailers.slice(0, 5);
};