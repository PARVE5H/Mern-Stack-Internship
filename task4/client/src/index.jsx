import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import App from "./App";

const root = document.getElementById("root");

// Add error boundary and console logs for debugging
try {
  console.log("Mounting TimeTracker extension...");
  console.log("Root element found:", root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ChakraProvider>
        <ColorModeScript initialColorMode="dark" />
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );

  console.log("TimeTracker extension mounted successfully");
} catch (error) {
  console.error("Error mounting TimeTracker extension:", error);
}
