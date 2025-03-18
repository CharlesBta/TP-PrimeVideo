const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTgyOTUxMzViNzYwOTdiZWM5Yjk3NDJmMTQyNGIwOSIsIm5iZiI6MTczOTk1ODgyNC4zMjQsInN1YiI6IjY3YjVhYTI4ZDI4ZTg3ZTBlNWUzYjk3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qtexsioa7wxAPM9JcsrAdIi3YEFvCt3BmMVO0RW62Fs';

// Fonction pour formater la date en français
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options).replace(/\//g, ' ');
}

// Fonction pour mettre à jour le HTML de la section des cartes
function updateCardSection(items, sectionId) {
    const cardSection = document.querySelector(`#${sectionId} .Card-Section`);
    cardSection.innerHTML = ''; // Réinitialiser le contenu

    items.forEach(item => {
        const title = item.title || item.name;
        const releaseDate = item.release_date || item.first_air_date;
        const posterPath = item.poster_path;
        const voteAverage = item.vote_average;

        const roundedVoteAverage = Math.round(voteAverage * 10);
        const formattedDate = formatDate(releaseDate);

        const cardHTML = `
      <div class="Card-Box">
        <a href="./pages/detail.html?id=${item.id}&type=movie" class="media-link">
        <img src="https://image.tmdb.org/t/p/w500${posterPath}" alt="${title}">
        <div class="Detail-Box">
          <h2 class="Title">${title}</h2>
          <p class="Date">${formattedDate}</p>
        </div>
        <svg class="Like-Box" xmlns="http://www.w3.org/2000/svg" width="63" height="63" viewBox="0 0 63 63" fill="none">
          <circle cx="31.5" cy="31.5" r="30.5" fill="#032541" stroke="white" stroke-width="2"/>
        </svg>
        <p class="Like-Text">${roundedVoteAverage}%</p>
      </div>
    `;

        cardSection.innerHTML += cardHTML;
    });
}
// Fonction pour récupérer les tendances du jour
function fetchDailyTrending() {
    fetch('https://api.themoviedb.org/3/trending/movie/day?language=fr-FR', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => updateCardSection(data.results.slice(0, 4), 'tendance'))
        .catch(error => console.error('Erreur lors de la récupération des tendances du jour:', error));
}

// Fonction pour récupérer les tendances de la semaine
function fetchWeeklyTrending() {
    fetch('https://api.themoviedb.org/3/trending/movie/week?language=fr-FR', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => updateCardSection(data.results.slice(0, 4), 'tendance'))
        .catch(error => console.error('Erreur lors de la récupération des tendances de la semaine:', error));
}

// Fonction pour récupérer les séries les mieux notées
function fetchTopRatedTVShows() {
    fetch('https://api.themoviedb.org/3/tv/top_rated?language=fr-FR', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => updateCardSection(data.results.slice(0, 4), 'Series'))
        .catch(error => console.error('Erreur lors de la récupération des séries les mieux notées:', error));
}

// Fonction pour récupérer les séries les plus populaires
function fetchPopularTVShows() {
    fetch('https://api.themoviedb.org/3/tv/popular?language=fr-FR', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => updateCardSection(data.results.slice(0, 4), 'Series'))
        .catch(error => console.error('Erreur lors de la récupération des séries les plus populaires:', error));
}


// Exemple d'appel de fonction
fetchDailyTrending(); //
fetchTopRatedTVShows(); //

const dailyTrendingButton = document.querySelector('#td');
const weeklyTrendingButton = document.querySelector('#week');
const topRatedTVShowsButton = document.querySelector('#top');
const popularTVShowsButton = document.querySelector('#pop');

dailyTrendingButton.addEventListener('click', () => {
    fetchDailyTrending();
    dailyTrendingButton.classList.add('active');
    weeklyTrendingButton.classList.remove('active');
});
weeklyTrendingButton.addEventListener('click', () => {;
    fetchWeeklyTrending();
    weeklyTrendingButton.classList.add('active');
    dailyTrendingButton.classList.remove('active');
});

topRatedTVShowsButton.addEventListener('click', () => {
    fetchTopRatedTVShows();
    topRatedTVShowsButton.classList.add('active');
    popularTVShowsButton.classList.remove('active');
});
popularTVShowsButton.addEventListener('click', () => {;
    fetchPopularTVShows();
    popularTVShowsButton.classList.add('active');
    topRatedTVShowsButton.classList.remove('active');
});