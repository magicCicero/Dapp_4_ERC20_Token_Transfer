import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme (optional)
const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Blue color
      },
      secondary: {
        main: '#dc004e', // Pink color
      },
    },
  });

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
           <CssBaseline /> {/* Resets browser styling */}
           <App />
        </ThemeProvider>
    </React.StrictMode>
);
