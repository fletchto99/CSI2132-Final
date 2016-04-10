var tmdb = (function() {

    var tmdb = {};

    tmdb.sizes = {
        w92: "w92",
        w154: "w154",
        w185: "w185",
        w342: "w342",
        w500: "w500",
        w780: "w780",
        original: "original"
    };

    tmdb.generateImagePath = function(imagePath, size) {
        return "https://image.tmdb.org/t/p/" + size + "/" +  imagePath;
    };
    
    return tmdb;
})();