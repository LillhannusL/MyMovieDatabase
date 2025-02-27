export function renderMoviePosters(movieList) {
    const posterRef = document.querySelector('#cardContainer')
	posterRef.innerHTML = ''

    for(let movie of movieList) {
        let moviePoster = createMoviePosters(movie)
        posterRef.appendChild(moviePoster)
    }
}

export function createMoviePosters(movie) {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const isFavorite = favoriteMovies.some(favMovie => favMovie && favMovie.imdbID === movie.imdbID);
    const starClass = isFavorite ? 'fa-solid' : 'fa-regular';

	let posterRef = document.createElement('article');      
	posterRef.classList.add('moviePoster');
	const posterTemp = `
        <a class="movieLink" href="../movie.html?movie=${encodeURIComponent(movie.imdbID)}">
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

	return posterRef;
}