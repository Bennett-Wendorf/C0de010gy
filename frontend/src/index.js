import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Material ui theming stuff
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { cyan, green } from "@mui/material/colors";

// Generate a new theme from mui in dark mode with primary color cyan and secondary color green
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: cyan,
    secondary: green
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ThemeProvider>
  </StyledEngineProvider>
);

