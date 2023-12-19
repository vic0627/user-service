import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import StoreAPI from "./storeService/StoreAPI.tsx";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <CssBaseline />
    <StoreAPI>
      <Provider store={store}>
        <App />
      </Provider>
    </StoreAPI>
  </>,
);
