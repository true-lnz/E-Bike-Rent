import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './assets/styles/main.scss';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider withCssVariables withGlobalClasses>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);