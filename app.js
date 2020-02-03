
class Movie {
    constructor(title, director, genre) {
        this.title = title;
        this.director = director;
        this.genre = genre;
    }


}

class UI {

    static displayMovies() {

        const movies = Store.getMovies();

        movies.forEach((movie) => UI.addMovieToList(movie));

    }

    static addMovieToList(movie) {
        const list = document.querySelector('#movie-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.director}</td>
            <td>${movie.genre}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">delete</a></td>
        `;
        list.appendChild(row);
    }

    static deleteMovie(el) {

        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }

    }

    static showAlert(message, className) {

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#movie-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {

        document.querySelector('#title').value = '';
        document.querySelector('#director').value = '';
        document.querySelector('#genre').value = '';
    }
}


class Store {

    static getMovies(){
        let movies;
        if (localStorage.getItem('movies') === null) {
            movies = [];
        } else {
            movies = JSON.parse(localStorage.getItem('movies'));
        }
        return movies;
    }

    

    static addMovie(movie) {
        const movies = Store.getMovies();

        movies.push(movie);
        localStorage.setItem('movies', JSON.stringify(movies));
    }


    static removeMovie(genre) {

        const movies = Store.getMovies();

        movies.forEach((movie, index) => {

            if (movie.genre === genre) {
                movies.splice(index, 1);
            }

        });

        localStorage.setItem('movies', JSON.stringify(movies));
    }

}


//---------------------------- EVENTS -----------------------------//
// Event: Display Movies
document.addEventListener('DOMContentLoaded', UI.displayMovies);

// Event: Add a Movie
document.querySelector('#movie-form').addEventListener('submit', (e) => {
    
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const director = document.querySelector('#director').value;
    const genre = document.querySelector('#genre').value;

    // Validate forms
    if (title === '' || director === '' || genre === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instatiate movie
        const movie = new Movie(title, director, genre);
       

        // add movie to UI
        UI.addMovieToList(movie);

        // add movie to Store
        Store.addMovie(movie);

        // show success msg
        UI.showAlert('Movie Added Successfully', 'success');

        // Clear fields 
        UI.clearFields();

    }


});

// Event: Remove a Movie

// event propagation/we target the whole list 
document.querySelector('#movie-list').addEventListener('click', (e) => {

    //console.log(e.target)

    // remove movie from UI
    UI.deleteMovie(e.target);

    // remove book from Store
    Store.removeMovie(e.target.parentElement.previousElementSibling.textContent); //traversing the DOM , parent element -> td

    //msg
    UI.showAlert('Movie Removed', 'warning');

});