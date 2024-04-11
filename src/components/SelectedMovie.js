import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useKey } from "./useKey";

export default function SelectedMovie({
  selectedId,
  omdbKey,
  onAddWatched,
  watched,
  onChangeRating,
  onCloseDetails,
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

  const countRef = useRef(0);

  useEffect(
    function () {
      if (myRating) countRef.current += 1;
      console.log(countRef.current);
    },
    [myRating]
  );

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

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
      setMyRaiting(0);
    },
    [selectedId, omdbKey]
  );

  useEffect(() => {
    if (!title) return;
    document.title = "usePopcorn: " + title;

    return () => (document.title = "usePopcorn"); // Cleanup/очистка после Эффекта
  }, [title]);

  useKey("Escape", onCloseDetails);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: myRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    setMyRaiting(0);
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
            defaultRating={watchedUserRating > 0 ? watchedUserRating : null}
            onSetRating={setMyRaiting}
          />
          {(myRating > 0) & !watchedUserRating ? (
            <button className="btn-add" onClick={handleAdd}>
              Добавить в список
            </button>
          ) : watchedUserRating ? (
            <button className="btn-add" onClick={handleChange}>
              Изменить рейтинг
            </button>
          ) : null}
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
