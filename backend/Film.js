// класс, описывающий фильм
class Film {

    //формат фильма по умолчанию
    static defaultFormat = "DVD";

    //крайние значения возможной даты релиза
    static minReleaseYear = 1850;
    static maxReleaseYear = 2020;

    //атрибуты фильма - название, год выхода, формат, актеры
    constructor(title, releaseYear, format, stars) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.format = format;
        this.stars = stars;
    };

    //геттер даты релиза
    get releaseYear() {
        return this._releaseYear;
    }

    //сеттер даты релиза, который проверяет, чтобы дата была в допустимом диапазоне
    set releaseYear(val) {
        if(val < Film.minReleaseYear) {
            this._releaseYear = Film.minReleaseYear;
        } else if(val > Film.maxReleaseYear) {
            this._releaseYear = Film.maxReleaseYear;
        } else {
            this._releaseYear = val;
        }
    }

    //геттер формата
    get format() {
        return this._format;
    }

    //сеттер формата, который проверяет значение на допустимость
    set format(val) {
        console.log(val);
        if(val == "DVD" || val == "VHS" || val == "Blu-Ray") {
            this._format = val;
        } else {
            this._format = Film.defaultFormat;
        }
    }
};

let f = new Film("Revenant", 30, "VHS", "Leonardo DiCaprio, Tom Hardy");

console.log(f);
console.log(f.releaseYear);

f.releaseYear = 3000;
console.log(f.releaseYear);

//экспортируем модуль
module.exports = Film;