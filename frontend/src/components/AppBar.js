// React stuff
import React from "react";

// MUI components
import { AppBar, Toolbar, Typography, Box, CssBaseline, Tooltip, IconButton, Divider } from "@mui/material";

// Menu stuff
import { Menu, MenuItem } from "@mui/material";

// Dialog stuff
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import AccountIcon from '@mui/icons-material/AccountCircle';
import NotificationIcon from '@mui/icons-material/Notifications';

import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import useUserStore from "../utils/Stores";

const drawerWidth = 220;

const rootStyle = {
    display: "flex",
    flexGrow: 1
}

const appBarStyle = {
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

const userNameStyles = (theme) => ({
    color: theme.palette.primary.main,
    fontWeight: "bold",
    ml: 2,
    mb: 1,
    mr: 2,
})

function AccountMenu() {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false);
    const navigate = useNavigate();

    // Handle menu opening and closing by setting the menu anchor
    const openMenu = (event) => {
        setMenuAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuAnchorEl(null)
    }

    const handleAccountClick = () => {
        console.log("Account clicked")
        handleMenuClose()
    }

    const handleLogoutClick = () => {
        AuthService.logout();
        setIsSuccessDialogOpen(true);
        handleMenuClose()
    }

    const handleLoginClick = () => {
        navigate("/login")
        handleMenuClose()
    }

    const handleSuccessOK = () => {
        setIsSuccessDialogOpen(false)
    }

    const loginRedirect = () => {
        navigate("/login")
    }

    const accessToken = useUserStore(state => state.AccessToken)
    const fullName = useUserStore(state => state.FullName)

    return (
        <>
            {/* TODO: Use the Badge component here for number of notifications */}
            <Tooltip title="Account" sx={rightButtonFloat}>
                <IconButton aria-label="account" size="large" onClick={openMenu}>
                    <AccountIcon />
                </IconButton>
            </Tooltip>

            {accessToken !== -1 &&
                <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleMenuClose}>
                    <Typography sx={userNameStyles}>{fullName}</Typography>
                    <Divider />
                    <MenuItem disabled onClick={handleAccountClick}>My Account</MenuItem>
                    <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                </Menu>
            }
            
            {accessToken === -1 &&
                <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleMenuClose}>
                    <MenuItem onClick={handleLoginClick}>Login</MenuItem>
                </Menu>
            }

            <Dialog open={isSuccessDialogOpen} onClose={handleSuccessOK}>
                <DialogTitle>Successfully Logged Out</DialogTitle>
                <DialogContent>You have been successfully logged out!</DialogContent>
                <DialogActions>
                    <Button onClick={loginRedirect}>Back to Login</Button>
                    <Button onClick={handleSuccessOK}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

// Create the bar component to be used on every page
function Bar(props) {
    // TODO: Add this dialog
    const handleNotificationsOpen = () => {
        console.log("Notifications button clicked")
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
                        <AccountMenu />
                        <Tooltip title="Notifications" sx={rightButtonFloat}>
                            <IconButton disabled aria-label="notifications" size="large" onClick={handleNotificationsOpen}>
                                <NotificationIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Bar;
