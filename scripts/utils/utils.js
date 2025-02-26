import { fetchOMDBMovieDetails,
        fetchOMDBMovies
 } from "../modules/api.js";

let isEventListenerSet = false;
const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];


export  function listenForFavorites() {
	if (isEventListenerSet) return;

    document.addEventListener('click', async (event) => {
		console.log('Event triggered');
        if (event.target.closest('.moviePoster__favoritesBtn')) {
            event.preventDefault();
            const button = event.target.closest('.moviePoster__favoritesBtn');
            const imdbID = button.closest('.movieLink').getAttribute('href').split('=')[1];

            const movie = await fetchOMDBMovieDetails(imdbID);
            const isFavorite = favoriteMovies.find(favMovie => favMovie.imdbID === imdbID);
            
            if(!isFavorite) {
                favoriteMovies.push(movie);
                event.target.classList.toggle('fa-regular');
                event.target.classList.toggle('fa-solid');
                console.log('Tillagd: ', movie, 'alla favoriter: ', favoriteMovies)
            } else {
                favoriteMovies.splice(favoriteMovies.indexOf(isFavorite), 1);
                event.target.classList.toggle('fa-regular');
                event.target.classList.toggle('fa-solid');
                console.log('borttagen: ', movie, 'alla favoriter: ', favoriteMovies);
            }
            localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
        }
    })
    isEventListenerSet = true;
};

export async function setupSearchForm() {
	const inputRef = document.querySelector('#searchInput');
	const formRef = document.querySelector('#searchForm');

	inputRef.addEventListener('input', (event) => {
		console.log(event.target.value);
	});

	formRef.addEventListener('submit', async (event) => {
		event.preventDefault();
		await fetchOMDBMovies(inputRef.value);
		window.location.href = `../search.html?movie=${inputRef.value}`;
	});
}

export function getRandomTrailers(trailers) {
	const scrambled = trailers.sort(() => Math.random() - 0.5);
	return scrambled.slice(0, 5);
}