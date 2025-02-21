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
    const response = await fetch(`http://www.omdbapi.com/?apikey=de7c82e1&s=${input}*`);
    let data = await response.json();
    console.log(data)

    // const idfrominput = data.Search && data.Search[0].imdbID;
    // if(idfrominput) {
    // await fetchOMDBMovieDetails(idfrominput);
    // }
    return data;
}

export async function fetchOMDBMovieDetails(imdbID) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=de7c82e1&s&plot=full&i=${imdbID}`);
    let data = await response.json();
    console.log(data)
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

	// setupSearchForm();
}

function searchPageSetup() {
	renderMoviePosters();
}

async function moviePageSetup() {
	console.log(value);

	const poster = renderMovieCard();
	document.querySelector('movieInformation').appendChild(poster);
}

function getRandomTrailers(trailers) {
	const scrambled = trailers.sort(() => Math.random() - 0.5);
	return scrambled.slice(0, 5);
}

// Movie Posters on start page

export function renderMoviePosters(movieList) {
    const posterRef = document.querySelector('#cardContainer')
    
    for(let movie of movieList) {
        let moviePoster = createMoviePosters(movie)
        posterRef.appendChild(moviePoster)
    }
}

export function renderMovieCard(imdbID) {
    const cardRef = document.querySelector('#movieInformation');
    let movieCard = createMovieCard(imdbID);
    cardRef.appendChild(movieCard);    
}


export function listenForFavorites() {
    let favoritesArray = [];

    const favorites = document.querySelectorAll('.favorites');
    favorites.forEach(favorite => {
        favorite.addEventListener('click', (event) => {

            event.target.classList.toggle('fa-regular');
            event.target.classList.toggle('fa-solid');

            if(event.target.classList.contains('fa-solid')) {
                console.log('Saving favorite', favoritesArray);

            } else {
                console.log('Removing favorite', favoritesArray);
                              
            }
        })
    })
}

function addMovieToFavorites(movie) {
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


// export async function setupSearchForm(movies) {
//     const inputRef = document.querySelector('#searchInput');
//     const formRef = document.querySelector('#searchForm');

//     inputRef.addEventListener('input', (event) => {
//             console.log(event.target.value)
//         });

//     formRef.addEventListener('submit', async (event) => { 
//         event.preventDefault();
//         const input = searchInput.value.trim();
//         if (input) {
//         const data = await fetchOMDBMovies(input);
//         console.log(data);
//         const jsonData = JSON.stringify(data)
//         const encodeData = encodeURIComponent(jsonData)
//         window.location.href = `./search.html?movie=${encodeData}`
//         }
//     })
// }


export function createMoviePosters(movie) {
    let posterRef = document.createElement('article');
    posterRef.classList.add('moviePoster')
    const posterTemp = `
        <a class="movieLink" href="./movie.html?movie=${movie.Title}
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
        <a href="./movie.html?movie=${movie.Title}
            <div class ="movieCard__top">
                <img
                src="${movie.Poster}"
                alt="Poster of ${movie.Title}"
                class="movieCard__Posters"
                />
            </div>
            <div class="moviePoster_bottom"
                <p class="movieCard__info">${movie.Title}</p>
                <p class="movieCard__info">Director: ${movie.Director}</p>
                <p class="movieCard__info">Writer: ${movie.Writer}</p>
                <p class="movieCard__info">Starring: ${movie.Actors}</p>
                <p class="movieCard__info">Plot: ${movie.Plot}</p>
                <p class="movieCard__info">Rated: ${movie.Rated}</p>
                <p class="movieCard__info">Genre: ${movie.Genre}</p>
                <p class="movieCard__info">Runtime: ${movie.Runtime}</p>
                <p class="movieCard__info">Released: ${movie.Released}</p>
                <p class="movieCard__info">Imdb-Rating: ${movie.imdbRating}</p>
            </div>
        </a>       
    `;
    cardRef.innerHTML = cardTemp;

    return cardRef;
    // posterRef.src = poster;
}