import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
