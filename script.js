const searchBtn = document.getElementById('search-btn');
const animeList = document.getElementById('anime');
const animeDetailsContent = document.querySelector('.anime-details-content');
const animeCloseBtn = document.getElementById('anime-close-btn');
const baseUrl = 'https://api.jikan.moe/v4/anime';

//event listeners
searchBtn.addEventListener('click', getAnimeList);
animeList.addEventListener('click', getAnimeDetails);
animeCloseBtn.addEventListener('click', ()=>{
    animeDetailsContent.parentElement.classList.remove('showAnime');
});
// Get anime list that matches the user's input
function getAnimeList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    console.log(searchInputTxt);

    fetch(`${baseUrl}?q=${encodeURIComponent(searchInputTxt)}`).then(response => response.json()).then(data => {
        if (data.data && data.data.length > 0) {
            const anime = data.data[0]; // Get the first anime in the results
            displayRecommendedAnimes(anime.mal_id); // Display recommendations based on the first anime
        } else {
            animeList.innerHTML = '<p>No results found</p>';
            animeList.classList.add('notFound');
        }
    }).catch(error => console.error('Error fetching anime data:', error));
}

// get details of the anime
function getAnimeDetails(e){
    e.preventDefault();
    if(e.target.classList.contains('anime-btn')){
        let animeItem = e.target.parentElement.parentElement;
        // console.log(animeItem);
        fetch(`${baseUrl}/${animeItem.dataset.id}`)
        .then(response=>response.json())
        .then(data => animeDetailsModal(data.data));
        }
    }

// create a modal

function animeDetailsModal(anime){
    // console.log(anime)
    let genres = anime.genres.map(genre => genre.name).join(', ');
    let html = `
        <h2 class="anime-title">${anime.title}</h2>
                <p class="anime-genre">${genres}</p>
                <div class="anime-story">
                <h3>Story:</h3>
                <p>
                    ${anime.synopsis}
                </p>
                </div>
                <div class="story-img">
                <img src="${anime.images.jpg.small_image_url}" alt="" />
                </div>
                <div class="-link">
                <a href="${anime.url}" target="_blank">Read manga</a>
                </div>
    `;
    animeDetailsContent.innerHTML = html;
    animeDetailsContent.parentElement.classList.add('showAnime');
}


// Display recommended animes based on cluster label
function displayRecommendedAnimes(animeID) {
    fetch('animes.json')
        .then(response => response.json())
        .then(data => {
            const anime = data.find(a => a.anime_id === animeID);
            if (anime) {
                let recommendedAnimes = data.filter(a => a.cluster_label === anime.cluster_label && a.anime_id !== animeID);

                // Sort by rating and take top 6
                recommendedAnimes.sort((a, b) => b.rating - a.rating);
                recommendedAnimes = recommendedAnimes.slice(0, 6);

                let recommendationsHtml = '';
                recommendedAnimes.forEach(anime => {
                    recommendationsHtml += `
                        <div class="anime-item" data-id="${anime.anime_id}">
                            <div class="anime-img">
                                <img src="${anime.image_url || ''}" alt="${anime.name}" />
                            </div>
                            <div class="anime-name">
                                <h3>${anime.name}</h3>
                                <a href="#" class="anime-btn" onclick="getAnimeDetails(${anime.anime_id})">Watch Anime</a>
                            </div>
                        </div>
                    `;
                });
                animeList.innerHTML = recommendationsHtml;
                fetchAndUpdateImages(recommendedAnimes);
            } else {
                animeList.innerHTML = '<p>No recommendations found</p>';
            }
        })
        .catch(error => console.error('Error fetching recommended animes:', error));
}


// Fetch and update images for recommended animes
// Fetch and update images for recommended animes with delay
async function fetchAndUpdateImages(recommendedAnimes) {
    for (let i = 0; i < recommendedAnimes.length; i++) {
        const anime = recommendedAnimes[i];
        try {
            const response = await fetch(`${baseUrl}/${anime.anime_id}`);
            const data = await response.json();
            const animeElement = document.querySelector(`.anime-item[data-id='${anime.anime_id}'] .anime-img img`);
            if (animeElement && data.data.images) {
                animeElement.src = data.data.images.jpg.image_url;
            }
        } catch (error) {
            console.error('Error fetching anime image:', error);
        }

        // Wait 0.5 seconds before the next request
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}