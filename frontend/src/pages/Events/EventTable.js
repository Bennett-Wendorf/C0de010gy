// Import React stuff
import React, { useState } from "react";

// Import utilities and components
import api from "../../utils/api";

// Import general mui stuff
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextareaAutosize } from '@mui/material';

// Import dialog stuff from mui
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

// Import date picker and localization
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// Setup a general format for dates
const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }

// Create a component for the table of events
export function EventTable({ rows, eventUpdate }) {

    const maxSummaryLength = 100
    const maxDescriptionLength = 500

    const defaultUpdateSummary = ""
    const defaultUpdateDescription = ""
    const defaultUpdateStartDate = new Date()
    const defaultUpdateEndDate = new Date()
    defaultUpdateEndDate.setDate(defaultUpdateEndDate.getDate() + 1)

    // Create relevant pieces of state for the dialog popups
    const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState({})

    // Create pieces of state for handling event updates
    const [updateSummary, setUpdateSummary] = useState(defaultUpdateSummary)
    const [updateDescription, setUpdateDescription] = useState(defaultUpdateDescription)
    const [updateStartDate, setUpdateStartDate] = useState(defaultUpdateStartDate)
    const [updateEndDate, setUpdateEndDate] = useState(defaultUpdateEndDate)

    // Handle when a row is clicked and set up the pieces of state
    const handleRowClick = (event) => {
        setSelectedEvent(event)
        setUpdateSummary(defaultUpdateSummary)
        setUpdateDescription(defaultUpdateDescription)
        setUpdateStartDate(defaultUpdateStartDate)
        setUpdateEndDate(defaultUpdateEndDate)
        setIsModifyDialogOpen(true)
    }

    // Functions to handle changes in values for modification dialog
    const handleUpdateSummaryChange = (event) => {
        setUpdateSummary(event.target.value)
    }

    const handleUpdateDescriptionChange = (event) => {
        setUpdateDescription(event.target.value)
    }

    const handleUpdateStartDateChange = (event) => {
        setUpdateStartDate(event.target.value)
    }

    const handleUpdateEndDateChange = (event) => {
        setUpdateEndDate(event.target.value)
    }

    const handleClose = () => {
        setIsModifyDialogOpen(false)
    }

    const handleConfirmationClose = () => {
        setIsDeleteConfOpen(false)
    }

    const handleDeleteConfirmation = () => {
        setIsDeleteConfOpen(true)
    }

    // Handle database update on submission of the dialog
    const handleSubmit = () => {
        setIsModifyDialogOpen(false)

        // Create the new updated event object
        const updatedEvent = {
            eventID: selectedEvent.eventID,
            summary: updateSummary,
            description: updateDescription,
            startDate: updateStartDate,
            endDate: updateEndDate
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
        api.delete(`/api/events/delete/${selectedEvent.eventID}`)
            .then(response => {
                eventUpdate()
            })
    }

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
                            <TableCell align="right">Start Date</TableCell>
                            <TableCell align="right">End Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Map each event from the backend to a row in the table */}
                        {rows.map((row) => (
                            <TableRow
                                key={row.EventID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                onClick={(event) => handleRowClick(row)}
                                hover
                            >
                                <TableCell>{row.Summary}</TableCell>
                                <TableCell align="right" size="small">{row.StartDate.toLocaleDateString("en-US", dateFormatOptions)}</TableCell>
                                <TableCell align="right" size="small">{row.EndDate.toLocaleDateString("en-US", dateFormatOptions)}</TableCell>
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
                    <TextField 
                        autoFocus 
                        id="Title" 
                        label="Title" 
                        type="text" 
                        fullWidth 
                        variant="outlined" 
                        margin="normal" 
                        onChange={handleUpdateSummaryChange} 
                        value={updateSummary} 
                        inputProps={{ maxLength: maxSummaryLength }}
                         helperText={`${updateSummary.length}/${maxSummaryLength}`} 
                    />
                    <TextareaAutosize
                        id="Description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="filled"
                        margin="normal"
                        onChange={handleUpdateDescriptionChange}
                        value={updateDescription}
                        inputProps={{ maxLength: maxDescriptionLength }}
                        helperText={`${updateDescription.length}/${maxDescriptionLength}`}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            label="Start Date" 
                            required
                            variant="filled"
                            value={updateStartDate} 
                            onChange={handleUpdateStartDateChange} 
                            renderInput={(params) => <TextField margin="normal" {...params} />} 
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            label="end Date"
                            required
                            variant="filled"
                            value={updateEndDate} 
                            onChange={handleUpdateEndDateChange} 
                            renderInput={(params) => <TextField margin="normal" {...params} />} 
                        />
                    </LocalizationProvider>
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
        </>
    )
}