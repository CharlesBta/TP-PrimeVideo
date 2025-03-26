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

                     const displayActorDetails = (actorId) => {
                         const actorUrl = `https://api.themoviedb.org/3/person/${actorId}?language=fr-FR&append_to_response=movie_credits`;

                         fetchData(actorUrl).then(data => {
                             document.getElementById('actor-profile').src = `https://image.tmdb.org/t/p/w500${data.profile_path}`;
                             document.getElementById('actor-name').innerText = data.name;
                             document.getElementById('actor-biography').innerText = data.biography;

                             const filmsList = document.getElementById('actor-films-list');
                             const films = data.movie_credits.cast.slice(0, 10);

                             if (films.length === 0) {
                                 filmsList.innerHTML = '<p>Aucun film disponible pour cet acteur.</p>';
                             } else {
                                 films.forEach(film => {
                                     const filmElement = document.createElement('div');
                                     filmElement.classList.add('film');

                                     const url = `https://api.themoviedb.org/3/search/multi?query=${film.id}&language=fr-FR`;
                                     fetch(url, {
                                         method: 'GET',
                                         headers: {
                                             'Authorization': `Bearer ${apiKey}`,
                                             'Content-Type': 'application/json'
                                         }
                                     })
                                         .then(response => response.json())
                                         .then(data => {
                                             try{
                                                 if (['movie', 'tv'].includes(data.results[0].media_type)) {
                                                     filmElement.innerHTML = `
                                                     <a href="../pages/detail.html?id=${film.id}&type=${data.results[0].media_type}" class="film-link">
                                                         <img src="https://image.tmdb.org/t/p/w500${film.poster_path}" alt="${film.title}" class="film-poster">
                                                         <h3>${film.title}</h3>
                                                         <p>${new Date(film.release_date).toLocaleDateString('fr-FR', {
                                                         day: 'numeric',
                                                         month: 'short',
                                                         year: 'numeric'
                                                     })}</p>
                                                     </a>
                                                 `;
                                                     filmsList.appendChild(filmElement);
                                                 }
                                             } catch(error) {
                                             }

                                         })
                                         .catch(error => console.error('Erreur lors de la recherche:', error));
                                 });
                             }
                         });
                     };

                     const actorId = new URLSearchParams(window.location.search).get('id');
                     if (actorId) {
                         displayActorDetails(actorId);
                     } else {
                         console.error('Le paramètre ID est manquant dans l\'URL.');
                     }
                 });