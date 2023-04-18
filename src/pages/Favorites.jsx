import React from "react";

function Favorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  return (
    <div>
      <h1>Favorites</h1>
      <ul>
        {favorites.length > 0
          ? favorites.map((favorite) => (
              <li key={favorite.id}>
                {favorite.title} - {favorite.artist} ({favorite.year}){" "}
              </li>
            ))
          : favorites.map((favorite) => (
              <li key={favorite.id}>
                {favorite.title} - {favorite.artist} ({favorite.year}){" "}
              </li>
            ))}
      </ul>
    </div>
  );
}

export default Favorites;
