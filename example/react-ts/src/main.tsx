import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import StoreAPI from "./storeService/StoreAPI.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StoreAPI>
    <App />
  </StoreAPI>,
);
