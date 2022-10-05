// Import React stuff
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Import utilities
import logo from "../res/logo.ico";

// Import a bunch of mui components to help build the nav drawer
import { Drawer, CssBaseline, List, Divider, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AnalyticsIcon from '@mui/icons-material/Analytics'

// Define what we want the width of the drawer to be
const drawerWidth = 220;

const rootStyle = {
    display: "flex"
}

const drawerPaperStyle = {
    width: drawerWidth
}

const drawerStyle = (theme) => ({
    [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
    },
    '& .MuiDrawer-paper': drawerPaperStyle
})

const linkStyle =  {
    color: "inherit",
    textDecoration: "none"
}

const logoImgStyle = {
    width: "30px",
    objectFit: "cover",
    marginRight: "20px",
}

const logoStyle = {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    padding: "5px",
    marginLeft: "16px",
    height: "64px",
}

// Create the NavDrawer(sidebar) component
function NavDrawer() {
    const [open, setOpen] = useState(true)
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // TODO: Make this drawer responsive. See https://github.com/mui/material-ui/blob/v5.10.8/docs/data/material/getting-started/templates/dashboard/Dashboard.js
    // Build the actual JSX to build the nav drawer
    return (
        <Box sx={rootStyle}>
            <CssBaseline />
            <Drawer
                sx={drawerStyle}
                variant="permanent"
                anchor="left"
                open={open}
            >
                {/* Generate the title and logo section and add a divider below it */}
                <Box sx={logoStyle}>
                    <Box component="img" sx={logoImgStyle} alt={"logo"} src={logo} />
                    <Box component="h3" sx={{ fontFamily: "hack" }}>C0de010gy</Box>
                </Box>
                <Divider />

                {/* Create the list of buttons for each page and have them link to the proper endpoints */}
                <List>
                    <Link to="/dashboard" style={linkStyle}>
                        <ListItem button key="Dashboard">
                            <ListItemIcon>{<DashboardIcon />}</ListItemIcon>
                            <ListItemText primary="Dashboard"/>
                        </ListItem>
                    </Link>

                    <Link to="/events" style={linkStyle}>
                        <ListItem button key="Events">
                            <ListItemIcon>{<EventIcon />}</ListItemIcon>
                            <ListItemText primary="Events" />
                        </ListItem>
                    </Link>

                    <Link to="/users" style={linkStyle}>
                        <ListItem button key="Users">
                            <ListItemIcon>{<PeopleIcon />}</ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                    </Link>

                    <Link to="/stats" style={linkStyle}>
                        <ListItem button key="Statistics">
                            <ListItemIcon>{<AnalyticsIcon />}</ListItemIcon>
                            <ListItemText primary="Statistics" />
                        </ListItem>
                    </Link>

                </List>
            </Drawer>
        </Box>
    );
}

export default NavDrawer;
