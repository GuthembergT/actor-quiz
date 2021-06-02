// document.querySelector('button').addEventListener('click', () => {
//     const movie = { title: '', id: 0}, cast = [];
//     const randomizer = (range, starting = 0) => Math.floor(Math.random() * range + starting);
//     const pageNumber = randomizer(500, 1);
//     const moviePicker = randomizer(20);
//     const url = `https://api.themoviedb.org/3/discover/movie?api_key=8deb316531f0402d370845656051e8a3&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
//     fetch(url).then(apiResponse => apiResponse.json()).then(apiData => {
//         // console.log(apiData)
//         // console.log(apiData.results[moviePicker]);
//         movie.title = apiData.results[moviePicker].title;
//         movie.id = apiData.results[moviePicker].id;
//         console.log(movie);
//         const castUrl =0 `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=8deb316531f0402d370845656051e8a3&language=en-US`
//         fetch(castUrl).then(secondAPIResponse => secondAPIResponse.json()).then(secondAPIData => {
//             // console.log(secondAPIData);
//             secondAPIData.cast.forEach(member => cast.push(member.name));
//             console.log(cast);
//         })
//     });
// })
const outcome = document.querySelector('#outcome');
document.querySelector('#submit').addEventListener('click', (e) => {
    e.preventDefault();
    const choicesList = Array.from(e.target.closest('form').querySelectorAll('input'));
    const answer = movieIds(choicesList);
    const playersChoices = choicesList.filter(el => { if(el.checked) return el; });
    outcome.innerText = playersChoices.length === 3 ? displayOutcome(verifyChoices(playersChoices, answer)) : notRightAmountOfChoices(playersChoices.length);
})

document.querySelector('#anotherQuestion').addEventListener('click', (e) => { 
    e.preventDefault(); 
    Array.from(e.target.closest('form').querySelectorAll('input')).forEach(i => i.checked = false);
    window.location.reload();
    console.log('YAY!');
});

function movieIds(arr) {
    const ids = {};
    arr.forEach(el => { if(el.value in ids) ids[el.value]++; else ids[el.value] = 1});
    for(p in ids)
        if(ids[p] === 3)
            return p;
}

function notRightAmountOfChoices(arrLen) {
    switch(arrLen) {
        case 0: return 'You did not choose any actors';
        case 1: case 2: return `You only chose ${arrLen} actor${arrLen < 2 ? '' : 's'}`;
        case 4: case 5: return 'You chose more than 3 actors';
    }
}

function verifyChoices(usersArr, answerId) {
    return usersArr.reduce((acc, el) => el.value === answerId ? acc+1 : acc, 0)
}

function displayOutcome(correct) {
    switch(correct) {
        case 0: case 1: case 2: return `You got ${correct} of the 3 actors correct!`;
        case 3: return `Congrats! You got all 3 actors correct!`
    }
}