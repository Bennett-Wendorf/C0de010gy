import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import api from "../../utils/api"
import useUserStore from "../../utils/Stores";
import AuthService from '../../services/auth.service'

import Programs from "../Program/Programs"

import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Grid, TextField, Button, InputAdornment, Paper } from "@mui/material"
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"

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
    const [isAddRoleSuccessOpen, setIsAddRoleSuccessOpen] = useState(false)
    const [actionSuccessMessage, setActionSuccessMessage] = useState("")
    const [addRoleSuccessMessage, setAddRoleSuccessMessage] = useState("")
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
        setDonationAmount(defaultDonationAmount)
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
                addRole(response.data.roles)
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

    const handleViewDonations = () => {
        updateEventDonations(selectedEvent)
        setIsViewDonationsDialogOpen(true)
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

    const handleViewPrograms = () => {
        setIsViewProgramsDialogOpen(true)
    }

    const handleViewProgramsDialogClose = () => {
        setIsViewProgramsDialogOpen(false)
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
                                rows={4}
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
                                    margin="none"
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
                                    margin="none"
                                    value={updateEndTime}
                                    onChange={handleUpdateEndTimeChange}
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
                                onClick={handleViewPrograms}
                            >
                                Edit Programs
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Generate the buttons to act as actions on the dialog popup */}
                <DialogActions>
                    <Button onClick={handleDeleteConfirmation} color="error">Delete Event</Button>
                    <Button onClick={handleModifyClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for confirming deletion of an event */}
            < Dialog open={isDeleteConfOpen} onClose={handleConfirmationClose} >
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
            </Dialog >

            {/* The popup dialog for viewing event details */}
            < Dialog open={isViewDialogOpen} onClose={handleViewClose} >
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
                                onClick={handleViewPrograms}
                            >
                                View Programs
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Generate the buttons to act as actions on the dialog popup */}
                <DialogActions>
                    <Button onClick={handleViewClose}>OK</Button>
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
                                onChange={handleDonationAmountChange}
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

            <Programs selectedEvent={selectedEvent} open={isViewProgramsDialogOpen} onClose={handleViewProgramsDialogClose} />

            {/* Popup dialog for editing donations to an event */}
            < Dialog open={isViewDonationsDialogOpen} onClose={handleViewDonationsClose} >
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
            </Dialog >

            {/* Popup dialog for prompting for registration */}
            < Dialog open={isRegConfOpen} onClose={handleRegistrationConfirmationClose} >
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
            </Dialog >

            {/* Popup dialog for confirming addition of Volunteer role */}
            < Dialog open={isVolunteerRoleConfOpen} onClose={handleVolunteerRoleConfirmationClose} >
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
            </Dialog >

            {/* Popup dialog for confirming addition of Donor role */}
            < Dialog open={isDonorRoleConfOpen} onClose={handleDonorRoleConfirmationClose} >
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
            </Dialog >

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