import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import IndexPage from "./pages/IndexPage.tsx";
import "./index.css";
import ActorsPage from "./pages/ActorsPage.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <IndexPage />,
        },
        {
          path: "/actors",
          element: <ActorsPage />,
        },
        {
          path: "/movies",
          element: <IndexPage />,
        },
        {
          path: ":rest",
          element: <IndexPage />
        }
      ])}
    />
  </StrictMode>
);
