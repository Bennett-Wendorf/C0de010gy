// React stuff
import React, { useEffect } from "react";

// MUI components
import { AppBar, Toolbar, Typography, Box, CssBaseline, Tooltip, IconButton, Divider, Badge } from "@mui/material";

// Menu stuff
import { Menu, MenuItem } from "@mui/material";

// Dialog stuff
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import AccountIcon from '@mui/icons-material/AccountCircle';
import NotificationIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import RefreshIcon from '@mui/icons-material/Refresh';

import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import useUserStore from "../utils/Stores";
import api from "../utils/api";

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

const messageTitleStyles = (theme) => ({
    color: theme.palette.text.primary,
    fontWeight: "bold",
    fontSize: "0.9rem",
})

const messageContentStyles = (theme) => ({
    color: theme.palette.text.disabled,
    fontSize: "0.8rem",
})

const verticalAlignStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
        navigate(`/users/${userID}`)
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
    const userID = useUserStore(state => state.UserID)

    return (
        <>
            <Tooltip title="Account" sx={rightButtonFloat}>
                <IconButton aria-label="account" size="large" onClick={openMenu}>
                    <AccountIcon />
                </IconButton>
            </Tooltip>

            {accessToken !== -1 &&
                <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleMenuClose}>
                    <Typography sx={userNameStyles}>{fullName}</Typography>
                    <Divider />
                    <MenuItem onClick={handleAccountClick}>My Account</MenuItem>
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

function Message({ message, updateMessages }) {

    const markMessageRead = () => {
        api.delete(`api/messages/${message.MessageID}`)
            .then(() => {
                updateMessages()
            })
            .catch((err) => {
                console.log(err) // TODO: Handle error
            })
    }

    const markMessageUnread = () => {
        api.put(`api/messages/${message.MessageID}`)
            .then(() => {
                updateMessages()
            })
            .catch((err) => {
                console.log(err) // TODO: Handle error
            })
    }


    return (
        <Grid2 container spacing={2} columns={24}>
            <Grid2 item xs={3} sx={verticalAlignStyles}>
                {message.Read ?
                    <IconButton
                        sx={{ ml: 0.5, mr: 0.5, width: "3ch" }}
                        aria-label={`Mark message unread: ${message.Title}`} size="small" onClick={markMessageUnread}>
                        <Tooltip title="Mark as Unread">
                            <MarkunreadIcon fontSize="inherit" />
                        </Tooltip>
                    </IconButton> :
                    <IconButton
                        sx={{ ml: 0.5, mr: 0.5, width: "3ch" }}
                        aria-label={`Mark message read: ${message.Title}`} size="small" onClick={markMessageRead}>
                        <Tooltip title="Mark as Read">
                            <MarkEmailReadIcon fontSize="inherit" />
                        </Tooltip>
                    </IconButton>
                }
            </Grid2>
            <Grid2 item xs={21}>
                {/* <MenuItem> */}
                    <Grid2 container spacing={0}>
                        <Grid2 item xs={12}>
                            <Typography sx={messageTitleStyles}>{message.Title}</Typography>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Typography noWrap sx={messageContentStyles}>{message.Content}</Typography>
                        </Grid2>
                    </Grid2>
                {/* </MenuItem> */}
            </Grid2>
        </Grid2>
    )
}

function MessagesMenu() {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);

    const [messages, setMessages] = React.useState([]);

    // Handle menu opening and closing by setting the menu anchor
    const openMenu = (event) => {
        setMenuAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuAnchorEl(null)
    }

    const updateMessages = () => {
        api.get("/api/messages/me")
            .then((response) => {
                setMessages(response.data.messages)
            })
            .catch((error) => {
                console.log(error) // TODO: Handle this error properly
            })
    }

    useEffect(() => {
        updateMessages()
    }, [])

    return (
        <>
            <Tooltip title="Messages" sx={rightButtonFloat}>
                <IconButton aria-label={`${messages.length} messages`} size="large" onClick={openMenu}>
                    <Badge badgeContent={messages.length} color="secondary">
                        <NotificationIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        maxHeight: 300,
                        maxWidth: '30ch'
                    },
                }}
            >
                <Grid2 container spacing={2}>
                    <Grid2 item xs={10}>
                        <Typography sx={userNameStyles}>Messages</Typography>
                    </Grid2>
                    <Grid2 item xs={2}>
                        <IconButton
                            aria-label="Refresh messages" size="small" onClick={updateMessages}>
                            <Tooltip title="Refresh">
                                <RefreshIcon fontSize="inherit" />
                            </Tooltip>
                        </IconButton>
                    </Grid2>
                </Grid2>
                <Divider />
                {messages.map((message) => (
                    <Message message={message} updateMessages={updateMessages} key={message.MessageID} />
                ))}
            </Menu>
        </>
    )
}


// Create the bar component to be used on every page
function Bar(props) {

    const accessToken = useUserStore(state => state.AccessToken)

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
                        {accessToken !== -1 && <MessagesMenu />}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Bar;
