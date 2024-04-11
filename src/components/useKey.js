import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      function Callback(e) {
        if (e.code === key) {
          action();
        }
      }

      document.addEventListener("keydown", Callback);

      return () => document.removeEventListener("keydown", Callback); // очистка
    },
    [action, key]
  );
}
