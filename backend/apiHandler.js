// соединение с бд 
const connection = require('./configDB');
const mssql = require('mssql');
const path = require('path'); 
const queries = require('./queries');
const Film = require('./Film');

module.exports = {
    // згрузка всех элементов
    loadAllFilms: function (req, res) {
		console.log('load all films from db');
		queries.selectAllFilms(res);
	},
	//отсортировать фильмы в алфавитном порядке 
	sortFilms: function (req, res) {
		queries.selectAllFilmsOrderByTitle(res);
		console.log("Films were sorted");
	},
	//выбрать фильмы из бд по id или title
	getFilms: function (req, res) {
		console.log(typeof(req.params.id));

		//проверка на то, являеется ли строка числом, если нет, 
		//то с клиента пришло название фильма, если да, то id
		if(isNaN(req.params.id)) {
			console.log("get film by title");
			queries.selectFilmByTitle({title: req.params.id}, res);
		} else {
			console.log("get film by id");
			queries.selectFilmById({id: req.params.id}, res);
		}
	},
	//поиск фильмов по актеру
	getFilmsByActor: function(req, res) {
		console.log(req.params.actor);
		queries.selectFilmsByActor({actor: req.params.actor}, res);
	},
    // создание фильма и обновление таблицы 
    addFilm: function (req, res) {
		console.log(req.body);
		let film = new Film(req.body.title, req.body.releaseYear, req.body.format, req.body.stars);
		queries.insertFilm(film);
		queries.selectAllFilms(res);
    },

    // удаление элемента и обновление таблицы
    deleteFilm: function (req, res) {
		console.log("delete film with id " + req.params.id);
		queries.deleteFilm({id: req.params.id});
		queries.selectAllFilms(res);
    }
}