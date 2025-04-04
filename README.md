# Anime Recommendation System

An Anime Recommender web app that clusters anime based on collabortive filtering adn displays suggestiosn based on users favorite anime via a web
interface using Jikan API.

## Features

- **Matrix Factorization using PyTorch for user anime-anime rating predictions
- **KMeans clustering** to group similar anime based on learned embeddings
- **Live anime info** using Jikan API for search & detailed animes
- **Personliazed Recomemndations** from users favorite anime
- **Dynamic Image Fetching** for anime visuals

## How it works

1. Model Trainin (PyTorch)
    - Loads user rating data from Kaggle (anime.csv, rating.csv)
    - Applies matrix factorization to learn latent features for users & items
    - Clusters anime embeddings into similar groups using KMeans
    - Store the results into csv
3. Frontend Interface (HTML + JS)
    - Search anime with Jikan API
    - Displays recommended anime from the same cluster
    - Fetches real-time anime details & images
## link to Notebook
Link to [Anime Recommendation Notebook](https://colab.research.google.com/drive/1WqTzwzjoz6W6m4I7ACbczVubPvDWqxnQ?usp=sharing)

## License

MIT License. Feel free to use and expand!

