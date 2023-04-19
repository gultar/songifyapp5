// import React from "react";

// function Favorites() {
//   const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

//   return (
//     <div>
//       <h1>Favorites</h1>
//       <ul>
//         {favorites.length > 0
//           ? favorites.map((favorite) => (
//               <li key={favorite.id}>
//                 {favorite.title} - {favorite.artist} ({favorite.year}){" "}
//               </li>
//             ))
//           : favorites.map((favorite) => (
//               <li key={favorite.id}>
//                 {favorite.title} - {favorite.artist} ({favorite.year}){" "}
//               </li>
//             ))}
//       </ul>
//     </div>
//   );
// }

// export default Favorites;

import React from "react";

function Favorites() {
    const [favorites, setFavorites] = React.useState(
    JSON.parse(localStorage.getItem("favorites")) || []);

    const handleRemoveFavorite = (id) => {
        const updatedFavorites = favorites.filter((favorite) => favorite.id !== id);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

    return (
        <div className="favorites">
            <h1>Favorites</h1>
            <ul>
                {favorites.length > 0 ? (
                    favorites.map((favorite) => (
                        <li key={favorite.id}>
                            {favorite.title} - {favorite.artist} {" "}
                            <button onClick={() => handleRemoveFavorite(favorite.id)}>X</button>
                        </li>
                    ))
                    ) : (
                    <li>No favorites yet!</li>
                )}
            </ul>
        </div>
    );
}

export default Favorites;
