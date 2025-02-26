
export function renderMoviePosters(movieList) {
	console.log('Innehåll av movieList:', movieList);

    const posterRef = document.querySelector('#cardContainer')
	posterRef.innerHTML = ''

    for(let movie of movieList) {
        let moviePoster = createMoviePosters(movie)
        // console.log('Poster URL:', movie.Poster);
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

// async function checkImageExists(url) {
//     try {
//         const response = await fetch(url, { method: "HEAD" });
//         console.log('image', response);
//         if(!response.ok) {
//             throw new Error('Image does not exist');
//         }
//         return response.ok;
//     } catch (error) {
//         console.log(error.message);
//         return false;
//     }
// }

