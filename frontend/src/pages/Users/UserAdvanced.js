import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../../utils/api';
import Bar from '../../components/AppBar';
import AuthService from "../../services/auth.service";

import { Tooltip, IconButton, Typography, Dialog, Button, DialogTitle, DialogActions, DialogContent, Paper, Snackbar, Alert } from '@mui/material';

import { Card, CardContent } from '@mui/material';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import Grid2 from '@mui/material/Unstable_Grid2'

import HelpDialog from "../../components/HelpDialog";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PaidIcon from '@mui/icons-material/Paid';
import EditIcon from '@mui/icons-material/Edit';
import EditUserDialog from '../../components/User/EditUserDialog';

// Setup a general format for dates
const dateFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
}

const verticalAlignStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}

const tableHeaderStyles = {
    width: '100%',
    p: 1.5,
}

const barHeight = 62
const userInfoCardHeight = 118
const margin = 45

export function UserAdvanced() {
    const { id } = useParams()

    const [user, setUser] = useState({})
    const [userFetchError, setUserFetchError] = useState(false)
    const [userFetchErrorMessage, setUserFetchErrorMessage] = useState("")

    const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)

    const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false)
    const [isRestoreConfirmationDialogOpen, setIsRestoreConfirmationDialogOpen] = useState(false)
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarError, setSnackbarError] = useState(false)

    const [volunteers, setVolunteers] = useState([])
    const [donations, setDonations] = useState([])

    const [totalVolunteerHours, setTotalVolunteerHours] = useState(0)
    const [totalDonationAmount, setTotalDonationAmount] = useState(0)

    const navigate = useNavigate()

    const userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    // Handle the deletion of a user
    const handleDelete = (user) => {
        api.delete(`/api/users/${user.UserID}`)
            .then(res => {
                if (!userIsAdmin) {
                    AuthService.logout()
                    navigate('/')
                } else {
                    navigate('/users')
                }
                setIsDeleteConfirmationDialogOpen(false)
                setIsSnackbarOpen(true)
                setSnackbarError(false)
                setSnackbarMessage(res.data.message)
            })
            .catch(err => {
                setIsDeleteConfirmationDialogOpen(false)
                setSnackbarError(true)
                setSnackbarMessage(err.response?.data?.message ? err.response.data.message : err.message)
                setIsSnackbarOpen(true)
            })
    }

    // Handle the restoration of a user
    const handleRestore = (user) => {
        api.put(`/api/users/${user.UserID}`)
            .then(res => {
                updateUser()
                setIsRestoreConfirmationDialogOpen(false)
                setIsSnackbarOpen(true)
                setSnackbarError(false)
                setSnackbarMessage(res.data.message)
            })
            .catch(err => {
                setIsRestoreConfirmationDialogOpen(false)
                setSnackbarError(true)
                setSnackbarMessage(err.response?.data?.message ? err.response.data.message : err.message)
                setIsSnackbarOpen(true)
            })
    }

    // Update the user data 
    const updateUser = async () => {
        api.get(`/api/users/${id}`)
            .then((res) => {
                setUser(res.data);
                setVolunteers(res.data?.Volunteers ?? []);
                setDonations(res.data?.Donations ?? []);

                if (res.data?.Volunteers) {
                    let total = 0;
                    res.data?.Volunteers.forEach(volunteer => {
                        total += Math.abs(new Date(volunteer.EndTime) - new Date(volunteer.StartTime)) / 36e5;
                    })
                    setTotalVolunteerHours(total);
                }

                if (res.data?.Donations) {
                    let total = 0;
                    res.data?.Donations.forEach(donation => {
                        total += donation.Amount;
                    })
                    setTotalDonationAmount(total);
                }
            })
            .catch(err => {
                console.log(err.response.data);
                setUserFetchError(true);
                setUserFetchErrorMessage(err?.response?.data?.message || "You do not have permission to view this page.");
            })
    }

    const [containerHeight, setContainerHeight] = useState(window.innerHeight - barHeight - margin - userInfoCardHeight)

    // Update the container height when the window is resized
    useEffect(() => {
        function handleWindowResize() {
            setContainerHeight(window.innerHeight - barHeight - margin - userInfoCardHeight)
        }

        window.addEventListener('resize', handleWindowResize)

        return () => window.removeEventListener('resize', handleWindowResize)
    }, [])

    useEffect(() => {
        updateUser()
    }, [id])

    return (
        <>
            {/* Generate the bar for this page */}
            <Bar title={`User: ${user.FullName ?? "N/A"}`}>
                {user?.Active ?
                    <Tooltip title="Delete User">
                        <IconButton disabled={userFetchError} aria-label="delete" size="large" onClick={() => setIsDeleteConfirmationDialogOpen(true)}>
                            <DeleteOutlineIcon color={!userFetchError ? "error" : ""} />
                        </IconButton>
                    </Tooltip>
                    :
                    <Tooltip title="Reactivate User">
                        <IconButton disabled={userFetchError} aria-label="reactivate" size="large" onClick={() => setIsRestoreConfirmationDialogOpen(true)}>
                            <RestoreFromTrashIcon color={!userFetchError ? "success" : ""} />
                        </IconButton>
                    </Tooltip>
                }
            </Bar>

            {userFetchError && <Typography align="center" variant="h6" color="error">{userFetchErrorMessage}</Typography>}

            {!userFetchError && <>
                <Card elevation={3} sx={[verticalAlignStyles, { pt: 1, mb: 2 }]}>
                    <CardContent>
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={2} sx={verticalAlignStyles}>
                                <Grid2 container spacing={1}>
                                    {user?.UserRoles?.some(role => role.DisplayName === "Administrator") &&
                                        <Grid2 item>
                                            <Tooltip title="Administrator" arrow>
                                                <AdminPanelSettingsIcon color="primary" />
                                            </Tooltip>
                                        </Grid2>
                                    }
                                    {user?.UserRoles?.some(role => role.DisplayName === "Volunteer") &&
                                        <Grid2 item>
                                            <Tooltip title="Volunteer" arrow>
                                                <VolunteerActivismIcon color="primary" />
                                            </Tooltip>
                                        </Grid2>
                                    }
                                    {user?.UserRoles?.some(role => role.DisplayName === "Donor") &&
                                        <Grid2 item>
                                            <Tooltip title="Donor" arrow>
                                                <PaidIcon color="primary" />
                                            </Tooltip>
                                        </Grid2>
                                    }
                                </Grid2>
                            </Grid2>
                            <Grid2 item xs={4} sx={verticalAlignStyles}>
                                <Typography variant="h5" component="h2">
                                    {user.FullName}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {user.Email}
                                </Typography>
                            </Grid2>
                            <Grid2 item xs={2} textAlign="right" sx={verticalAlignStyles}>
                                <Typography variant="h7" component="h3" sx={{ fontWeight: 'bold' }}>
                                    Joined:
                                </Typography>
                            </Grid2>
                            <Grid2 item xs={3} sx={verticalAlignStyles}>
                                <Typography>
                                    {new Date(user.CreatedDateTime).toLocaleDateString("en-US", dateFormatOptions)}
                                </Typography>
                            </Grid2>
                            <Grid2 item xs={1} textAlign="right" sx={verticalAlignStyles}>
                                <IconButton sx={{ width: '3ch' }} aria-label="edit" size="medium" onClick={() => setIsEditUserDialogOpen(true)}>
                                    <EditIcon color="primary" />
                                </IconButton>
                            </Grid2>
                        </Grid2>
                    </CardContent>
                </Card>

                <Grid2 container spacing={2}>
                    <Grid2 item xs={6}>
                        <TableContainer component={Paper} sx={{ height: `${containerHeight}px` }}>
                            <Grid2 container spacing={1} sx={tableHeaderStyles}>
                                <Grid2 item xs={12} textAlign="center">
                                    <Grid2 container spacing={0}>
                                        <Grid2 item xs={1} />
                                        <Grid2 item xs={10}>
                                            <Typography variant="h5">
                                                Volunteer Slots
                                            </Typography>
                                        </Grid2>
                                        <Grid2 item xs={1}>
                                            <HelpDialog usedInDialog={false} messages={[
                                                `This list shows all volunteer slots taken by this user.`,
                                                `In addition, you can see the approximate time spent volunteering, rounded down to the nearest hour.`,
                                            ]} />
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                                <Grid2 item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        {volunteers.length} total
                                    </Typography>
                                </Grid2>
                                <Grid2 item xs={6} textAlign="right">
                                    <Typography variant="body2" color="text.secondary">
                                        ~{totalVolunteerHours} total hours
                                    </Typography>
                                </Grid2>
                            </Grid2>
                            <Table aria-label="Events" stickyHeader>
                                {/* Generate the headers of the rows */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event Summary</TableCell>
                                        <TableCell align="right">Start Time</TableCell>
                                        <TableCell align="right">End Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Map each event from the volunteer to a row in the table */}
                                    {volunteers.filter(v => !v.Cancelled).map((volunteer) => (
                                        <TableRow
                                            key={volunteer.VolunteerID}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{volunteer.Event?.Summary}</TableCell>
                                            <TableCell align="right" size="small">{new Date(volunteer.StartTime).toLocaleString("en-US", dateFormatOptions)}</TableCell>
                                            <TableCell align="right" size="small">{new Date(volunteer.EndTime).toLocaleDateString("en-US", dateFormatOptions)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <TableContainer component={Paper} sx={{ height: `${containerHeight}px` }}>
                            <Grid2 container spacing={1} sx={tableHeaderStyles}>
                                <Grid2 item xs={12} textAlign='center'>
                                    <Grid2 container spacing={0}>
                                        <Grid2 item xs={1} />
                                        <Grid2 item xs={10}>
                                            <Typography variant="h5">
                                                Donations
                                            </Typography>
                                        </Grid2>
                                        <Grid2 item xs={1}>
                                            <HelpDialog usedInDialog={false} messages={[
                                                `This list shows all donations made by this user.`,
                                                `In addition, you can see the total amount donated.`,
                                            ]} />
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                                <Grid2 item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        {donations.length} total
                                    </Typography>
                                </Grid2>
                                <Grid2 item xs={6} textAlign="right">
                                    <Typography variant="body2" color="text.secondary">
                                        ${totalDonationAmount} total
                                    </Typography>
                                </Grid2>
                            </Grid2>
                            <Table aria-label="Events" stickyHeader>
                                {/* Generate the headers of the rows */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event Summary</TableCell>
                                        <TableCell align="left">Date Donated</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Map each donation from the backend to a row in the table */}
                                    {donations.map((donation) => (
                                        <TableRow
                                            key={donation.DonationID}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{!(donation.Event?.Cancelled ?? true) ? donation.Event?.Summary : "General Donation"}</TableCell>
                                            <TableCell align="left" size="small">{new Date(donation.CreatedDateTime).toLocaleString("en-US", dateFormatOptions)}</TableCell>
                                            <TableCell align="right" size="small">$ {donation.Amount.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Grid2>
                </Grid2>
            </>}

            {/* Create the dialog for confirming user deletion */}
            <Dialog open={isDeleteConfirmationDialogOpen} onClose={() => setIsDeleteConfirmationDialogOpen(false)}>
                <DialogTitle>
                    <Typography variant="h6" component="h2">
                        Are you sure you want to delete this user?
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        This will disable the user's account and they will not be able to log in.
                    </Typography>
                    {!userIsAdmin &&
                        <Typography variant="body1">
                            This action will also log you out.
                        </Typography>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteConfirmationDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleDelete(user)} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Create the dialog for confirming user restoration */}
            <Dialog open={isRestoreConfirmationDialogOpen} onClose={() => setIsRestoreConfirmationDialogOpen(false)}>
                <DialogTitle>
                    <Typography variant="h6" component="h2">
                        Are you sure you want to reactivate this user?
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        This will restore the user's account and allow them to log in again.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsRestoreConfirmationDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleRestore(user)} color="success">Confirm</Button>
                </DialogActions>
            </Dialog>

            <EditUserDialog open={isEditUserDialogOpen} setOpen={setIsEditUserDialogOpen} user={user} setUser={setUser}/>

            {/* Create the alert snackbar */}
            <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
                <Alert onClose={() => setIsSnackbarOpen(false)} severity={snackbarError ? "error" : "success"} sx={{ width: '100%' }} variant='outlined'>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}