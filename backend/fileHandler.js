//подключаем модули
const fs = require('fs');
const Film = require('./Film');
const queries = require('./queries');
const path = require('path');

//реализуем функцию, которая считывает данные с файла и записывает их в бд
function readFileAndInsertToDB(filename) {
    //считываем файл
    fs.readFile(filename, {encoding : 'utf-8'}, function(err, data){
        if(err){
            console.log(err);
            return;
        }
        
        console.log('from file to db');
        //разбиваем считанные данные на элементы и записываем в массив
        let arr = data.split("\n\n");
        console.log(arr);
        for(let i = 0; i < arr.length; i++) {
            //разбиваем блок данных по одному конкретному фильму на массив, где элементы имеют вид
            // 'Title: Blazing Saddles'
            let arrf = arr[i].split("\n");

            // console.log(arrf);
            // вырезаем из каждого элемента массива arrf нажные строки, которые будут параметрами при создании
            // объекта класса Film
            if(arrf.length == 4) {
                let film = new Film(arrf[0].slice(7), arrf[1].slice(14), arrf[2].slice(8), arrf[3].slice(7));
                queries.selectFilmToValidate(film, () => {
                    queries.insertFilm(film);
                });
            }
        }
    });
}

//реализуем функционал, который будем экспортировать
module.exports = {
    uploadFile: function(req, res) {
        // загруженный файл доступен через свойство req.file
        console.log("req.file " + req.file); 
        
        // файл временного хранения данных
        let tmp_path = req.file.path;
        console.log("tmp_path " + tmp_path);
        
        // место, куда файл будет загружен 
        let target_path = path.join(req.file.destination, req.file.originalname);
        console.log("target_path " + target_path); 
        
        // загрузка файла 
        let src = fs.createReadStream(tmp_path); 
        let dest = fs.createWriteStream(target_path);
        console.log("src " + src);
        console.log("dest " + dest);
        
        //перенаправляем данные из потока src в поток dest
        src.pipe(dest); 
        
        // обработка результатов загрузки 
        src.on('end', function(){ 
        
            // удалить файл временного хранения данных
            fs.unlink(tmp_path, () => {
                // res.send('complete'); 
                console.log('file was uploaded');
            }); 
        });
        
        src.on('error', function(err) { 
        
            // удалить файл временного хранения данных
            fs.unlink(tmp_path, () => {
                // res.send('complete'); 
                console.log(err);
            }); 
        });

        // вызываем функцию, которая считывает данные с файла и записывает их в бд
        readFileAndInsertToDB(target_path);
        queries.selectAllFilms(res);
    }
};