// Import CSS for this component
import './App.css';

// Do some necessary imports for React to function properly
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Box } from '@mui/material';

import { Login } from "./pages";

const rootStyle = {
  display: "flex"
}

const themeIndependentContextStyle = {
  flexGrow: 1
}

const themeDependentContextStyle = (theme) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
})

// const toolbarStyle = theme.mixins.toolbar

function App() {
  return (
    <Router>
      <Box sx={rootStyle}>
        {/* <NavDrawer /> */}
        <Box sx={[themeIndependentContextStyle, themeDependentContextStyle]}>
          {/* Create the routes to render certain pages at certain endpoints */}
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
