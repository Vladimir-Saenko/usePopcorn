import { useState } from "react";
import NavPanel from "./NavPanel";
import MoviesListBox from "./MoviesListBox";
import SearchedMovies from "./SearchedMovies";
import WatchedMovies from "./WatchedMovies";
import WatchedSummary from "./WatchedSummary";
import Loader from "./Loader";
import SelectedMovie from "./SelectedMovie";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const omdbKey = "a45ffb1e"; //Ключ доступа к API omdbapi.com

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    // id === selectedId ? setSelectedId(null) : setSelectedId(id);
    setSelectedId(id === selectedId ? null : id);
  }

  function handleCloseDetails() {
    setSelectedId(null);
  }

  const { movies, isLoading, error } = useMovies(query);

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
