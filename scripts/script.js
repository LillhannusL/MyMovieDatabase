// import { fetchTopMovies } from './modules/api.js';
import { renderTrailers } from './modules/caroussel.js';
// // import { createMoviePosters } from "./utils/domUtils.js"
// import {
// 	renderMoviePosters,
// 	renderMovieCard,
// 	listenForFavorites,
// } from './utils/utils.js';
// import { createMovieCard } from './components/movieCard.js';

if (
	window.location.pathname === '/' ||
	window.location.pathname === '/index.html'
) {
	console.log('index.html');
	pageSetup();
} else if (window.location.pathname === '/favorites.html') {
	console.log('favorites.html');
} else if (window.location.pathname === '/movie.html') {
	console.log('movie.html');
	moviePageSetup();
} else if (window.location.pathname === '/search.html') {
	console.log('search.html');
	searchPageSetup();
}


export async function fetchTopMovies() {
    const response = await fetch('https://santosnr6.github.io/Data/favoritemovies.json');
    let topMovieList = await response.json();
    return topMovieList;
}

export async function fetchOMDBMovies(input) {
// 	const response = await fetch(`https://www.omdbapi.com/?apikey=de7c82e1&s=${encodeURIComponent(input)}`);
//        if (!response.ok) {
//            throw new Error('Nätverksrespons var inte OK');
//        }
//        return await response.json();
//    }
	try {
		const response = await fetch(`http://www.omdbapi.com/?apikey=de7c82e1&s=${encodeURIComponent(input)}*`);
		let data = await response.json();
		return data;
	} catch {
		console.log(error.message);
	}
}

export async function fetchOMDBMovieDetails(imdbID) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=de7c82e1&s&plot=full&i=${encodeURIComponent(imdbID)}`);
    let data = await response.json();
    return data;
  
}


// Get Random Trailers on start page

async function pageSetup() {
	const topMovieList = await fetchTopMovies();
	let trailers = getRandomTrailers(topMovieList);

	for (let index in trailers) {
		renderTrailers(trailers[index], index);
	}

	renderMoviePosters(topMovieList);
    listenForFavorites()

	setupSearchForm();
}

async function searchPageSetup() {
	console.log('sök')
	const params = new URLSearchParams(window.location.search);
	const searchQuery = params.get('movie');
	console.log(searchQuery);


	if(searchQuery) {
		try	{
			const data = await fetchOMDBMovies(searchQuery);
			console.log(data); 
			if(data.Search && data.Search.length > 0) {
				console.log('filmer')
				renderMoviePosters(data.Search);
			}	else {
                console.log('Inga filmer hittades');
			}
		} catch (error) {
			console.error('Något gick fel vid hämtningen av filmer');
		}
	}
};

async function moviePageSetup() {
	console.log("movie page");
    const params = new URLSearchParams(window.location.search);
    const imdbID = decodeURIComponent(params.get('movie'));

    console.log(imdbID);

    if(imdbID) {
        const movie = await fetchOMDBMovieDetails(imdbID);
        if(movie){
            console.log(movie);
        }
    } else {
        console.log('No imdbID found in URL')
    }

	await renderMovieCard(imdbID);
	document.querySelector('#movieInformation').appendChild(poster);
}

function getRandomTrailers(trailers) {
	const scrambled = trailers.sort(() => Math.random() - 0.5);
	return scrambled.slice(0, 5);
}

// Movie Posters on start page

export function renderMoviePosters(movieList) {
	console.log('Typ av movieList:', typeof movieList);
	console.log('Innehåll av movieList:', movieList);
	
    const posterRef = document.querySelector('#cardContainer')
	posterRef.innerHTML = ''
    
    for(let movie of movieList) {
        let moviePoster = createMoviePosters(movie)
        posterRef.appendChild(moviePoster)
    }
}

export async function renderMovieCard(imdbID) {
    const cardRef = document.querySelector('#movieInformation');
    const movie = await fetchOMDBMovieDetails(imdbID)

    let movieCard = createMovieCard(movie);
    cardRef.appendChild(movieCard);    
}

async function setupSearchForm() {
	const inputRef = document.querySelector('#searchInput');
    const formRef = document.querySelector('#searchForm');

	inputRef.addEventListener('input', (event) => {
		console.log(event.target.value);
	})

	formRef.addEventListener('submit', async (event) => {
		event.preventDefault();
		await fetchOMDBMovies(inputRef.value)
        window.location.href = `../search.html?movie=${inputRef.value}`
	})
}

export function listenForFavorites() {
    let favoritesArray = [];

    const favorites = document.querySelectorAll('.favorites');
    favorites.forEach(favorite => {
        favorite.addEventListener('click', (event) => {
            event.target.classList.toggle('fa-regular');
            event.target.classList.toggle('fa-solid');

            const imdbID = event.target.dataset.imdbID
            const isFavorite =  fetchOMDBMovies(imdbID);

            if(isFavorite) {
                const index = favoritesArray.indexOf(imdbID);
                if(index >-1){
                  favoritesArray.splice(index, 1)
                  console.log('Removing favorite', favoritesArray)
                } else {
                  favoritesArray.push(imdbID);
                  console.log('Saving Favorite', favoritesArray)
                }
                  }  
        })
    })
}


function addMovieToFavorites(movieId) {
    // Lägg till filmen i en favoritlista (exempelvis i localStorage eller en global array)
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Movie added to favorites', movie);
}

function removeMovieFromFavorites(movieId) {
    // Ta bort filmen från favoriterna
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.imdbID !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Movie removed from favorites');
}


export function createMoviePosters(movie) {
    let posterRef = document.createElement('article');
    posterRef.classList.add('moviePoster')
    const posterTemp = `
        <a class="movieLink" href="../movie.html?movie=${encodeURIComponent(movie.imdbID)}">
            <div class ="moviePoster__top">
                <img
                src="${movie.Poster}"
                alt="Poster of ${movie.Title}"
                class="moviePoster__Posters"
                />
            </div>
            <div class="moviePoster_bottom"
                <p class="moviePoster__Title">${movie.Title}</p>
                <div class="moviePoster__favorites favorites fa-regular fa-2xl fa-star"></div>

            </div>
        </a>       
    `;
    posterRef.innerHTML = posterTemp;

    return posterRef;
    // posterRef.src = poster; fa-regular fa-solid
}

export function createMovieCard(movie) {
    let cardRef = document.createElement('article');
    cardRef.classList.add('movieCard')
    const cardTemp = `
            <div class ="movieCard__top">
                <img
                src="${movie.Poster}"
                alt="Poster of ${movie.Title}"
                class="movieCard__Poster"
                />
            </div>
            <div class="moviePoster_bottom">
            <p class="movieCard__info--title">${movie.Title}</p>
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


