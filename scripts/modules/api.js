export async function fetchTopMovies() {
	try {
		const response = await fetch('https://santosnr6.github.io/Data/favoritemovies.json');
		let topMovieList = await response.json();
		return topMovieList;
	} catch (error) {
		console.error('Failed to fetch topMovies:', error.message);
	}
}

export async function fetchOMDBMovies(input) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=de7c82e1&s=${input}*`);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch OMDBMovies: ', error.message);
    }
}

export async function fetchOMDBMovieDetails(imdbID) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=de7c82e1&s&plot=full&i=${imdbID}`);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to get movie Details:', error.message);
    }
}