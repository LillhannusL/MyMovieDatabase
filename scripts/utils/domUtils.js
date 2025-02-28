import { checkImageExists } from "./utils.js";

export async function renderMoviePosters(movieList) {
    console.log(movieList);
    const posterRef = document.querySelector('#cardContainer')
	posterRef.innerHTML = ''

    for(let movie of movieList) {
        let moviePoster = await createMoviePosters(movie)
        posterRef.appendChild(moviePoster)
    }
}

async function createMoviePosters(movie) {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const isFavorite = favoriteMovies.some(favMovie => favMovie && favMovie.imdbID === movie.imdbID);
    const starClass = isFavorite ? 'fa-solid' : 'fa-regular';

	let posterRef = document.createElement('article');      
	posterRef.classList.add('moviePoster');

    let check = await checkImageExists(movie.Poster);
    if (check) {
	const posterTemp = `
        <a class="movieLink" href="../movie.html?movie=${movie.imdbID}">
            <div class ="moviePoster__top">
                <img
                src="${movie.Poster}"
                alt="Poster of ${movie.Title}"
                class="moviePoster__Posters"
                />
                <button class="moviePoster__favoritesBtn favorites" aria-label="add to favorites"><i class="${starClass} fa-2xl fa-star"></i></button>
            </div>
            <div class="moviePoster_bottom"
                <p class="moviePoster__Title">${movie.Title}</p>

            </div>
        </a>       
    `;
    posterRef.innerHTML = posterTemp;

    } else {
        let missingImg = "../../res/icons/missing-poster.svg"
        const posterTemp = `
        <a class="movieLink" href="../movie.html?movie=${movie.imdbID}">
            <div class ="moviePoster__top">
                <img
                src="${missingImg}"
                alt="Poster of ${movie.Title}"
                class="moviePoster__Posters"
                />
                <button class="moviePoster__favoritesBtn favorites" aria-label="add to favorites"><i class="${starClass} fa-2xl fa-star"></i></button>
            </div>
            <div class="moviePoster_bottom"
                <p class="moviePoster__Title">${movie.Title}</p>

            </div>
        </a>       
    `;
    posterRef.innerHTML = posterTemp;
	}
 
    return posterRef;
}
