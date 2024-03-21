import { useEffect, useState } from "react";
import StarRating from "./StarRating";

export default function SelectedMovie({ selectedId, omdbKey, onSetRating }) {
  const [movie, setMovie] = useState({});

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${omdbKey}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  //console.log(imdbRating);

  return (
    <div className="details">
      <header>
        <img src={poster} alt={`Афиша фильма ${title}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span> {imdbRating} IMDb Rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating
            maxRating={10}
            size={24}
            defaultRating={Math.round(imdbRating)}
            onSetRating={onSetRating}
          />
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Актёры: {actors}</p>
        <p>Режиссёр {director}</p>
      </section>
    </div>
  );
}
