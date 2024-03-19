import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App-copy";
import StarRating from "./components/StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/*   <StarRating maxRating={10} defaultRating={5} />
    <StarRating maxRating={5} size="45" color="darkblue" />*/}
  </React.StrictMode>
);
