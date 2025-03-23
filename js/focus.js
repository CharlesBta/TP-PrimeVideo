document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGFjZWU2Y2ZmMDBhNTNjYjE1NjE5NWNmNGEyM2M5MyIsIm5iZiI6MTczOTg4NDU0OS4zMjA5OTk5LCJzdWIiOiI2N2I0ODgwNTFlZDQ1Mjg0NTM5ZmI2NTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.xfyeXxd9pqUdNS2U8yLfciBOk5pl6hQvexrXowx6rVI';

    const fetchData = (url) => fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .catch(error => console.error('Erreur lors de la récupération des données:', error));

    const displayMediaDetails = (mediaId, mediaType) => {
        const mediaUrl = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?language=fr-FR&append_to_response=credits,videos`;

        fetchData(mediaUrl).then(data => {
            const banner = document.querySelector('.banner');
            banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;

            document.getElementById('focus-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
            document.getElementById('focus-title').innerText = data.title || data.name;
            document.getElementById('focus-release-date').innerText = new Date(data.release_date || data.first_air_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
            document.getElementById('focus-overview').innerText = data.overview;
            document.getElementById('focus-cast').innerHTML = '';
            document.getElementById('focus-score').innerHTML = Math.round(data.vote_average * 10) + '%';

            const castContainer = document.getElementById('focus-cast');
            const cast = data.credits.cast.slice(0, 8);

            if (cast.length === 0) {
                castContainer.innerHTML = '<div class="actor"><h4>Aucun acteur n\'est disponible pour ce film ou cette série.</h4></div>';
            } else {
                cast.forEach(actor => {
                    const actorElement = document.createElement('div');
                    actorElement.classList.add('actor');
                    actorElement.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="${actor.name}" class="actor-image">
                        <h4>${actor.name}</h4>
                        <span>${actor.character}</span>
                    `;
                    castContainer.appendChild(actorElement);
                });
            }

            // Ajouter la bande-annonce
            const trailer = data.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) {
                document.getElementById('focus-trailer').src = `https://www.youtube.com/embed/${trailer.key}`;
            } else {
                document.querySelector('.trailer-banner h4').style.display = 'block';
                document.querySelector('#focus-trailer').style.display = 'none';
            }
        });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const mediaId = urlParams.get('id');
    const mediaType = urlParams.get('type');

    if (mediaId && mediaType) {
        displayMediaDetails(mediaId, mediaType);
    } else {
        console.error('Les paramètres ID ou type sont manquants dans l\'URL.');
    }
});