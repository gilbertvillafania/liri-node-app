require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var fs = require('fs');
var request = require('request');
var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var searchValue = "";

//for (var i = 3; i < process.argv.length; i++) {
    //searchValue += process.argv[i] + " ";
//};
searchValue += process.argv.slice(3).join(" ");

function errorFunction(respError) {
    if (respError) {
        return console.log("Error occured: ", respError);
    }
};

// node liri.js concert-this <artist/band name here>
//Name of venue
//Venue location
//Date of the event (use moment to format this as "MM/DD/YYYY")
function searchConcert(searchValue) {

    // Default search value if no artist/band is given --> I went with Coldplay because reasons. Heh.
    if (searchValue == "") {
        searchValue = "Coldplay";
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + searchValue + "/events?app_id=codingbootcamp";


    console.log(queryUrl);
  
    axios.get(queryUrl).then(
      function(response) {
        console.log(response.data[0]);
        console.log("\n++++ BandsInTown Search Results ++++\n");
        console.log("Name of Venue: " + response.data[0].venue.name);
        console.log("Venue Location: " + response.data[0].venue.city);
        console.log("Date of Event: " + response.data[0].datetime);
      }
    );

//     request(queryUrl, function (respError, response, body) {

//         errorFunction();
// function errorFunction(respError) {
//     if (respError) {
//         return console.log("An error occured: ", respError);
//      }
};
//         if (JSON.parse(body).Error == 'No artist(s) or show found!') {

//             console.log("\nI'm sorry, I could not find any artist(s) or shows that matched the title " + searchValue + ". Please check your spelling and try again.\n")} 
            
//             else {

//             concertBody = JSON.parse(body);

//             console.log("\n++++++++++++++++ Bands In Town Search Results ++++++++++++++++\n");
//             console.log("Name of Venue: " + concertBody.venue);
//             console.log("Venue Location: " + concertBody.location);
//             console.log("Date of Event: " + concertBody.date);
//             }
//     });
// };


//node liri.js spotify-this-song '<song name here>'
//Artist(s)
//The songs's name
//The album that the song is from
//A preview link of the song from Spotify

function searchSong(searchValue) {

    // Default search value if no song is given
    if (searchValue == "") {
        searchValue = "The Sign Ace of Base";
    }

    // Accesses Spotify keys  
    var spotify = new Spotify(keys.spotify);

    var searchLimit = "";

    // Allows the user to input the number of returned spotify results, defaults 1 return if no input given
    if (isNaN(parseInt(process.argv[3])) == false) {
        searchLimit = process.argv[3];

        console.log("\nYou requested to return: " + searchLimit + " songs");

        // Resets the searchValue to account for searchLimit
        searchValue = "";
        for (var i = 4; i < process.argv.length; i++) {
            searchValue += process.argv[i] + " ";
        };

    } else {
        console.log("\nFor more than 1 result, add the number of results you would like to be returned after spotify-this-song.\n\nExample: if you would like 3 results returned enter:\n     node.js spotify-this-song 3 The Sign")
        searchLimit = 1;
    }

    // Searches Spotify with given values
    spotify.search({ type: 'track', query: searchValue, limit: searchLimit }, function (respError, response) {


        errorFunction();

        var songResp = response.tracks.items;

        for (var i = 0; i < songResp.length; i++) {
            console.log("\n=============== Spotify Search Result " + (i + 1) + " ===============\n");
            console.log(("Artist: " + songResp[i].artists[0].name));
            console.log(("Song Name: " + songResp[i].name));
            console.log(("Album name: " + songResp[i].album.name));
            console.log(("URL Preview: " + songResp[i].preview_url));
            console.log("\n=========================================================\n");

        }


    })
};


//node liri.js movie-this '<movie name here>'
//Title of the movie.
//Year the movie came out.
//IMDB Rating of the movie.
//Rotten Tomatoes Rating of the movie.
//Country where the movie was produced.
//Language of the movie.
//Plot of the movie.
//Actors in the movie.
function searchMovie(searchValue) {

    // Default search value if no movie is given
    if (searchValue == "") {
        searchValue = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (respError, response, body) {

        errorFunction();

        if (JSON.parse(body).Error == 'Movie not found!') {

            console.log("\nI'm sorry, I could not find any movies that matched the title " + searchValue + ". Please check your spelling and try again.\n")

        } else {

            movieBody = JSON.parse(body);

            console.log("\n++++++++++++++++ OMDB Search Results ++++++++++++++++\n");
            console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);

            // If there is no Rotten Tomatoes Rating
            if (movieBody.Ratings.length < 2) {

                console.log("There is no Rotten Tomatoes Rating for this movie.")

            } else {

                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);

            }

            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
            console.log("\n+++++++++++++++++++++++++++++++++++++++++++++++++\n");
            console.log("xxxx Log Ended xxxx");
        };
    });
};

//node liri.js do-what-it-says
function randomSearch() {

    fs.readFile("random.txt", "utf8", function(respError, data) {

        var randomArray = data.split(", ");

        errorFunction();

        if (randomArray[0] == "spotify-this-song") {
            searchSong(randomArray[1]);
        } else if (randomArray[0] == "movie-this") {
            searchMovie(randomArray[1]);
        } else {
            searchConcert();
        }
    });
};
switch (command) {
    case "concert-this":
        searchConcert(searchValue);
        break;
    case "spotify-this-song":
        searchSong(searchValue);
        break;
    case "movie-this":
        searchMovie(searchValue);
        break;
    case "do-what-it-says":
        randomSearch();
        break;
};