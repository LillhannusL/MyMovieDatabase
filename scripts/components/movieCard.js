import { fetchOMDBMovieDetails } from "../modules/api.js";


export function createMovieCard(movie) {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const isFavorite = favoriteMovies.some(favMovie => favMovie.imdbID === movie.imdbID);
    const starClass = isFavorite ? 'fa-solid' : 'fa-regular';
	let cardRef = document.createElement('article');
	cardRef.classList.add('movieCard');
	const cardTemp = `
            <div class ="movieCard__top">
                <img
                src="${movie.Poster}"
                alt="Poster of ${movie.Title}"
                class="movieCard__Poster"
                />
            </div>
            <div class="moviePoster_bottom">
            <h2 class="movieCard__info--title">${movie.Title}</h2>
            <button class="moviePoster__favoritesBtn favorites movieCard__favoritesBtn" aria-label="add to favorites"><i class="${starClass} fa-2xl fa-star"></i></button>
            <div class="movieCard__info--artists">
                <p class="movieCard__info"><b>Director:</b> <br>${movie.Director}</p>
                <p class="movieCard__info"><b>Writer:</b> <br>${movie.Writer}</p>
                <p class="movieCard__info"><b>Starring:</b> <br>${movie.Actors}</p>
            </div>
            <p class="movieCard__info"><b>Plot:</b> <br>${movie.Plot}</p>
            <div class="movieCard__info--artists">
                <p class="movieCard__info"><b>Rated:</b> <br>${movie.Rated}</p>
                <p class="movieCard__info"><b>Genre:</b> <br>${movie.Genre}</p>
                <p class="movieCard__info"><b>Runtime:</b> <br>${movie.Runtime}</p>
                <p class="movieCard__info"><b>Released:</b> <br>${movie.Released}</p>
                <p class="movieCard__info"><b>Imdb-Rating:</b> <br>${movie.imdbRating}</p>
            </div>
            </div>     
    `;
	cardRef.innerHTML = cardTemp;

	return cardRef;
}

export async function renderMovieCard(imdbID) {
	const cardRef = document.querySelector('#movieInformation');
	const movie = await fetchOMDBMovieDetails(imdbID);

	let movieCard = createMovieCard(movie);
	cardRef.appendChild(movieCard);
}