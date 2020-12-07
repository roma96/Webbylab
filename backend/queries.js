let mssql = require('mssql');
let connection = require('./configDB');


module.exports = {
	//проверка на то, не повторяются ли фильмы, фильмы могут быть с одинаковым названием,
	// но тогда у них должен быть разный год выпуска и актерский состав
	selectFilmToValidate: function(film, cb, res) {
		let ps = new mssql.PreparedStatement(connection);

		ps.input('title', mssql.Text);
		ps.input('releaseYear', mssql.Int);
		ps.input('stars', mssql.Text);

		ps.prepare("SELECT * FROM Films WHERE title LIKE N'" + film.title + "' AND (releaseYear LIKE @releaseYear OR stars LIKE N'" + film.stars + "')", function(err) {
			if (err) console.log(err); 
			
			ps.execute(film, function(err, rows) { 
			
					if (err) console.log(err); 
				
					if(rows.recordset.length) {
						if(res) {
							res.send("This film is already exist!");
						} else {
							console.log("This film from file is already exist!");
						}
					} else {
						cb();
					}
					// // res.json(rows);  
					ps.unprepare();  
					
			}); 
		}); 
	},

	// выбор всех элементов и отображение в виде таблицы 
	selectAllFilms: function (res) {
        // подключение к бд 

		let request = new mssql.Request(connection);  

		request.query("SELECT * FROM Films ORDER BY id", function(err, rows) {
			
			if (err) console.log(err); 

			res.json(rows); 
		}); 
	},
	selectAllFilmsOrderByTitle(res) {
		// подключение к бд 

		let request = new mssql.Request(connection);  

		request.query("SELECT * FROM Films ORDER BY Title", function(err, rows) {
			
			if (err) console.log(err); 

			res.json(rows); 
		}); 
	},
	selectFilmById: function(film, res) {
		// подключение к бд 
		let ps = new mssql.PreparedStatement(connection);   
		
		ps.input('id', mssql.Int); 
		
		ps.prepare('SELECT * FROM Films WHERE id=@id', function(err) {
			if (err) console.log(err); 
			
			ps.execute(film, function(err, rows) { 
			
					if (err) console.log(err); 
				
					res.json(rows);  
					ps.unprepare();  
					
			}); 
		}); 
	},
	selectFilmByTitle: function(film, res) {
		// подключение к бд 
		let ps = new mssql.PreparedStatement(connection);   
		
		ps.input('title', mssql.Text); 
		
		ps.prepare("SELECT * FROM Films WHERE (title LIKE N'%" + film.title + "%')", function(err) {
			if (err) console.log(err); 
			
			ps.execute(film, function(err, rows) { 
			
					if (err) console.log(err); 
				
					res.json(rows);  
					ps.unprepare();  
					
			}); 
		}); 
	}, 
	selectFilmsByActor: function(film, res) {
		let ps = new mssql.PreparedStatement(connection);   
		
		ps.input('actor', mssql.Text); 
		
		ps.prepare("SELECT * FROM Films WHERE (stars LIKE N'%" + film.actor + "%')", function(err) {
			if (err) console.log(err); 
			
			ps.execute(film, function(err, rows) { 
			
					if (err) console.log(err); 

					console.log(rows);
				
					res.json(rows);  
					ps.unprepare();  
					
			}); 
		}); 
	},
	// добавить элемент в бд
	insertFilm: function (film) {

		let ps = new mssql.PreparedStatement(connection);

		ps.input('title', mssql.Text);
		ps.input('releaseYear', mssql.Int);
		ps.input('format', mssql.Text);
		ps.input('stars', mssql.Text);

		ps.prepare("INSERT INTO Films (title, releaseYear, format, stars) VALUES (N'" + film.title + "', @releaseYear, N'" + film.format + "', N'" + film.stars + "')", function (err) {
			if (err) console.log(err);
			let request = ps.execute(film, function (err) {

				if(err) console.log(err);

				// console.log('add film to db');
				ps.unprepare();
			});
		});
	},

	// загрузить элемент из бд по id 
	loadItemById: function (req, res) {

		let inserts = {
			id: parseInt(req.params.id)
		};

		let ps = new mssql.PreparedStatement(connection);
		ps.input('id', mssql.Int);

		ps.prepare('SELECT * FROM testRL WHERE id=@id', function (err) {

			ps.execute(inserts, function (err, rows) {
				if (err) console.log(err);
				console.log('get item by id');
				// console.log(row);

				let row = rows.recordset[0];
				// console.log("rows" + rows);
				// console.log("row" + row);

				res.render('edit_item_page', {
					id: row.id,
					name: row.name,
					description: row.description,
					completed: row.completed
				});

				ps.unprepare();
			});
		});
	},
	//удалить элемент
	deleteFilm: function (film, res, cb) {

		let ps = new mssql.PreparedStatement(connection);

		ps.input('id', mssql.Int);

		ps.prepare('DELETE FROM Films WHERE id=@id', function (err) {
			if (err) console.log(err)

			ps.execute(film, function (err) {
				if (err) console.log(err);

				console.log('Film was deleted');

				ps.unprepare();
			});
		});

	}
}