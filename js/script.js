const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTgyOTUxMzViNzYwOTdiZWM5Yjk3NDJmMTQyNGIwOSIsIm5iZiI6MTczOTk1ODgyNC4zMjQsInN1YiI6IjY3YjVhYTI4ZDI4ZTg3ZTBlNWUzYjk3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qtexsioa7wxAPM9JcsrAdIi3YEFvCt3BmMVO0RW62Fs';


document.getElementById('search-bar').addEventListener('input', function() {
    const query = this.value.trim();
    if (query.length > 2) {
        searchMoviesAndSeries(query);
    } else {
        document.getElementById('search-results').innerHTML = '';
    }
});

function searchMoviesAndSeries(query) {
    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=fr-FR`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => displaySearchResults(data.results))
        .catch(error => console.error('Erreur lors de la recherche:', error));
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    const limitedResults = results.slice(0, 5); // Limite à 5 résultats

    limitedResults.forEach(item => {
        const title = item.title || item.name;
        const releaseDate = item.release_date || item.first_air_date;
        const posterPath = item.poster_path;
        const mediaType = item.media_type;

        if (posterPath && (mediaType === 'movie' || mediaType === 'tv')) {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.innerHTML = `
                <a href="./pages/detail.html?id=${item.id}&type=${mediaType}" class="media-link" style="text-decoration: none;">
                    <img src="https://image.tmdb.org/t/p/w500${posterPath}" alt="${title}">
                    <div class="Detail-Box">
                        <h2 class="Title">${title}</h2>
                        <p class="Date">${formatDate(releaseDate)}</p>
                    </div>
                </a>
            `;
            searchResultsContainer.appendChild(resultItem);
        }
    });
}







function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/\//g, ' ');
}

function updateCardSection(items, sectionId, type) {
    const cardSection = document.querySelector(`#${sectionId} .Card-Section`);
    cardSection.innerHTML = '';

    items.forEach(item => {
        const title = item.title || item.name;
        const releaseDate = item.release_date || item.first_air_date;
        const posterPath = item.poster_path;
        const voteAverage = Math.round(item.vote_average * 10);
        const formattedDate = formatDate(releaseDate);
        const mediaType = item.media_type !== 'movie' && item.media_type !== 'tv' ? 'tv' : item.media_type;

        cardSection.innerHTML += `
            <div class="Card-Box">
                <a href="./pages/detail.html?id=${item.id}&type=${mediaType}" class="media-link">
                    <img src="https://image.tmdb.org/t/p/w500${posterPath}" alt="${title}">
                    <div class="Detail-Box">
                        <h2 class="Title">${title}</h2>
                        <p class="Date">${formattedDate}</p>
                    </div>
                    <svg class="Like-Box" xmlns="http://www.w3.org/2000/svg" width="63" height="63" viewBox="0 0 63 63" fill="none">
                        <circle cx="31.5" cy="31.5" r="30.5" fill="#032541" stroke="white" stroke-width="2"/>
                    </svg>
                    <p class="Like-Text">${voteAverage}%</p>
                </a>
            </div>
        `;
    });
}

function fetchData(url, sectionId, type) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => updateCardSection(data.results.slice(0, 4), sectionId, type))
    .catch(error => console.error(`Erreur lors de la récupération des données:`, error));
}

const dailyTrendingButton = document.querySelector('#td');
const weeklyTrendingButton = document.querySelector('#week');
const topRatedTVShowsButton = document.querySelector('#top');
const popularTVShowsButton = document.querySelector('#pop');

dailyTrendingButton.addEventListener('click', () => {
    fetchData('https://api.themoviedb.org/3/trending/all/day?language=fr-FR', 'tendance', 'movie');
    dailyTrendingButton.classList.add('active');
    weeklyTrendingButton.classList.remove('active');
});

weeklyTrendingButton.addEventListener('click', () => {
    fetchData('https://api.themoviedb.org/3/trending/all/week?language=fr-FR', 'tendance', 'movie');
    weeklyTrendingButton.classList.add('active');
    dailyTrendingButton.classList.remove('active');
});

topRatedTVShowsButton.addEventListener('click', () => {
    fetchData('https://api.themoviedb.org/3/tv/top_rated?language=fr-FR', 'Series', 'tv');
    topRatedTVShowsButton.classList.add('active');
    popularTVShowsButton.classList.remove('active');
});

popularTVShowsButton.addEventListener('click', () => {
    fetchData('https://api.themoviedb.org/3/tv/popular?language=fr-FR', 'Series', 'tv');
    popularTVShowsButton.classList.add('active');
    topRatedTVShowsButton.classList.remove('active');
});

fetchData('https://api.themoviedb.org/3/trending/all/day?language=fr-FR', 'tendance', 'movie');
fetchData('https://api.themoviedb.org/3/tv/top_rated?language=fr-FR', 'Series', 'tv');