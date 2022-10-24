// Import React stuff
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import utilities and components
import api from "../../utils/api";
import AuthService from '../../services/auth.service'

// Import general mui stuff
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    InputAdornment
} from '@mui/material';

// Import dialog stuff from mui
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

// Import date picker and localization
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useUserStore from "../../utils/Stores";

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

// Create a component for the table of events
export function EventTable({ rows, eventUpdate }) {

    const navigate = useNavigate()

    const maxSummaryLength = 100
    const maxDescriptionLength = 500
    const maxLocationLength = 100
    const maxVolunteerQualificationsLength = 250

    const defaultUpdateSummary = ""
    const defaultUpdateDescription = ""
    const defaultNeededVolunteers = "0"
    const defaultLocation = ""
    const defaultVolunteerQualifications = ""
    const defaultUpdateStartTime = new Date()
    const defaultUpdateEndTime = new Date()
    defaultUpdateEndTime.setDate(defaultUpdateEndTime.getDate() + 1)

    // Create relevant pieces of state for the dialog popups
    const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false)
    const [isRegConfOpen, setIsRegConfOpen] = useState(false)
    const [isVolunteerRoleConfOpen, setIsVolunteerRoleConfOpen] = useState(false)
    const [isDonorRoleConfOpen, setIsDonorRoleConfOpen] = useState(false)
    const [isActionSuccessOpen, setIsActionSuccessOpen] = useState(false)
    const [isAddRoleSuccessOpen, setIsAddRoleSuccessOpen] = useState(false)
    const [actionSuccessMessage, setActionSuccessMessage] = useState("")
    const [addRoleSuccessMessage, setAddRoleSuccessMessage] = useState("")
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
    const [errorDialogText, setErrorDialogText] = useState("")

    const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false)
    const [donationAmount, setDonationAmount] = useState(0)

    const [isViewDonationsDialogOpen, setIsViewDonationsDialogOpen] = useState(false)

    const [hasVolunteered, setHasVolunteered] = useState(false)
    const [hasDonated, setHasDonated] = useState(false)

    const [selectedEvent, setSelectedEvent] = useState({})
    const [selectedEventDonations, setSelectedEventDonations] = useState([])

    // Create pieces of state for handling event updates
    const [updateSummary, setUpdateSummary] = useState(defaultUpdateSummary)
    const [updateDescription, setUpdateDescription] = useState(defaultUpdateDescription)
    const [updateNeededVolunteers, setUpdateNeededVolunteers] = useState(defaultNeededVolunteers)
    const [updateLocation, setUpdateLocation] = useState(defaultLocation)
    const [updateVolunteerQualifications, setUpdateVolunteerQualifications] = useState(defaultVolunteerQualifications)
    const [updateStartTime, setUpdateStartTime] = useState(defaultUpdateStartTime)
    const [updateEndTime, setUpdateEndTime] = useState(defaultUpdateEndTime)

    const [updateSummaryError, setUpdateSummaryError] = useState(false)
    const [updateDescriptionError, setUpdateDescriptionError] = useState(false)
    const [updateNeededVolunteersError, setUpdateNeededVolunteersError] = useState(false)
    const [updateLocationError, setUpdateLocationError] = useState(false)
    const [updateVolunteerQualificationsError, setUpdateVolunteerQualificationsError] = useState(false)
    const [updateSummaryErrorText, setUpdateSummaryErrorText] = useState("")
    const [updateDescriptionErrorText, setUpdateDescriptionErrorText] = useState("")
    const [updateNeededVolunteersErrorText, setUpdateNeededVolunteersErrorText] = useState("")
    const [updateLocationErrorText, setUpdateLocationErrorText] = useState("")
    const [updateVolunteerQualificationsErrorText, setUpdateVolunteerQualificationsErrorText] = useState("")

    // Handle when a row is clicked and set up the pieces of state
    const handleRowClick = (event) => {
        setSelectedEvent(event)
        setUpdateSummary(event.Summary)
        setUpdateDescription(event.Description ?? "")
        setUpdateNeededVolunteers(event.NeededVolunteers)
        setUpdateLocation(event.Location ?? "")
        setUpdateVolunteerQualifications(event.VolunteerQualifications ?? "")
        setUpdateStartTime(event.StartTime)
        setUpdateEndTime(event.EndTime)
        setIsModifyDialogOpen(true)
    }

    const handleRowClickView = async (event) => {
        setSelectedEvent(event)
        checkIfVolunteered(event)
            .then((volunteered) => {
                if (volunteered) {
                    setHasVolunteered(true)
                } else {
                    setHasVolunteered(false)
                }
                setIsViewDialogOpen(true)
            })
        checkIfDonated(event)
            .then((donated) => {
                if (donated) {
                    setHasDonated(true)
                } else {
                    setHasDonated(false)
                }
                setIsViewDialogOpen(true)
            })
        updateEventDonations(event)
    }

    // Functions to handle changes in values for modification dialog
    const handleUpdateSummaryChange = (event) => {
        setUpdateSummary(event.target.value)
    }

    const handleUpdateDescriptionChange = (event) => {
        setUpdateDescription(event.target.value)
    }

    const handleUpdateNeededVolunteersChange = (event) => {
        setUpdateNeededVolunteers(event.target.value)
    }

    const handleUpdateLocationChange = (event) => {
        setUpdateLocation(event.target.value)
    }

    const handleUpdateVolunteerQualificationsChange = (event) => {
        setUpdateVolunteerQualifications(event.target.value)
    }

    const handleUpdateStartTimeChange = (event) => {
        setUpdateStartTime(event.target.value)
    }

    const handleUpdateEndTimeChange = (event) => {
        setUpdateEndTime(event.target.value)
    }

    const handleClose = () => {
        setIsModifyDialogOpen(false)
    }

    const handleViewClose = () => {
        setIsViewDialogOpen(false)
    }

    const handleConfirmationClose = () => {
        setIsDeleteConfOpen(false)
    }

    const handleDeleteConfirmation = () => {
        setIsDeleteConfOpen(true)
    }

    const handleRegistrationConfirmationClose = () => {
        setIsRegConfOpen(false)
    }

    const handleVolunteerRoleConfirmationClose = () => {
        setIsVolunteerRoleConfOpen(false)
    }

    const handleDonorRoleConfirmationClose = () => {
        setIsDonorRoleConfOpen(false)
    }

    const handleActionSuccessClose = () => {
        setIsActionSuccessOpen(false)
        setIsViewDialogOpen(false)
        setIsModifyDialogOpen(false)
        setIsDonateDialogOpen(false)
        setIsViewDonationsDialogOpen(false)
    }

    const handleAddRoleSuccessClose = () => {
        setIsAddRoleSuccessOpen(false)
    }

    const handleErrorDialogClose = () => {
        setIsErrorDialogOpen(false)
    }

    const handleDonateClose = () => {
        setIsDonateDialogOpen(false)
    }

    const handleViewDonationsClose = () => {
        setIsViewDonationsDialogOpen(false)
    }

    const handleDonationAmountChange = (amount) => {
        setDonationAmount(amount.target.value)
    }

    const alertError = (error) => {
        setErrorDialogText(error.response?.data?.message ? error.response.data.message : error.message)
        setIsErrorDialogOpen(true)
    }

    const handleRegistration = () => {
        navigate('/register')
    }

    const addRole = useUserStore(state => state.addRole)

    const handleAddVolunteerRole = () => {
        api.post('/api/user/role', {
            roles: ["Volunteer"]
        })
            .then((response) => {
                setIsVolunteerRoleConfOpen(false)
                setAddRoleSuccessMessage(response.data.message)
                addRole('Volunteer')
                completeVolunteer()
                    .then(() =>
                        setIsAddRoleSuccessOpen(true))
            })
            .catch((error) => {
                alertError(error)
            })
    }

    const handleAddDonorRole = () => {
        api.post('/api/user/role', {
            roles: ["Donor"]
        })
            .then((response) => {
                setIsDonorRoleConfOpen(false)
                setAddRoleSuccessMessage(response.data.message)
                addRole('Donor')
                completeDonate()
                    .then(() =>
                        setIsAddRoleSuccessOpen(true))
            })
            .catch((error) => {
                alertError(error)
            })
    }

    // Handle database update on submission of the dialog
    const handleSubmit = () => {
        setIsModifyDialogOpen(false)

        // Create the new updated event object
        const updatedEvent = {
            eventID: selectedEvent.eventID,
            summary: updateSummary,
            description: updateDescription,
            startTime: updateStartTime,
            endTime: updateEndTime
        }

        // Make a call to the backend api to update the event
        api.put(`/api/events/${updatedEvent.eventID}`, updatedEvent)
            .then(response => {
                eventUpdate()
            })
    }

    // Handle when the delete button is pressed for a selected event
    const handleDelete = () => {
        setIsModifyDialogOpen(false)
        setIsDeleteConfOpen(false)

        // Make the call to the backend to delete the selected event
        api.delete(`/api/events/${selectedEvent.eventID}`)
            .then(response => {
                eventUpdate()
            })
    }

    const userIsVolunteer = AuthService.useHasPermissions(['Volunteer'])

    // Handle volunteer and donation button presses
    const handleVolunteer = () => {
        if (!AuthService.isLoggedIn()) {
            setIsRegConfOpen(true)
        } else if (!userIsVolunteer) {
            setIsVolunteerRoleConfOpen(true)
        } else {
            completeVolunteer()
        }
    }

    const completeVolunteer = async () => {
        await api.post(`/api/events/${selectedEvent.EventID}/volunteer`)
            .then(response => {
                setActionSuccessMessage(response.data.message)
                setIsActionSuccessOpen(true)
            })
            .catch(error => {
                alertError(error)
            })
    }

    const checkIfVolunteered = async (event) => {
        return api.get(`/api/events/${event.EventID}/volunteer`)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return false
            }
            )
    }

    const handleCancelVolunteer = () => {
        api.delete(`/api/events/${selectedEvent.EventID}/volunteer`)
            .then(response => {
                setActionSuccessMessage(response.data.message)
                setIsActionSuccessOpen(true)
            })
            .catch(error => {
                alertError(error)
            })
    }

    const userIsDonor = AuthService.useHasPermissions(['Donor'])

    const handleDonate = () => {
        if (!AuthService.isLoggedIn()) {
            setIsRegConfOpen(true)
        } else if (!userIsDonor) {
            setIsDonorRoleConfOpen(true)
        } else {
            setIsDonateDialogOpen(true)
        }
    }

    const completeDonate = async () => {
        let newDonation = {
            amount: donationAmount
        }

        await api.post(`api/events/${selectedEvent.EventID}/donate`, newDonation)
            .then(response => {
                setActionSuccessMessage(response.data.message)
                setIsActionSuccessOpen(true)
                updateEventDonations(selectedEvent)
            })
            .catch(error => {
                alertError(error)
            })
    }

    const checkIfDonated = async (event) => {
        return api.get(`/api/events/${event.EventID}/donate`)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return false
            })
    }

    const handleViewDonations = () => {
        setIsViewDonationsDialogOpen(true)
    }

    const updateEventDonations = async (event) => {
        return api.get(`/api/events/${event.EventID}/donations`)
            .then(response => {
                setSelectedEventDonations(response.data)
            })
            .catch(error => {
                alertError(error)
                setSelectedEventDonations([])
            })
    }

    const userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    return (
        <>
            {/* Build the event table */}
            <TableContainer component={Paper}>
                {/* Make this responsive */}
                <Table sx={{ minWidth: 650 }} aria-label="Events">

                    {/* Generate the headers of the rows */}
                    <TableHead>
                        <TableRow>
                            <TableCell>Summary</TableCell>
                            <TableCell align="left">Start Time</TableCell>
                            <TableCell align="left">End Time</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Needed Volunteers</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Map each event from the backend to a row in the table */}
                        {rows.map((row) => (
                            <TableRow
                                key={row.EventID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                onClick={(event) => { userIsAdmin ? handleRowClick(row) : handleRowClickView(row) }}
                                hover
                            >
                                <TableCell>{row.Summary}</TableCell>
                                <TableCell align="left" size="small">{new Date(row.StartTime).toLocaleString("en-US", dateFormatOptions)}</TableCell>
                                <TableCell align="left" size="small">{new Date(row.EndTime).toLocaleString("en-US", dateFormatOptions)}</TableCell>
                                <TableCell align="right" size="small">{row.Location}</TableCell>
                                <TableCell align="right" size="small">{row.NeededVolunteers}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {rows.length <= 0 &&
                <Typography variant="h6" align="center" sx={{ marginTop: "10px" }}>There are no events to display here. :(</Typography>
            }

            {/* The popup dialog for editing and deleting event */}
            <Dialog open={isModifyDialogOpen} onClose={handleClose}>
                <DialogTitle>
                    Modify event "{selectedEvent.Summary}"
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                id="Title"
                                label="Title"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                onChange={handleUpdateSummaryChange}
                                value={updateSummary}
                                inputProps={{ maxLength: maxSummaryLength }}
                                error={updateSummaryError}
                                helperText={updateSummaryError ? updateSummaryErrorText : `${updateSummary.length}/${maxSummaryLength}`}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="Description"
                                label="Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={5}
                                variant="filled"
                                margin="none"
                                onChange={handleUpdateDescriptionChange}
                                value={updateDescription}
                                inputProps={{ maxLength: maxDescriptionLength }}
                                error={updateDescriptionError}
                                helperText={updateDescriptionError ? updateDescriptionErrorText : `${updateDescription.length}/${maxDescriptionLength}`}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="NeededVolunteers"
                                name="NeededVolunteers"
                                label="Number of Volunteers Needed"
                                type="number"
                                fullWidth
                                variant="filled"
                                margin="none"
                                onChange={handleUpdateNeededVolunteersChange}
                                value={updateNeededVolunteers}
                                inputProps={{ maxLength: 5 }}
                                error={updateNeededVolunteersError}
                                helperText={updateNeededVolunteersErrorText}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="Location"
                                name="Location"
                                label="Location"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                onChange={handleUpdateLocationChange}
                                value={updateLocation}
                                inputProps={{ maxLength: maxLocationLength }}
                                error={updateLocationError}
                                helperText={updateLocationError ? updateLocationErrorText : `${updateLocation.length}/${maxLocationLength}`}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="VolunteerQualifications"
                                name="VolunteerQualifications"
                                label="Volunteer Qualifications"
                                type="text"
                                fullWidth
                                multiline
                                rows={2}
                                variant="filled"
                                margin="none"
                                onChange={handleUpdateVolunteerQualificationsChange}
                                value={updateVolunteerQualifications}
                                inputProps={{ maxLength: maxVolunteerQualificationsLength }}
                                error={updateVolunteerQualificationsError}
                                helperText={updateVolunteerQualificationsError ? updateVolunteerQualificationsErrorText : `${updateVolunteerQualifications.length}/${maxVolunteerQualificationsLength}`}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Start Time"
                                    required
                                    variant="filled"
                                    value={updateStartTime}
                                    onChange={handleUpdateStartTimeChange}
                                    renderInput={(params) => <TextField margin="none" {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="End Time"
                                    required
                                    variant="filled"
                                    value={updateEndTime}
                                    onChange={handleUpdateEndTimeChange}
                                    renderInput={(params) => <TextField margin="none" {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Generate the buttons to act as actions on the dialog popup */}
                <DialogActions>
                    <Button onClick={handleDeleteConfirmation} color="error">Delete Event</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Popup dialog for confirming deletion of an event */}
            <Dialog open={isDeleteConfOpen} onClose={handleConfirmationClose}>
                <DialogTitle>
                    Confirm
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to delete event: "{selectedEvent.Title}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Confirm Delete</Button>
                </DialogActions>
            </Dialog>

            {/* The popup dialog for viewing event details */}
            <Dialog open={isViewDialogOpen} onClose={handleViewClose}>
                <DialogTitle>
                    Event "{selectedEvent.Summary}"
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                id="Title"
                                label="Title"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                disabled
                                value={selectedEvent.Summary}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="Description"
                                label="Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={5}
                                variant="filled"
                                margin="none"
                                disabled
                                value={selectedEvent.Description ?? ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="NeededVolunteers"
                                name="NeededVolunteers"
                                label="Number of Volunteers Needed"
                                type="number"
                                fullWidth
                                variant="filled"
                                margin="none"
                                disabled
                                value={selectedEvent.NeededVolunteers}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="Location"
                                name="Location"
                                label="Location"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                disabled
                                value={selectedEvent.Location ?? ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="VolunteerQualifications"
                                name="VolunteerQualifications"
                                label="Volunteer Qualifications"
                                type="text"
                                fullWidth
                                multiline
                                rows={2}
                                variant="filled"
                                margin="none"
                                disabled
                                value={selectedEvent.VolunteerQualifications ?? ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="StartTime"
                                name="StartTime"
                                label="Start Time"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                disabled
                                value={new Date(selectedEvent.StartTime).toLocaleString("en-US", dateFormatOptions)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="EndTime"
                                name="EndTime"
                                label="End Time"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                disabled
                                value={new Date(selectedEvent.EndTime).toLocaleString("en-US", dateFormatOptions)}
                            />
                        </Grid>
                        {hasVolunteered &&
                            <Grid item xs={12} sm={6}>
                                <Button
                                    onClick={handleCancelVolunteer}
                                    color="error"
                                    variant="contained"
                                    fullWidth
                                >
                                    Cancel Volunteer
                                </Button>
                            </Grid>
                        }
                        {!hasVolunteered &&
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleVolunteer}
                                    fullWidth
                                >
                                    Volunteer for this Event
                                </Button>
                            </Grid>
                        }
                        {hasDonated &&
                            <Grid item xs={12} sm={6}>
                                <Button
                                    onClick={handleViewDonations}
                                    color="secondary"
                                    variant="contained"
                                    fullWidth
                                >
                                    View My Donations
                                </Button>
                            </Grid>
                        }
                        {!hasDonated &&
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleDonate}
                                    fullWidth
                                >
                                    Donate to this Event
                                </Button>
                            </Grid>
                        }
                    </Grid>
                </DialogContent>

                {/* Generate the buttons to act as actions on the dialog popup */}
                <DialogActions>
                    <Button onClick={handleViewClose}>OK</Button>
                </DialogActions>
            </Dialog>

            {/* Popup dialog for donating to an event */}
            <Dialog open={isDonateDialogOpen} onClose={handleDonateClose}>
                <DialogTitle>
                    Donate to Event "{selectedEvent.Summary}"
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                autoFocus
                                id="Amount"
                                name="Amount"
                                label="Amount"
                                type="number"
                                fullWidth
                                variant="filled"
                                margin="none"
                                value={donationAmount}
                                onChange={handleDonationAmountChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Generate the buttons to act as actions on the dialog popup */}
                <DialogActions>
                    <Button onClick={handleDonateClose}>Cancel</Button>
                    <Button onClick={completeDonate} color="primary">Donate</Button>
                </DialogActions>
            </Dialog>

            {/* Popup dialog for editing donations to an event */}
            <Dialog open={isViewDonationsDialogOpen} onClose={handleViewDonationsClose}>
                <DialogTitle>
                    Viewing Donations for Event "{selectedEvent.Summary}"
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table aria-label="Events">
                            {/* Generate the headers of the rows */}
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date Donated</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Map each event from the backend to a row in the table */}
                                {selectedEventDonations.map((donation) => (
                                    <TableRow
                                        key={donation.DonationID}
                                    >
                                        <TableCell size="small">{new Date(donation.CreatedDateTime).toLocaleString("en-US", dateFormatOptions)}</TableCell>
                                        <TableCell align="right" size="small">$ {donation.Amount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDonate} color="primary" variant="contained">Add Donation</Button>
                    <Button onClick={handleViewDonationsClose}>Close</Button>
                </DialogActions>
            </Dialog>


            {/* Popup dialog for prompting for registration */}
            <Dialog open={isRegConfOpen} onClose={handleRegistrationConfirmationClose}>
                <DialogTitle>
                    Register Now?
                </DialogTitle>
                <DialogContent>
                    You must have an account to perform this action. Would you like to register now?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRegistrationConfirmationClose}>Cancel</Button>
                    <Button onClick={handleRegistration}>Register</Button>
                </DialogActions>
            </Dialog>

            {/* Popup dialog for confirming addition of Volunteer role */}
            <Dialog open={isVolunteerRoleConfOpen} onClose={handleVolunteerRoleConfirmationClose}>
                <DialogTitle>
                    Become a Volunteer?
                </DialogTitle>
                <DialogContent>
                    You must have the Volunteer role to volunteer for an event. Would you like to become a volunteer now?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleVolunteerRoleConfirmationClose}>Cancel</Button>
                    <Button onClick={handleAddVolunteerRole}>OK</Button>
                </DialogActions>
            </Dialog>

            {/* Popup dialog for confirming addition of Donor role */}
            <Dialog open={isDonorRoleConfOpen} onClose={handleDonorRoleConfirmationClose}>
                <DialogTitle>
                    Become a Donor?
                </DialogTitle>
                <DialogContent>
                    You must have the Donor role to donate to an event. Would you like to become a donor now?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDonorRoleConfirmationClose}>Cancel</Button>
                    <Button onClick={handleAddDonorRole}>OK</Button>
                </DialogActions>
            </Dialog>

            {/* TODO: Convert this and other dialogs to use the Alert component with Snackbar */}
            {/* Popup dialog for indicating success of volunteering or donating */}
            <Dialog open={isActionSuccessOpen} onClose={handleActionSuccessClose}>
                <DialogTitle>
                    Success!
                </DialogTitle>
                <DialogContent>
                    {actionSuccessMessage}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleActionSuccessClose}>OK</Button>
                </DialogActions>
            </Dialog>

            {/* Popup dialog for indicating success of adding a role */}
            <Dialog open={isAddRoleSuccessOpen} onClose={handleAddRoleSuccessClose}>
                <DialogTitle>
                    Success!
                </DialogTitle>
                <DialogContent>
                    {addRoleSuccessMessage}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddRoleSuccessClose}>OK</Button>
                </DialogActions>
            </Dialog>

            {/* Popup dialog for indicating error */}
            <Dialog open={isErrorDialogOpen} onClose={handleErrorDialogClose}>
                <DialogTitle>
                    Error!
                </DialogTitle>
                <DialogContent>
                    {errorDialogText}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorDialogClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}