import { fetchTopMovies,
	fetchOMDBMovies,
	fetchOMDBMovieDetails
} from './modules/api.js';
import {
	listenForFavorites,
	setupSearchForm,
	getRandomTrailers
} from "./utils/utils.js";
import { renderTrailers } from './modules/caroussel.js';
import { renderMoviePosters } from "./utils/domUtils.js"
import { renderMovieCard } from './components/movieCard.js';

let isEventListenerSet = false;

if (
	window.location.pathname === '/' ||
	window.location.pathname === '/index.html'
) {
	console.log('index.html');
	pageSetup();
} else if (window.location.pathname === '/favorites.html') {
	console.log('favorites.html');
    favoritesPageSetup();
} else if (window.location.pathname === '/movie.html') {
	console.log('movie.html');
	moviePageSetup();
} else if (window.location.pathname === '/search.html') {
	console.log('search.html');
	searchPageSetup();
}

// Get Random Trailers on start page

async function pageSetup() {
	const topMovieList = await fetchTopMovies();
	let trailers = getRandomTrailers(topMovieList);

	for (let index in trailers) {
		renderTrailers(trailers[index], index);
	}

	renderMoviePosters(topMovieList);
	listenForFavorites();

	setupSearchForm();
    goToFavorites()
}

async function searchPageSetup() {
	console.log('sök');
	const params = new URLSearchParams(window.location.search);
	const searchQuery = params.get('movie');
	console.log(searchQuery);

	if (searchQuery) {
		try {
			const data = await fetchOMDBMovies(searchQuery);
			console.log(data);
			if (data.Search && data.Search.length > 0) {
				console.log('filmer');
				renderMoviePosters(data.Search);
			} else {
				console.log('Inga filmer hittades');
			}
		} catch (error) {
			console.error('Något gick fel vid hämtningen av filmer');
		}
	}

	setupSearchForm();
	goToFavorites()
	listenForFavorites();
}

async function moviePageSetup() {
	console.log('movie page');
	const params = new URLSearchParams(window.location.search);
	const imdbID = decodeURIComponent(params.get('movie'));

	setupSearchForm();


	if (imdbID) {
		const movie = await fetchOMDBMovieDetails(imdbID);
		if (movie) {
			console.log(movie);
		}
	} else {
		console.log('No imdbID found in URL');
	}

	renderMovieCard(imdbID);
	goToFavorites()
	listenForFavorites();
}

function favoritesPageSetup() {
	let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

   renderMoviePosters(favoriteMovies);
	listenForFavorites();
	setupSearchForm();
}


function goToFavorites() {
    const favoritesRef = document.querySelector('#favBtn');
    favoritesRef.addEventListener('click', (event) => {
        window.location.href = `../favorites.html`
    });
}