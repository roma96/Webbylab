// Подключаем модуль mssql для работы с mssql сервером
const mssql = require('mssql'); 

//объкт с конфигурациями подключения к бд
let config = {
	user: '',                       // пользователь базы данных
	password: '',    			    // пароль пользователя 
	server: '',       			    // хост
	database: '',      				// имя бд
	port: 1433,			 			// порт, на котором запущен sql server
    pool: {
        max: 10, 					// максимальное допустимое количество соединений пула 
        min: 0,  					// минимальное допустимое количество соединений пула 
		idleTimeoutMillis: 30000 	// время ожидания перед завершением неиспользуемого соединения 
	},
	options: {
		encrypt: true,
		enableArithAbort: true
	}
};

//подключаемся к базе данных
let connection = new mssql.ConnectionPool(config); 
let pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

//экспортируем объект подключения
module.exports = pool; 