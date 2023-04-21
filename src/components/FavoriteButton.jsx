import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ song }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setIsFavorite(favorites.some((favorite) => favorite.id === song.id));
  }, [favorites, song]);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(song);
    } else {
      addToFavorites(song);
    }
  };

  const addToFavorites = (song) => {
    setFavorites([...favorites, song]);
  };

  const removeFromFavorites = (song) => {
    const updatedFavorites = favorites.filter((favorite) => favorite.id !== song.id);
    setFavorites(updatedFavorites);
  };

  return (
    <label>
      {isFavorite ? (
        <>
          
          <button className="add-favorite-btn" onClick={toggleFavorite}>-</button> Remove from favorites:
        </>
      ) : (
        <>
          
          <button className="add-favorite-btn" onClick={toggleFavorite}>+</button> Add to favorites:
        </>
      )}
    </label>
  );
};

export default FavoriteButton;
