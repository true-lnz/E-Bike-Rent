import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './assets/styles/main.scss';
import { AppProviders } from "./providers/AppProviders";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>
);