import { useEffect, useState } from "react";
import NavPanel from "./NavPanel";
import MoviesListBox from "./MoviesListBox";
import SearchedMovies from "./SearchedMovies";
import WatchedMovies from "./WatchedMovies";
import WatchedSummary from "./WatchedSummary";
import Loader from "./Loader";
import SelectedMovie from "./SelectedMovie";

const omdbKey = "a45ffb1e"; //Ключ доступа к API omdbapi.com

export default function App() {
  const [movies, setMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [watched, setWatched] = useState(function () {
    const stored = localStorage.getItem("watched");
    return JSON.parse(stored);
  });

  function handleSelectMovie(id) {
    // id === selectedId ? setSelectedId(null) : setSelectedId(id);
    setSelectedId(id === selectedId ? null : id);
  }

  function handleCloseDetails() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    //localStorage("watched", JSON.stringify([...watched, movie]));
  }

  function handleChangeRating(movie) {
    setWatched(
      watched.map((item) =>
        item.imdbID === movie.imdbID
          ? { ...item, userRating: movie.userRating }
          : item
      )
    );
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((item) => item.imdbID !== id));
  }
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${omdbKey}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Ошибка запроса к серверу");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Фильмы не найдены!");

          setMovies(data.Search);
          setIsLoading(false);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseDetails();
      fetchMovies();

      return () => controller.abort();
    },
    [query]
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <NavPanel query={query} setQuery={setQuery}>
        <Results movies={movies} />
      </NavPanel>

      <main className="main">
        <MoviesListBox>
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <SearchedMovies movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {isLoading && <Loader />}
        </MoviesListBox>

        <MoviesListBox>
          {selectedId ? (
            <SelectedMovie
              omdbKey={omdbKey}
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
              watched={watched}
              onChangeRating={handleChangeRating}
              onCloseDetails={handleCloseDetails}
            />
          ) : (
            <>
              <WatchedSummary movies={watched} />
              <WatchedMovies
                movies={watched}
                onDeleteMovie={handleDeleteMovie}
              />{" "}
            </>
          )}
        </MoviesListBox>
      </main>
    </>
  );
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies ? movies.length : 0}</strong> results
    </p>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🚫</span>
      {message}
    </p>
  );
}
