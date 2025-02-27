import {
	fetchTopMovies,
	fetchOMDBMovies,
	fetchOMDBMovieDetails
} from './modules/api.js';
import {
	listenForFavorites,
	listenForFavoritesMovies,
	setupSearchForm,
	getRandomTrailers
} from "./utils/utils.js";
import { renderTrailers } from './modules/caroussel.js';
import { renderMoviePosters } from "./utils/domUtils.js"
import { renderMovieCard } from './components/movieCard.js';


if (
	window.location.pathname === '/' ||
	window.location.pathname === '/index.html'
) {
	pageSetup();
} else if (window.location.pathname === '/favorites.html') {
	favoritesPageSetup();
} else if (window.location.pathname === '/movie.html') {
	moviePageSetup();
} else if (window.location.pathname === '/search.html') {
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

	const params = new URLSearchParams(window.location.search);
	const searchQuery = params.get('movie');

	if (searchQuery) {
		try {
			const data = await fetchOMDBMovies(searchQuery);

			if (data.Search && data.Search.length > 0) {
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
	const params = new URLSearchParams(window.location.search);
	const imdbID = decodeURIComponent(params.get('movie'));

	setupSearchForm();
	await fetchOMDBMovieDetails(imdbID);

	renderMovieCard(imdbID);
	goToFavorites()
	listenForFavoritesMovies();
}

function favoritesPageSetup() {
	let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

	renderMoviePosters(favoriteMovies);
	listenForFavorites();
	setupSearchForm();
}

function goToFavorites() {
	const favoritesRef = document.querySelector('#favBtn');
	favoritesRef.addEventListener('click', () => {
		window.location.href = `../favorites.html`
	});
}