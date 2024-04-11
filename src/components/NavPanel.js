import { useEffect, useRef } from "react";
import { useKey } from "./useKey";

export default function NavPanel({ children, query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    setQuery("");
    inputEl.current.focus();
  });

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement !== inputEl.current && e.code === "Enter") {
          setQuery("");
          inputEl.current.focus();
        }
      }

      document.addEventListener("keypress", callback);
      return () => document.removeEventListener("keypress", callback); //очистка прослушки
    },
    [setQuery]
  );

  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />
      {children}
    </nav>
  );
}
