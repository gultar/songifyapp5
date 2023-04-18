import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ song }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleFavourite = (e) => {
    setIsFavorite(e.target.checked);
    console.log('Is favorite?',e.target.checked)
    if (e.target.checked) {
      addToFavorites(song);
    } else {
      removeFromFavorites(song);
    }
  };

  function addToFavorites(song) {
    setFavorites([...favorites, song]);
  }

  function removeFromFavorites(song) {
    const updatedFavorites = favorites.filter((favorite) => favorite.id !== song.id);
    setFavorites(updatedFavorites);
  }

  return (
    <label>
      Add to favorites:
      <input
        type="checkbox"
        checked={isFavorite}
        onChange={handleFavourite}
      />
    </label>
  );
};

export default FavoriteButton;
