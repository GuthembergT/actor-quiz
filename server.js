const express = require('express'),
      bodyParser = require('body-parser'),
      configKey = require('./config/apiKey.js'),
      fetch = require('node-fetch'),
      app = express(),
      port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Connected to port: ${port}!`));
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
    const data = { movie: {}, actors: [], randomOrder: randomOrder()}
    // ====== MOVIE PICKER ==========
    // GET ONLY MOVIE NAME AND ID
        const randomizer = (range, starting = 0) => Math.floor(Math.random() * range + starting);
        const pageNumber = randomizer(500, 1);
        const pickedMovie = randomizer(20);
        const moviesFetchResult = (await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${configKey.key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`)
                                        .then(apiResponse => apiResponse.json()).then(apiData => apiData.results))[pickedMovie];
        data.movie = { title: moviesFetchResult.title, id: moviesFetchResult.id, year: moviesFetchResult['release_date'].slice(0,4)};      
    // ======= 
    // ======= CAST
        let firstIterator = 0, castFetchResult = '';
        do{
            castFetchResult = await fetch(`https://api.themoviedb.org/3/movie/${data.movie.id}/credits?api_key=${configKey.key}&language=en-US`).then(response => response.json()).then(apiData => apiData.cast);
            firstIterator++;
        } while(castFetchResult.length < 4);
        data.actors = castFetchResult.slice(0, 3);
        data.actors.forEach(el => el.movieId = data.movie.id);
        const thirdActorsMovies = await fetch(`https://api.themoviedb.org/3/person/${data.actors[2].id}/movie_credits?api_key=${configKey.key}&language=en-US`).then(response => response.json()).then(apiData => apiData.cast);
        thirdActorsMovies.sort((a, b) => a.popularity - b.popularity);
    // ========
    // ======== DIFFERENT MOVIE CAST
        let secondIterator = 0, otherMovieCastFetch = '';
        do {
            otherMovieCastFetch = await fetch(`https://api.themoviedb.org/3/movie/${thirdActorsMovies[secondIterator].id}/credits?api_key=${configKey.key}&language=en-US`).then(response => response.json()).then(apiData => apiData.cast);
            secondIterator++;
        } while(otherMovieCastFetch.length < 3);
        otherMovieCastFetch.forEach(actor => { if (data.actors.length < 5) if (notInActorList(data.actors, actor.name)) data.actors.push(actor)});
        data.actors[3].movieId = thirdActorsMovies[0].id;
        data.actors[4].movieId = thirdActorsMovies[0].id;
    res.render('index.ejs', data);
});

function randomOrder() {
    const arr = [];
    do{
        const randomValue = Math.floor(Math.random() * 5);
        if(!arr.includes(randomValue))
            arr.push(randomValue);
    }while (arr.length < 5)
    return arr;
}

function notInActorList(arr, name) {
    let notInList = true;
    arr.forEach(actor => { if(actor.name === name) notInList = false; })
    return notInList;
}