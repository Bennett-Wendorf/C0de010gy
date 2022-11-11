// Import React stuff
import React, { useState, useEffect } from "react";

// Import utilities and components
import api from "../../utils/api";
import Bar from "../../components/AppBar";

// Import icons from mui
import AddIcon from '@mui/icons-material/AddCircle';

// Import general mui stuff
import { Button, IconButton, Tooltip, Grid, Paper, InputAdornment, Snackbar, Alert } from "@mui/material";

// Import table stuff
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody } from "@mui/material";

// Import dialog stuff from mui
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

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

// Create a component for the Events page
export function Donations() {

    // Define default values for new donations
    const defaultNewAmount = "0"

    // Define a piece of state to use to store information from the api call
    const [donations, setDonations] = useState([])

    const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false)
    const [isActionSuccessOpen, setIsActionSuccessOpen] = useState(false)

    const [newDonationAmount, setNewDonationAmount] = useState(defaultNewAmount)
    const [donateSuccessMessage, setDonateSuccessMessage] = useState("")

    // Error text state
    const [newDonationAmountError, setNewDonationAmountError] = useState(false)
    const [newDonationAmountErrorText, setNewDonationAmountErrorText] = useState("")

    // Handle opening and closing of the dialog for new donation
    const handleClickOpen = () => {
        resetErrors()
        setIsDonateDialogOpen(true)
    }

    const handleClose = () => {
        setIsDonateDialogOpen(false)
        resetNewDonationValues()
    }

    const handleActionSuccessClose = () => {
        setIsActionSuccessOpen(false)
        resetErrors()
    }

    // Handle state changes for the new donation dialog
    const handleNewDonationAmountChange = (event) => {
        setNewDonationAmount(event.target.value)
    }

    // Set states for donation attributes back to default
    const resetNewDonationValues = () => {
        setNewDonationAmount(defaultNewAmount)
    }

    const resetErrors = () => {
        setNewDonationAmountError(false)
        setNewDonationAmountErrorText("")
    }

    // Create a new event in the database and ensure data on the frontend is up to date
    const handleDonate = () => {

        // Generate an object with the information for the new event
        const newDonation = {
            amount: newDonationAmount
        }

        // Send a request to the backend to create a new event
        api.post(`/api/donations`, newDonation)
            .then(response => {
                setIsDonateDialogOpen(false)
                setDonateSuccessMessage(response.data.message)
                setIsActionSuccessOpen(true)
                updateDonations()
            })
            .catch(handleResponseError)
    }

    const handleResponseError = (error) => {
        let fieldName = error?.response?.data?.field
        let message = error?.response?.data?.message
        switch (fieldName) {
            case 'amount':
                setNewDonationAmountError(true)
                setNewDonationAmountErrorText(message)
                break
            case 'general':
                alert(message)
                break
            default:
                break
        }
    }

    // Make an api call to the backend to update the list of events
    const updateDonations = () => {
        api.get(`/api/donations`)
            .then(response => {
                setDonations(response.data ? response.data : [])
                console.log("Updating donations");
            })
            .catch(err => console.error(err.message))
    }

    // The first time this component renders, update the Event
    useEffect(() => {
        updateDonations()
    }, [])

    // Build the event page
    return (
        <div>
            {/* Define the bar for the top of the screen, with its buttons */}
            <Bar title="Donations">
                <Tooltip title="Add">
                    <IconButton aria-label="add" size="large" onClick={handleClickOpen}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Bar>

            <TableContainer component={Paper}>
                <Table aria-label="Events">
                    {/* Generate the headers of the rows */}
                    <TableHead>
                        <TableRow>
                            <TableCell>Event Summary</TableCell>
                            <TableCell align="left">Date Donated</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Map each event from the backend to a row in the table */}
                        {donations.map((donation) => (
                            <TableRow
                                key={donation.DonationID}
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

            {/* Create the dialog box that will pop up when the Add button is pressed. This will add a new general donation to the database */}
            <Dialog open={isDonateDialogOpen} onClose={handleClose}>
                <DialogTitle>
                    Donate to C0de010gy
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
                                value={newDonationAmount}
                                onChange={handleNewDonationAmountChange}
                                error={newDonationAmountError}
                                helperText={newDonationAmountErrorText}
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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDonate} color="primary">Donate</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={isActionSuccessOpen} autoHideDuration={6000} onClose={handleActionSuccessClose}>
                <Alert onClose={handleActionSuccessClose} severity="success" sx={{ width: '100%' }} variant="outlined">
                    {donateSuccessMessage}
                </Alert>
            </Snackbar>
        </div >
    );
}