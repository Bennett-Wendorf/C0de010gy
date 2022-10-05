// React stuff
import React from "react";
import Children from 'react-children-utilities';

// MUI components
import { AppBar, Toolbar, Typography, Box, CssBaseline, Tooltip, IconButton } from "@mui/material";

import AccountIcon from '@mui/icons-material/AccountCircle';
import NotificationIcon from '@mui/icons-material/Notifications';

const drawerWidth = 220;

const rootStyle = {
    display: "flex",
    flexGrow: 1
}

const appBarStyle = { // TODO: Add that this style should only apply for sm screens and up
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
}

const pageTitleStyle = {
    paddingRight: "20px",
    marginLeft: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1
}

const buttonStyle = {
    minWidth: "250px"
}

const rightButtonFloat = {
    float: "right"
}

// Create the bar component to be used on every page
function appBar(props) {

    // TODO: Add this dialog
    const handleAccountOpen = () => {
        console.log("Account button clicked")
    }

    // TODO: Add this dialog
    const handleNotificationsOpen = () => {
        console.log("Account button clicked")
    }

    // Return the JSX necessary to create the bar, with leftChildren to the left of the title and rightChildren to the right
    return (
        <Box sx={rootStyle}>
            <CssBaseline />
            <AppBar position="fixed" sx={appBarStyle}>
                <Toolbar>
                    <Box sx={buttonStyle}>
                        {props.children}
                    </Box>
                    <Typography sx={pageTitleStyle} variant="h6" noWrap>
                        {props.title}
                    </Typography>
                    <Box sx={buttonStyle}>
                        <Tooltip title="Account" justify="left" sx={rightButtonFloat}>
                            <IconButton aria-label="account" size="large" onClick={handleAccountOpen}>
                                <AccountIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications" justify="left" sx={rightButtonFloat}>
                            <IconButton aria-label="notifications" size="large" onClick={handleNotificationsOpen}>
                                <NotificationIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default appBar;
