//подключаем модули установленные с npm
const express = require('express'); 
const path = require('path');
const bodyParser = require('body-parser');

//создаем приложение с помощью фреймворка express
const app = express(); 

//порт, на котором будем прослушивать сервер
const port = 8080; 

//подключаем собственные модули
const apiHandler = require('./apiHandler'); 
const fileHandler = require('./fileHandler');

//каталог где находится index.html
let catalog = "../frontend";

//multer - middleware для обработки данных формы в кодировке multipart/form-data 
const multer = require('multer'); 

//dest - директория для сохранения файлов, загружаемых на сервер 
let upload = multer({dest: __dirname + '/uploads'}); 

// указать, что будет загружен один файл с именем recfile
let type = upload.single('recfile'); 

//middleware для того, чтобы считать запросы json
let jsonParser = bodyParser.json();
app.use(jsonParser);

//загружаем index.html
app.use('/', express.static(path.join(__dirname, catalog)));

//middleware для того, чтобы прочитать запрос при добавлении фильма
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    fs.readFile(path.join(__dirname,'index.html'),"utf8", function(err, file) {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write(err + "\n");
            res.end();
            return;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(file);
        res.end();
  })
}); 

//выбрать все фильмы из бд
app.get('/api', apiHandler.loadAllFilms); 

//отсортировать фильмы в алфавитном порядке 
app.get('/api/sorted', apiHandler.sortFilms);

//выбрать фильмы из бд по id или title
app.get('/api/:id', apiHandler.getFilms);

//найти фильмы по актеру
app.get('/api/star/:actor', apiHandler.getFilmsByActor);

//добавить фильм
app.post('/api', apiHandler.addFilm); 

//сохранить загруженный с клиента файл
app.post('/', type, fileHandler.uploadFile);

//удалить фильм
app.delete('/api/:id', apiHandler.deleteFilm);  

//запуск сервера
app.listen(port, function () {
    console.log('App running on port ' + port);
});