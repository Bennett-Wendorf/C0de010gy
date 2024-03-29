// Import CSS for this component
import './App.css';

// Do some necessary imports for React to function properly
import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Box } from '@mui/material';

import { Login, Register, Events, Donations, Dashboard, Users, UserAdvanced } from "./pages";
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
    padding: theme.spacing(2.5),
})

const toolbarStyle = (theme) => theme.mixins.toolbar

// Generate the base page layout with the navdrawer
const getBasePageLayout = (useNavElements, element) => {
    return (
        <Box sx={rootStyle}>
            {useNavElements && <NavDrawer />}
            <Box sx={[themeIndependentContextStyle, themeDependentContextStyle]}>
                {useNavElements && <Box sx={toolbarStyle} />}
                {element}
            </Box>
        </Box>
    )
}

function App() {

    useEffect(() => {
        AuthService.fetchRefreshToken().catch(err => {})
    }, [])

    return (
        <Router>
            {/* Create the routes to render certain pages at certain endpoints */}
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={getBasePageLayout(false, <Login />)} />
                <Route path="/register" element={getBasePageLayout(false, <Register />)} />
                <Route path="/dashboard" element={getBasePageLayout(true, <Dashboard />)} />
                <Route path="/events" element={getBasePageLayout(true, <Events />)} />
                <Route path='/donation' element={getBasePageLayout(true, <Donations />)} />
                <Route path="/users" element={getBasePageLayout(true, <Users />)} />
                <Route path="/users/:id" element={getBasePageLayout(true, <UserAdvanced/>)} />
            </Routes>
        </Router>
    );
}

export default App;
