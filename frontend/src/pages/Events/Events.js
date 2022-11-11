// Import React stuff
import React, { useState, useEffect } from "react";

// Import utilities and components
import api from "../../utils/api";
import Bar from "../../components/AppBar";
import { EventTable } from './EventTable';
import AuthService from '../../services/auth.service'

// Import icons from mui
import AddIcon from '@mui/icons-material/AddCircle';

// Import general mui stuff
import { Button, IconButton, Tooltip, Grid, Alert } from "@mui/material";

// Import dialog stuff from mui
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

// Import date picker and localization
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// Create a component for the Events page
export function Events() {

    // Define default values for new events
    const defaultNewSummary = ""
    const defaultNewDescription = ""
    const defaultNewNeededVolunteers = "0"
    const defaultNewLocation = ""
    const defaultNewVolunteerQualifications = ""
    const defaultNewStartDate = new Date()
    defaultNewStartDate.setHours(defaultNewStartDate.getHours() + 1)
    const defaultNewEndDate = new Date(defaultNewStartDate.toISOString())
    defaultNewEndDate.setHours(defaultNewStartDate.getHours() + 1)
    const maxSummaryLength = 100
    const maxDescriptionLength = 500
    const maxLocationLength = 100
    const maxVolunteerQualificationsLength = 250

    // Define a piece of state to use to store information from the api call
    const [events, setEvents] = useState([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newEventSummary, setNewEventSummary] = useState(defaultNewSummary)
    const [newEventDescription, setNewEventDescription] = useState(defaultNewDescription)
    const [newEventNeededVolunteers, setNewEventNeededVolunteers] = useState(defaultNewNeededVolunteers)
    const [newEventLocation, setEventNewLocation] = useState(defaultNewLocation)
    const [newEventVolunteerQualifications, setNewEventVolunteerQualifications] = useState(defaultNewVolunteerQualifications)
    const [newEventStartDate, setNewEventStartDate] = useState(defaultNewStartDate)
    const [newEventEndDate, setNewEventEndDate] = useState(defaultNewEndDate)

    // Error text state
    const [newEventSummaryError, setNewEventSummaryError] = useState(false)
    const [newEventDescriptionError, setNewEventDescriptionError] = useState(false)
    const [newNeededVolunteersError, setNewNeededVolunteersError] = useState(false)
    const [newEventLocationError, setNewEventLocationError] = useState(false)
    const [newEventVolunteerQualificationsError, setNewEventVolunteerQualificationsError] = useState(false)
    const [newEventSummaryErrorText, setNewEventSummaryErrorText] = useState("")
    const [newEventDescriptionErrorText, setNewEventDescriptionErrorText] = useState("")
    const [newNeededVolunteersErrorText, setNewNeededVolunteersErrorText] = useState("")
    const [newEventLocationErrorText, setNewEventLocationErrorText] = useState("")
    const [newEventVolunteerQualificationsErrorText, setNewEventVolunteerQualificationsErrorText] = useState("")

    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
    const [errorDialogText, setErrorDialogText] = useState("")

    // Handle opening and closing of the dialog for new event
    const handleClickOpen = () => {
        setIsDialogOpen(true)
        setNewEventStartDate(defaultNewStartDate)
        setNewEventEndDate(defaultNewEndDate)
    }

    const handleClose = () => {
        setIsDialogOpen(false)
        resetNewEventValues()
        resetErrors()
    }

    // Handle state changes for the new event dialog
    const handleNewSummaryChange = (event) => {
        setNewEventSummary(event.target.value)
    }

    const handleNewDescriptionChange = (event) => {
        setNewEventDescription(event.target.value)
    }

    const handleNewEventNeededVolunteersChange = (event) => {
        setNewEventNeededVolunteers(event.target.value)
    }

    const handleNewEventLocationChange = (event) => {
        setEventNewLocation(event.target.value)
    }

    const handleNewEventVolunteerQualificationsChange = (event) => {
        setNewEventVolunteerQualifications(event.target.value)
    }

    const handleNewEventStartDateChange = (value) => {
        setNewEventStartDate(value)
    }

    const handleNewEventEndDateChange = (value) => {
        setNewEventEndDate(value)
    }

    // Set states for event attributes back to default
    const resetNewEventValues = () => {
        setNewEventSummary(defaultNewSummary)
        setNewEventDescription(defaultNewDescription)
        setNewEventNeededVolunteers(defaultNewNeededVolunteers)
        setEventNewLocation(defaultNewLocation)
        setNewEventVolunteerQualifications(defaultNewVolunteerQualifications)
    }

    const resetErrors = () => {
        setNewEventSummaryError(false)
        setNewEventDescriptionError(false)
        setNewNeededVolunteersError(false)
        setNewEventLocationError(false)
        setNewEventVolunteerQualificationsError(false)
        setNewEventSummaryErrorText("")
        setNewEventDescriptionErrorText("")
        setNewNeededVolunteersErrorText("")
        setNewEventLocationErrorText("")
        setNewEventVolunteerQualificationsErrorText("")

        setIsErrorDialogOpen(false)
        setErrorDialogText("")
    }

    // Create a new event in the database and ensure data on the frontend is up to date
    const handleSubmit = () => {

        // Generate an object with the information for the new event
        const newEvent = {
            summary: newEventSummary,
            description: newEventDescription,
            neededVolunteers: newEventNeededVolunteers,
            location: newEventLocation,
            volunteerQualifications: newEventVolunteerQualifications,
            startTime: newEventStartDate,
            endTime: newEventEndDate
        }

        // Send a request to the backend to create a new event
        api.post(`/api/events`, newEvent)
            .then(response => {
                setIsDialogOpen(false)
                updateEvents()
                resetNewEventValues()
            })
            .catch(handleResponseError)

        resetErrors()
    }

    const handleResponseError = (error) => {
        let fieldName = error.response.data.field
        let message = error.response.data.message
        switch (fieldName) {
            case 'summary':
                setNewEventSummaryError(true)
                setNewEventSummaryErrorText(message)
                break
            case 'description':
                setNewEventDescriptionError(true)
                setNewEventDescriptionErrorText(message)
                break
            case 'neededVolunteers':
                setNewNeededVolunteersError(true)
                setNewNeededVolunteersErrorText(message)
                break
            case 'location':
                setNewEventLocationError(true)
                setNewEventLocationErrorText(message)
                break
            case 'volunteerQualifications':
                setNewEventVolunteerQualificationsError(true)
                setNewEventVolunteerQualificationsErrorText(message)
                break
            default:
                alertError(error)
                break
        }
    }

    const alertError = (error) => {
        setErrorDialogText(error.response?.data?.message ? error.response.data.message : error.message)
        setIsErrorDialogOpen(true)
    }

    // Make an api call to the backend to update the list of events
    const updateEvents = () => {
        api.get(`/api/events`)
            .then(response => {
                setEvents(response.data ? response.data.events : [])
                console.log("Updating events");
            })
            .catch(err => console.error(err.message))
    }

    // The first time this component renders, update the Event
    useEffect(() => {
        updateEvents()
    }, [])

    const userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    // Build the event page
    return (
        <div>
            {/* Define the bar for the top of the screen, with its buttons */}
            <Bar title="Events">
                {userIsAdmin &&
                    <Tooltip title="Add">
                        <IconButton aria-label="add" size="large" onClick={handleClickOpen}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                }
            </Bar>

            {/* Include the EventTable component here. This component is defined above */}
            <EventTable rows={events} eventUpdate={updateEvents} />

            {/* Create the dialog box that will pop up when the Add button is pressed. This will add a new event to the database */}
            <Dialog open={isDialogOpen} onClose={handleClose}>
                <DialogTitle>Create an Event</DialogTitle>
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
                                id="Summary"
                                label="Summary"
                                type="text"
                                fullWidth
                                required
                                variant="filled"
                                margin="none"
                                onChange={handleNewSummaryChange}
                                value={newEventSummary}
                                inputProps={{ maxLength: maxSummaryLength }}
                                error={newEventSummaryError}
                                helperText={newEventSummaryError ? newEventSummaryErrorText : `${newEventSummary.length}/${maxSummaryLength}`}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="Description"
                                label="Description"
                                type="text"
                                fullWidth
                                rows={5}
                                multiline
                                variant="filled"
                                margin="none"
                                onChange={handleNewDescriptionChange}
                                value={newEventDescription}
                                inputProps={{ maxLength: maxDescriptionLength }}
                                error={newEventDescriptionError}
                                helperText={newEventDescriptionError ? newEventDescriptionErrorText : `${newEventDescription.length}/${maxDescriptionLength}`}
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
                                onChange={handleNewEventNeededVolunteersChange}
                                value={newEventNeededVolunteers}
                                inputProps={{ maxLength: 5 }}
                                error={newNeededVolunteersError}
                                helperText={newNeededVolunteersErrorText}
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
                                onChange={handleNewEventLocationChange}
                                value={newEventLocation}
                                inputProps={{ maxLength: maxLocationLength }}
                                error={newEventLocationError}
                                helperText={newEventLocationError ? newEventLocationErrorText : `${newEventLocation.length}/${maxLocationLength}`}
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
                                onChange={handleNewEventVolunteerQualificationsChange}
                                value={newEventVolunteerQualifications}
                                inputProps={{ maxLength: maxVolunteerQualificationsLength }}
                                error={newEventVolunteerQualificationsError}
                                helperText={newEventVolunteerQualificationsError ? newEventVolunteerQualificationsErrorText : `${newEventVolunteerQualifications.length}/${maxVolunteerQualificationsLength}`}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Start Date"
                                    required
                                    variant="filled"
                                    value={newEventStartDate}
                                    onChange={handleNewEventStartDateChange}
                                    renderInput={(params) => <TextField margin="none" {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="end Date"
                                    required
                                    variant="filled"
                                    value={newEventEndDate}
                                    onChange={handleNewEventEndDateChange}
                                    renderInput={(params) => <TextField margin="none" {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}