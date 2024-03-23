import { useEffect, useState } from "react";
import StarRating from "./StarRating";

export default function SelectedMovie({
  selectedId,
  omdbKey,
  onAddWatched,
  watched,
  onChangeRating,
}) {
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

  const [myRating, setMyRaiting] = useState(0);
  const [watchedRating, setWatchedRating] = useState(0);

  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${omdbKey}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        const defRating = watched.find((movie) => movie.imdbID === selectedId)
          ? movie.userRating
          : 0;
        setWatchedRating(defRating);

        console.log(defRating);
      }
      getMovieDetails();
    },
    [selectedId, omdbKey]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: myRating,
    };

    onAddWatched(newWatchedMovie);
  }

  function handleChange() {
    const movie = {
      imdbID: selectedId,
      userRating: myRating,
    };
    onChangeRating(movie);
  }

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
            defaultRating={
              watchedRating > 0 ? watchedRating : Math.round(imdbRating)
            }
            onSetRating={setMyRaiting}
          />
          {watchedRating < 1 ? (
            myRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
                Добавить в список
              </button>
            )
          ) : (
            <button className="btn-add" onClick={handleChange}>
              Изменить рейтинг
            </button>
          )}
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
