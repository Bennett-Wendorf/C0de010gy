import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import api from "../../utils/api"
import useUserStore from "../../utils/Stores";
import AuthService from '../../services/auth.service'

import Programs from "../Program/Programs"

import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Grid, TextField, Button, InputAdornment, Paper } from "@mui/material"
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { Snackbar, Alert } from "@mui/material"

// Import date picker and localization
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

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

export default function ModifyEventDialog(props) {
    const {
        selectedEvent,
        hasDonated,
        hasVolunteered,
        isViewDialogOpen,
        setIsViewDialogOpen,
        isModifyDialogOpen,
        setIsModifyDialogOpen,
        eventUpdate,
    } = props

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
    const defaultDonationAmount = 0

    // Create relevant pieces of state for the dialog popups
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false)
    const [isRegConfOpen, setIsRegConfOpen] = useState(false)
    const [isVolunteerRoleConfOpen, setIsVolunteerRoleConfOpen] = useState(false)
    const [isDonorRoleConfOpen, setIsDonorRoleConfOpen] = useState(false)
    const [isActionSuccessOpen, setIsActionSuccessOpen] = useState(false)
    const [actionSuccessMessage, setActionSuccessMessage] = useState("")
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
    const [errorDialogText, setErrorDialogText] = useState("")

    const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false)
    const [donationAmount, setDonationAmount] = useState(defaultDonationAmount)

    const [isViewDonationsDialogOpen, setIsViewDonationsDialogOpen] = useState(false)
    const [isViewProgramsDialogOpen, setIsViewProgramsDialogOpen] = useState(false)

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

    useEffect(() => {
        setModifyStates(selectedEvent)
    }, [selectedEvent])

    const setModifyStates = (event) => {
        setUpdateSummary(event.Summary ?? defaultUpdateSummary)
        setUpdateDescription(event.Description ?? defaultUpdateDescription)
        setUpdateNeededVolunteers(event.NeededVolunteers ?? defaultNeededVolunteers)
        setUpdateLocation(event.Location ?? defaultLocation)
        setUpdateVolunteerQualifications(event.VolunteerQualifications ?? defaultVolunteerQualifications)
        setUpdateStartTime(event.StartTime)
        setUpdateEndTime(event.EndTime)
    }

    const handleModifyClose = () => {
        setIsModifyDialogOpen(false)
        setModifyStates(selectedEvent)
        resetErrors()
    }

    const resetErrors = () => {
        setUpdateSummaryError(false)
        setUpdateDescriptionError(false)
        setUpdateNeededVolunteersError(false)
        setUpdateLocationError(false)
        setUpdateVolunteerQualificationsError(false)
        setUpdateSummaryErrorText("")
        setUpdateDescriptionErrorText("")
        setUpdateNeededVolunteersErrorText("")
        setUpdateLocationErrorText("")
        setUpdateVolunteerQualificationsErrorText("")

        setIsErrorDialogOpen(false)
        setErrorDialogText("")
    }

    const handleActionSuccess = () => {
        setIsViewDialogOpen(false)
        setIsModifyDialogOpen(false)
        setIsDonateDialogOpen(false)
        setIsViewDonationsDialogOpen(false)
    }

    const handleDonateClose = () => {
        setIsDonateDialogOpen(false)
        setDonationAmount(defaultDonationAmount)
    }

    const alertError = (error) => {
        setErrorDialogText(error.response?.data?.message ? error.response.data.message : error.message)
        setIsErrorDialogOpen(true)
    }

    const addRole = useUserStore(state => state.addRole)

    const handleAddVolunteerRole = () => {
        api.post('/api/users/role', {
            roles: ["Volunteer"]
        })
            .then((response) => {
                setIsVolunteerRoleConfOpen(false)
                setActionSuccessMessage(response.data.message)
                addRole(response.data.roles)
                completeVolunteer()
                    .then(() => {
                        setIsActionSuccessOpen(true)
                    })
            })
            .catch((error) => {
                alertError(error)
            })
    }

    const handleAddDonorRole = () => {
        api.post('/api/users/role', {
            roles: ["Donor"]
        })
            .then((response) => {
                setIsDonorRoleConfOpen(false)
                setActionSuccessMessage(response.data.message)
                addRole(response.data.roles)
                setIsDonateDialogOpen(true)
            })
            .catch((error) => {
                alertError(error)
            })
    }

    // Handle database update on submission of the dialog
    const handleSubmit = () => {
        // Create the new updated event object
        const updatedEvent = {
            eventID: selectedEvent.EventID,
            summary: updateSummary,
            description: updateDescription,
            startTime: updateStartTime,
            endTime: updateEndTime,
            neededVolunteers: updateNeededVolunteers,
            location: updateLocation,
            volunteerQualifications: updateVolunteerQualifications
        }

        // Make a call to the backend api to update the event
        api.put(`/api/events/${selectedEvent.EventID}`, updatedEvent)
            .then(response => {
                eventUpdate()
                setActionSuccessMessage(response.data.message)
                setIsActionSuccessOpen(true)
                handleActionSuccess()
                setIsModifyDialogOpen(false)
                setModifyStates(response.data.event)
                resetErrors()
            })
            .catch(error => {
                handleUpdateResponseError(error)
            })
    }

    const handleViewDonations = () => {
        updateEventDonations(selectedEvent)
        setIsViewDonationsDialogOpen(true)
    }

    // Handle when the delete button is pressed for a selected event
    const handleDelete = () => {
        setIsModifyDialogOpen(false)
        setIsDeleteConfOpen(false)

        // Make the call to the backend to delete the selected event
        api.delete(`/api/events/${selectedEvent.EventID}`)
            .then(response => {
                eventUpdate()
                setIsDeleteConfOpen(false)
                setActionSuccessMessage(response.data.message)
                setIsActionSuccessOpen(true)
                handleActionSuccess()
            })
            .catch(error => {
                alertError(error)
            })
    }

    const userIsVolunteer = AuthService.useHasPermissions(['Volunteer'])

    // Handle volunteer and donation button presses
    const handleVolunteer = () => {
        console.log(`userIsVolunteer: ${userIsVolunteer}`)
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
                handleActionSuccess()
                eventUpdate()
            })
            .catch(error => {
                alertError(error)
            })
    }

    const handleCancelVolunteer = () => {
        api.delete(`/api/events/${selectedEvent.EventID}/volunteer`)
            .then(response => {
                setActionSuccessMessage(response.data.message)
                setIsActionSuccessOpen(true)
                handleActionSuccess()
                eventUpdate()
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
                handleActionSuccess()
                updateEventDonations(selectedEvent)
            })
            .catch(error => {
                alertError(error)
            })
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

    const handleUpdateResponseError = (error) => {
        let fieldName = error.response.data.field
        let message = error.response.data.message
        switch(fieldName) {
            case 'summary':
                setUpdateSummaryError(true)
                setUpdateSummaryErrorText(message)
                break
            case 'description':
                setUpdateDescriptionError(true)
                setUpdateDescriptionErrorText(message)
                break
            case 'neededVolunteers':
                setUpdateNeededVolunteersError(true)
                setUpdateNeededVolunteersErrorText(message)
                break
            case 'location':
                setUpdateLocationError(true)
                setUpdateLocationErrorText(message)
                break
            case 'volunteerQualifications':
                setUpdateVolunteerQualificationsError(true)
                setUpdateVolunteerQualificationsErrorText(message)
                break
            default:
                alertError(error)
                break
        }
    }

    return (
        <>
            {/* The popup dialog for editing and deleting event */}
            < Dialog open={isModifyDialogOpen} onClose={handleModifyClose} >
                <DialogTitle>
                    Modify event "{selectedEvent.Summary}"
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {isErrorDialogOpen &&
                            <Grid item xs={12}>
                                <Alert severity="error" variant='outlined'>{errorDialogText}</Alert>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                id="Title"
                                label="Title"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                onChange={(event) => setUpdateSummary(event.target.value)}
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
                                rows={4}
                                variant="filled"
                                margin="none"
                                onChange={(event) => setUpdateDescription(event.target.value)}
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
                                onChange={(event) => setUpdateNeededVolunteers(event.target.value)}
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
                                onChange={(event) => setUpdateLocation(event.target.value)}
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
                                onChange={(event) => setUpdateVolunteerQualifications(event.target.value)}
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
                                    margin="none"
                                    value={updateStartTime}
                                    onChange={(value) => setUpdateStartTime(value)}
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
                                    margin="none"
                                    value={updateEndTime}
                                    onChange={(value) => setUpdateEndTime(value)}
                                    renderInput={(params) => <TextField margin="none" {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                margin="none"
                                fullWidth
                                onClick={() => setIsViewProgramsDialogOpen(true)}
                            >
                                Edit Programs
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Generate the buttons to act as actions on the dialog popup */}
                <DialogActions>
                    <Button onClick={() => setIsDeleteConfOpen(true)} color="error">Cancel Event</Button>
                    <Button onClick={handleModifyClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for confirming deletion of an event */}
            < Dialog open={isDeleteConfOpen} onClose={() => setIsDeleteConfOpen(false)} >
                <DialogTitle>
                    Are you sure you want to cancel event: "{selectedEvent.Summary}"?
                </DialogTitle>
                <DialogContent>
                    Note: This will also invalidate all programs associated with the event,
                    invalidate all volunteer assignments. Also, all donations associated with the event will become general donations.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteConfOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Confirm Cancel</Button>
                </DialogActions>
            </Dialog >

            {/* The popup dialog for viewing event details */}
            < Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} >
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
                                rows={4}
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
                                    margin="none"
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
                                    margin="none"
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
                                    margin="none"
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
                                    margin="none"
                                    onClick={handleDonate}
                                    fullWidth
                                >
                                    Donate to this Event
                                </Button>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                margin="none"
                                fullWidth
                                onClick={() => setIsViewProgramsDialogOpen(true)}
                            >
                                View Programs
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Generate the buttons to act as actions on the dialog popup */}
                <DialogActions>
                    <Button onClick={() => setIsViewDialogOpen(false)}>OK</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for donating to an event */}
            < Dialog open={isDonateDialogOpen} onClose={handleDonateClose} >
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
                                onChange={(event) => setDonationAmount(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Card Number"
                                fullWidth
                                variant="filled"
                                margin="none"
                                helperText="Note: This is a demo, so no real card numbers will be charged and no card information will be sent or stored."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Generate the buttons to act as actions on the dialog popup */}
                <DialogActions>
                    <Button onClick={handleDonateClose}>Cancel</Button>
                    <Button onClick={completeDonate} color="primary">Donate</Button>
                </DialogActions>
            </Dialog >

            <Programs selectedEvent={selectedEvent} open={isViewProgramsDialogOpen} onClose={() => setIsViewProgramsDialogOpen(false)} />

            {/* Popup dialog for editing donations to an event */}
            < Dialog open={isViewDonationsDialogOpen} onClose={() => setIsViewDonationsDialogOpen(false)} >
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
                    <Button onClick={() => setIsViewDonationsDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for prompting for registration */}
            < Dialog open={isRegConfOpen} onClose={() => setIsRegConfOpen(false)} >
                <DialogTitle>
                    Register Now?
                </DialogTitle>
                <DialogContent>
                    You must have an account to perform this action. Would you like to register now?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsRegConfOpen(false)}>Cancel</Button>
                    <Button onClick={() => navigate('/register')}>Register</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for confirming addition of Volunteer role */}
            < Dialog open={isVolunteerRoleConfOpen} onClose={() => setIsVolunteerRoleConfOpen(false)} >
                <DialogTitle>
                    Become a Volunteer?
                </DialogTitle>
                <DialogContent>
                    You must have the Volunteer role to volunteer for an event. Would you like to become a volunteer now?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsVolunteerRoleConfOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddVolunteerRole}>OK</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for confirming addition of Donor role */}
            < Dialog open={isDonorRoleConfOpen} onClose={() => setIsDonorRoleConfOpen(false)} >
                <DialogTitle>
                    Become a Donor?
                </DialogTitle>
                <DialogContent>
                    You must have the Donor role to donate to an event. Would you like to become a donor now?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDonorRoleConfOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddDonorRole}>OK</Button>
                </DialogActions>
            </Dialog >

            <Snackbar open={isActionSuccessOpen} autoHideDuration={6000} onClose={() => setIsActionSuccessOpen(false)}>
                <Alert onClose={() => setIsActionSuccessOpen(false)} severity="success" sx={{ width: '100%' }} variant="outlined">
                    {actionSuccessMessage}
                </Alert>
            </Snackbar>
        </>
    )
}