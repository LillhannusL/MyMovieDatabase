import { fetchTopMovies } from "./modules/api.js";
import { renderTrailers } from "./modules/caroussel.js";


if(window.location.pathname === '/' || window.location.pathname === '/index.html') {
    console.log('index.html');

} else if(window.location.pathname === '/favorites.html') {
    console.log('favorites.html');

} else if(window.location.pathname === '/movie.html') {
    console.log('movie.html');

} else if(window.location.pathname === '/search.html') {
    console.log('search.html');
}

const topMovieList = await fetchTopMovies();
 
function getRandomTrailers(trailers) {
    const scrambled = trailers.sort(() => Math.random() - 0.5);
    return scrambled.slice(0, 5);
}

let trailers = getRandomTrailers(topMovieList);

for(let index in trailers){
    renderTrailers(trailers[index], index)}