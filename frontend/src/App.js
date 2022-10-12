// Import CSS for this component
import './App.css';

// Do some necessary imports for React to function properly
import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Box } from '@mui/material';

import { Login, Register, Events } from "./pages";
import NavDrawer from "./components/NavDrawer";
import AuthService from './services/auth.service';

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

const toolbarStyle = (theme) => theme.mixins.toolbar

const getBasePageLayout = (useNavDrawer, element) => {
    return (
        <Box sx={rootStyle}>
            {useNavDrawer && <NavDrawer />}
            <Box sx={[themeIndependentContextStyle, themeDependentContextStyle]}>
                <Box sx={toolbarStyle} />
                {element}
            </Box>
        </Box>
    )
}

function App() {

    useEffect(() => {
        AuthService.fetchRefreshToken().catch(err => console.log(err.message))
    }, [])

    return (
        <Router>
            {/* Create the routes to render certain pages at certain endpoints */}
            <Routes>
                <Route path="/" element={<Navigate to="/events" />} />
                <Route path="/login" element={getBasePageLayout(false, <Login />)} />
                <Route path="/register" element={getBasePageLayout(false, <Register />)} />
                <Route path="/events" element={getBasePageLayout(true, <Events />)} />
            </Routes>
        </Router>
    );
}

export default App;
