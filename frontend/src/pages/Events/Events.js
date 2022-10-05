// Import React stuff
import React, { useState, useEffect } from "react";

// Import utilites and components
import api from "../../utils/api";
import useUserStore from "../../utils/Stores"
import Bar from "../../components/AppBar";
import { EventTable } from './EventTable';

// Import icons from mui
import AddIcon from '@mui/icons-material/AddCircle';

// Import general mui stuff
import { Button, IconButton, TextareaAutosize, Tooltip } from "@mui/material";

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
    const defaultNewStartDate = new Date()
    const defaultNewEndDate = new Date()
    defaultNewEndDate.setDate(defaultNewEndDate.getDate() + 1)
    const maxSummaryLength = 100
    const maxDescriptionLength = 500

    // Define a piece of state to use to store information from the api call
    const [events, setEvents] = useState([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newEventSummary, setNewEventSummary] = useState(defaultNewSummary)
    const [newEventDescription, setNewEventDescription] = useState(defaultNewDescription)
    const [newEventStartDate, setNewEventStartDate] = useState(defaultNewStartDate)
    const [newEventEndDate, setNewEventEndDate] = useState(defaultNewEndDate)

    // Handle opening and closing of the dialog for new event
    const handleClickOpen = () => {
        setIsDialogOpen(true)
    }

    const handleClose = () => {
        setIsDialogOpen(false)
        updateEvents()

        resetNewEventValues()
    }

    // Handle state changes for the new event dialog
    const handleNewSummaryChange = (event) => {
        setNewEventSummary(event.target.value)
    }

    const handleNewDescriptionChange = (event) => {
        setNewEventDescription(event.target.value)
    }

    const handleNewEventStartDateChange = (event) => {
        setNewEventStartDate(event.target.value)
    }

    const handleNewEventEndDateChange = (event) => {
        setNewEventEndDate(event.target.value)
    }

    // Set states for event attributes back to default
    const resetNewEventValues = () => {
        setNewEventSummary(defaultNewSummary)
        setNewEventDescription(defaultNewDescription)
        setNewEventStartDate(defaultNewStartDate)
        setNewEventEndDate(defaultNewEndDate)
    }

    // Create a new event in the database and ensure data on the frontend is up to date
    const handleSubmit = () => {
        setIsDialogOpen(false)

        let currentUserID = useUserStore.getState().UserID

        // Generate an object with the information for the new event
        const newEvent = {
            summary: newEventSummary,
            description: newEventDescription,
            startTime: newEventStartDate,
            endTime: newEventEndDate,
            userIDCreatedBy: currentUserID,
            userIDLastModifiedBy: currentUserID
        }

        // Send a request to the backend to create a new event
        api.post(`/api/events`, newEvent)
            .then(response => {
                updateEvents()
            })

        resetNewEventValues()
    }

    // Make an api call to the backend to update the list of events
    const updateEvents = () => {
        api.get(`/api/events`)
            .then(response => {
                setEvents(response.data ? response.data.rows : [])
                console.log("Updating events");
            })
            .catch(err => console.log(err))
    }

    // The first time this component renders, update the Event
    useEffect(() => {
        updateEvents()
    }, [])

    // Build the event page
    return (
        <div>
            {/* Define the bar for the top of the screen, with its buttons */}
            <Bar title="Events">
                <Tooltip title="Add">
                    <IconButton aria-label="add" size="large" onClick={handleClickOpen}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Bar>

            {/* Include the EventTable component here. This component is defined above */}
            <EventTable rows={events} eventUpdate={updateEvents} />

            {/* Create the dialog box that will pop up when the Add button is pressed. This will add a new event to the database */}
            <Dialog open={isDialogOpen} onClose={handleClose}>
                <DialogTitle>Create a Event</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        id="Summary"
                        label="Summary"
                        type="text"
                        fullWidth
                        required
                        variant="filled"
                        margin="normal"
                        onChange={handleNewSummaryChange}
                        value={newEventSummary}
                        inputProps={{ maxLength: maxSummaryLength }}
                        helperText={`${newEventSummary.length}/${maxSummaryLength}`}
                    />
                    <TextareaAutosize
                        id="Description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="filled"
                        margin="normal"
                        onChange={handleNewDescriptionChange}
                        value={newEventDescription}
                        inputProps={{ maxLength: maxDescriptionLength }}
                        helperText={`${newEventDescription.length}/${maxDescriptionLength}`}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            label="Start Date" 
                            required
                            variant="filled"
                            value={newEventStartDate} 
                            onChange={handleNewEventStartDateChange} 
                            renderInput={(params) => <TextField margin="normal" {...params} />} 
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            label="end Date"
                            required
                            variant="filled"
                            value={newEventEndDate} 
                            onChange={handleNewEventEndDateChange} 
                            renderInput={(params) => <TextField margin="normal" {...params} />} 
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}