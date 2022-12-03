// React stuff
import React, { useEffect } from "react";

// MUI components
import { AppBar, Toolbar, Typography, Box, CssBaseline, Tooltip, IconButton, Divider, Badge, Snackbar, Alert, Portal } from "@mui/material";

// Menu stuff
import { Menu, MenuItem } from "@mui/material";

// Dialog stuff
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import HelpDialog from "./HelpDialog";

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

const popupMenuMarginStyles = {
    ml: 2,
    mr: 2,
    mb: 1
}

const userNameStyles = (theme) => ({
    color: theme.palette.primary.main,
    fontWeight: "bold",
})

const noMessagesStyles = (theme) => ({
    color: theme.palette.text.disabled,
    fontSize: "0.8rem",
    mt: 1,
})

const readMessageStyles = (theme) => ({
    color: theme.palette.text.disabled,
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

    const userID = useUserStore(state => state.UserID)

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

    return (
        <>
            <Tooltip title="Account" sx={rightButtonFloat}>
                <IconButton aria-label="account" size="large" onClick={openMenu}>
                    <AccountIcon />
                </IconButton>
            </Tooltip>

            {accessToken !== -1 &&
                <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleMenuClose}>
                    <Typography sx={[userNameStyles, popupMenuMarginStyles]}>{fullName}</Typography>
                    <Typography sx={[userNameStyles, popupMenuMarginStyles]}>{userID}</Typography>
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

function Message({ message, updateMessages, setErrorSnackbarMessage, setIsErrorSnackbarOpen, setSelectedMessage, setIsMessageDetailsDialogOpen }) {

    const toggleMessageRead = () => {
        api.put(`api/messages/${message.MessageID}`)
            .then(() => {
                updateMessages()
            })
            .catch((err) => {
                setErrorSnackbarMessage(err.response?.data?.message ? err.response.data.message : err.message)
                setIsErrorSnackbarOpen(true)
            })
    }

    const selectMessage = () => {
        setSelectedMessage(message)
        setIsMessageDetailsDialogOpen(true)
    }

    return (
        <Grid2 container spacing={2} columns={24}>
            <Grid2 item xs={3} sx={verticalAlignStyles}>
                {message.Read ?
                    <IconButton
                        sx={{ ml: 0.5, mr: 0.5, width: "3ch" }}
                        aria-label={`Mark message unread: ${message.Title}`} size="small" onClick={toggleMessageRead}>
                        <Tooltip title="Mark as Unread">
                            <MarkunreadIcon fontSize="inherit" sx={readMessageStyles} />
                        </Tooltip>
                    </IconButton> :
                    <IconButton
                        sx={{ ml: 0.5, mr: 0.5, width: "3ch" }}
                        aria-label={`Mark message read: ${message.Title}`} size="small" onClick={toggleMessageRead}>
                        <Tooltip title="Mark as Read">
                            <MarkEmailReadIcon fontSize="inherit" />
                        </Tooltip>
                    </IconButton>
                }
            </Grid2>
            <Grid2 item xs={21}>
                <MenuItem onClick={selectMessage}>
                    <Grid2 container spacing={0}>
                        <Grid2 item xs={12}>
                            <Typography sx={message.Read ? [messageTitleStyles, readMessageStyles] : messageTitleStyles}>{message.Title}</Typography>
                        </Grid2>
                        {!message.Read &&
                            <Grid2 item xs={12}>
                                <Typography noWrap sx={messageContentStyles}>{message.Content}</Typography>
                            </Grid2>
                        }
                    </Grid2>
                </MenuItem>
            </Grid2>
        </Grid2>
    )
}

function MessagesMenu() {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);

    const [messages, setMessages] = React.useState([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = React.useState(messages.length);
    const [selectedMessage, setSelectedMessage] = React.useState(null);

    const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false);
    const [errorSnackbarMessage, setErrorSnackbarMessage] = React.useState("");

    const [isMessageDetailsDialogOpen, setIsMessageDetailsDialogOpen] = React.useState(false);
    const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = React.useState(false);

    // Handle menu opening and closing by setting the menu anchor
    const openMenu = (event) => {
        setMenuAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuAnchorEl(null)
    }

    const deleteSelectedMessage = () => {
        api.delete(`api/messages/${selectedMessage.MessageID}`)
            .then(() => {
                updateMessages()
                setIsMessageDetailsDialogOpen(false)
                setIsDeleteConfirmationDialogOpen(false)
            })
            .catch((err) => {
                setErrorSnackbarMessage(err.response?.data?.message ? err.response.data.message : err.message)
                setIsErrorSnackbarOpen(true)
                setIsDeleteConfirmationDialogOpen(false)
            })
    }

    useEffect(() => {
        setUnreadMessagesCount(messages.filter(m => !m.Read).length)
    }, [messages])

    const updateMessages = () => {
        api.get("/api/messages/me")
            .then((response) => {
                setMessages(response.data.messages)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        updateMessages()
    }, [])

    return (
        <>
            <Tooltip title="Messages" sx={rightButtonFloat}>
                <IconButton aria-label={`${unreadMessagesCount} messages`} size="large" onClick={openMenu}>
                    <Badge badgeContent={unreadMessagesCount} color="secondary">
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
                        minWidth: '30ch',
                        maxWidth: '30ch'
                    },
                }}
            >
                <Grid2 container spacing={2}>
                    <Grid2 item xs={10}>
                        <Typography sx={[userNameStyles, popupMenuMarginStyles]}>Messages</Typography>
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
                    <Message
                        key={message.MessageID}
                        message={message}
                        updateMessages={updateMessages}
                        setErrorSnackbarMessage={setErrorSnackbarMessage}
                        setIsErrorSnackbarOpen={setIsErrorSnackbarOpen}
                        setSelectedMessage={setSelectedMessage}
                        setIsMessageDetailsDialogOpen={setIsMessageDetailsDialogOpen}
                    />
                ))}
                {messages.length === 0 &&
                    <Typography sx={[popupMenuMarginStyles, noMessagesStyles]}>No messages</Typography>
                }
            </Menu>

            <Dialog open={isMessageDetailsDialogOpen} onClose={() => setIsMessageDetailsDialogOpen(false)} maxWidth={'xs'} fullWidth>
                <DialogTitle>
                    Viewing Message
                    <HelpDialog usedInDialog={true} messages={[
                        `This is a message you've received.`,
                        `You can delete this message by clicking the "Delete" button or close the dialog and go back to the message with the "Close" button.`,
                        `Contact the organization if you have questions about what this particular message means.`,
                    ]} />
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid2 container spacing={2} columns={24}>
                        <Grid2 item xs={5}>
                            <Typography sx={{ fontWeight: 'bold' }}>Title:</Typography>
                        </Grid2>
                        <Grid2 item xs={19}>
                            <Typography>{selectedMessage?.Title ?? "No message selected"}</Typography>
                        </Grid2>
                        <Grid2 item xs={5}>
                            <Typography sx={{ fontWeight: 'bold' }}>Content:</Typography>
                        </Grid2>
                        <Grid2 item xs={19}>
                            <Typography>{selectedMessage?.Content ?? "No message selected"}</Typography>
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteConfirmationDialogOpen(true)} color="error">Delete Message</Button>
                    <Button onClick={() => setIsMessageDetailsDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteConfirmationDialogOpen} onClose={() => setIsDeleteConfirmationDialogOpen(false)}>
                <DialogTitle>
                    Delete?
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the message titled "{selectedMessage?.Title ?? "No message selected"}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteConfirmationDialogOpen(false)}>Cancel</Button>
                    <Button onClick={deleteSelectedMessage} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Portal> {/* This shouldn't be needed, but it prevents the snackbar from rendering behind the nav drawer */}
                <Snackbar open={isErrorSnackbarOpen} autoHideDuration={6000} onClose={() => setIsErrorSnackbarOpen(false)}>
                    <Alert onClose={() => setIsErrorSnackbarOpen(false)} severity="error" sx={{ width: '100%' }} variant="outlined">
                        {errorSnackbarMessage}
                    </Alert>
                </Snackbar>
            </Portal>
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
