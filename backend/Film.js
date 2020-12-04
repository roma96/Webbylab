// класс, описывающий фильм
class Film {

    //атрибуты фильма - название, год выхода, формат, актеры
    constructor(title, releaseYear, format, stars) {
        this.id = Film.counter;
        this.title = title;
        this.releaseYear = releaseYear;
        this.format = format;
        this.stars = stars;
    };
};

//экспортируем модуль
module.exports = Film;