import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider withCssVariables withGlobalClasses>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);