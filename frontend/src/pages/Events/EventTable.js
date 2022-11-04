// Import React stuff
import React, { useState } from "react";

// Import utilities and components
import api from "../../utils/api";
import AuthService from '../../services/auth.service'

// Import general mui stuff
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

import ModifyEventDialog from "../../components/Event/ModifyEventDialog";

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

const dateColorStyles = (value) => (theme) => {
    return new Date(value) < new Date() ? { color: theme.palette.text.disabled } : { color: theme.palette.text.primary }
}

// Create a component for the table of events
export function EventTable({ rows, eventUpdate }) {

    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
    
    const [selectedEvent, setSelectedEvent] = useState({})

    const [hasVolunteered, setHasVolunteered] = useState(false)
    const [hasDonated, setHasDonated] = useState(false)

    // Handle when a row is clicked and set up the pieces of state
    const handleRowClick = (event) => {
        setSelectedEvent(event)
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

    const checkIfDonated = async (event) => {
        return api.get(`/api/events/${event.EventID}/donate`)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return false
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
                                <TableCell align="left" size="small" sx={dateColorStyles(row.StartTime)}>
                                    {new Date(row.StartTime).toLocaleString("en-US", dateFormatOptions)}
                                </TableCell>
                                <TableCell align="left" size="small"sx={dateColorStyles(row.EndTime)}>
                                    {new Date(row.EndTime).toLocaleString("en-US", dateFormatOptions)}
                                </TableCell>
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

            <ModifyEventDialog 
                selectedEvent={selectedEvent} 
                hasDonated={hasDonated} 
                hasVolunteered={hasVolunteered} 
                isViewDialogOpen={isViewDialogOpen}
                setIsViewDialogOpen={setIsViewDialogOpen}
                isModifyDialogOpen={isModifyDialogOpen}
                setIsModifyDialogOpen={setIsModifyDialogOpen}
                eventUpdate={eventUpdate}
            />
        </>
    )
}