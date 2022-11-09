import React, { useEffect, useState } from "react"

import AuthService from "../../services/auth.service"
import api from "../../utils/api";

import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import { Button, Paper, Grid, TextField, Snackbar, Alert } from "@mui/material"

export default function Programs({ selectedEvent, open, onClose }) {

    const maxSummaryLength = 100
    const maxDescriptionLength = 500

    const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false);
    const [isUpdateProgramDialogOpen, setIsUpdateProgramDialogOpen] = useState(false);
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false);

    const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
    const [successSnackbarMessage, setSuccessSnackbarMessage] = useState("");
    const [addProgramErrorMessage, setAddProgramErrorMessage] = useState("");
    const [addProgramError, setAddProgramError] = useState(false);
    const [updateProgramErrorMessage, setUpdateProgramErrorMessage] = useState("");
    const [updateProgramError, setUpdateProgramError] = useState(false);

    const [newProgramSummary, setNewProgramSummary] = useState("");
    const [newProgramDescription, setNewProgramDescription] = useState("");

    const [updateProgramSummary, setUpdateProgramSummary] = useState("");
    const [updateProgramDescription, setUpdateProgramDescription] = useState("");

    const [newProgramSummaryError, setNewProgramSummaryError] = useState(false);
    const [newProgramDescriptionError, setNewProgramDescriptionError] = useState(false);
    const [newProgramSummaryErrorText, setNewProgramSummaryErrorText] = useState("");
    const [newProgramDescriptionErrorText, setNewProgramDescriptionErrorText] = useState("");

    const [updateProgramSummaryError, setUpdateProgramSummaryError] = useState(false);
    const [updateProgramDescriptionError, setUpdateProgramDescriptionError] = useState(false);
    const [updateProgramSummaryErrorText, setUpdateProgramSummaryErrorText] = useState("");
    const [updateProgramDescriptionErrorText, setUpdateProgramDescriptionErrorText] = useState("");

    const [programs, setPrograms] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState({});

    const handleAddProgramSubmit = () => {
        api.post(`/api/events/${selectedEvent.EventID}/programs`, {
            summary: newProgramSummary,
            description: newProgramDescription,
        })
            .then(res => {
                setPrograms([...programs, res.data.program]);
                setIsAddProgramDialogOpen(false);
                setSuccessSnackbarMessage("Program added successfully");
                setIsSuccessSnackbarOpen(true);
                resetNewProgramForm();
            }
            )
            .catch(err => {
                setAddProgramErrorMessage(err.response?.data?.message ? err.response.data.message : err.message)
                setAddProgramError(true);
            })
    }

    const handleAddProgramCancel = () => {
        setIsAddProgramDialogOpen(false);
        resetNewProgramForm();
    }

    const resetNewProgramForm = () => {
        setNewProgramSummary("");
        setNewProgramDescription("");
        setNewProgramSummaryError(false);
        setNewProgramDescriptionError(false);
        setNewProgramSummaryErrorText("");
        setNewProgramDescriptionErrorText("");
        setAddProgramErrorMessage("");
        setAddProgramError(false);
    }

    // TODO: Handle errors better here if they are on certain fields
    const handleUpdateProgramSubmit = () => {
        api.put(`/api/events/${selectedEvent.EventID}/programs/${selectedProgram.ProgramID}`, {
            summary: updateProgramSummary,
            description: updateProgramDescription,
        })
            .then(res => {
                const updatedPrograms = programs.map(program => {
                    if (program.ProgramID === selectedProgram.ProgramID) {
                        return res.data.program;
                    }
                    return program;
                })
                setPrograms(updatedPrograms);
                setIsUpdateProgramDialogOpen(false);
                setSuccessSnackbarMessage("Program updated successfully");
                setIsSuccessSnackbarOpen(true);
                resetUpdateProgramForm();
            })
            .catch(err => {
                setUpdateProgramErrorMessage(err.response?.data?.message ? err.response.data.message : err.message)
                setUpdateProgramError(true);
            })
    }

    const handleUpdateProgramCancel = () => {
        setIsUpdateProgramDialogOpen(false);
        resetUpdateProgramForm();
    }

    const resetUpdateProgramForm = () => {
        setUpdateProgramSummary("");
        setUpdateProgramDescription("");
        setUpdateProgramSummaryError(false);
        setUpdateProgramDescriptionError(false);
        setUpdateProgramSummaryErrorText("");
        setUpdateProgramDescriptionErrorText("");
        setUpdateProgramErrorMessage("");
        setUpdateProgramError(false);
    }

    const handleDelete = () => {
        api.delete(`/api/events/${selectedEvent.EventID}/programs/${selectedProgram.ProgramID}`)
            .then(res => {
                const updatedPrograms = programs.filter(program => program.ProgramID !== selectedProgram.ProgramID);
                setPrograms(updatedPrograms);
                setIsDeleteConfOpen(false);
                setSuccessSnackbarMessage("Program deleted successfully");
                setIsSuccessSnackbarOpen(true);
            })
            .catch(err => {
                setUpdateProgramErrorMessage(err.response?.data?.message ? err.response.data.message : err.message)
                setUpdateProgramError(true);
            })
    }

    useEffect(() => {
        if (selectedEvent) {
            api.get(`/api/events/${selectedEvent.EventID}/programs`)
                .then(res => {
                    setPrograms(res.data);
                })
                .catch(err => {
                    alert(err);
                })
        }
    }, [selectedEvent])

    const userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    return (
        <>
            {/* Popup dialog for editing programs that are part of an event */}
            <Dialog open={open} onClose={onClose} >
                <DialogTitle>
                    {userIsAdmin ? "Editing" : "Viewing"} Programs for Event "{selectedEvent.Summary}"
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table aria-label="Events">
                            {/* Generate the headers of the rows */}
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Summary</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Map each program from the backend to a row in the table */}
                                {programs.map((program) => (
                                    <TableRow
                                        key={program.ProgramID}
                                        hover={userIsAdmin}
                                        sx={{ '&:hover': { cursor: userIsAdmin ? 'pointer' : 'default' } }}
                                        onClick={() => {
                                            if (userIsAdmin) {
                                                setIsUpdateProgramDialogOpen(true);
                                                setSelectedProgram(program);
                                                setUpdateProgramSummary(program.Summary);
                                                setUpdateProgramDescription(program.Description);
                                            }
                                        }}
                                    >
                                        <TableCell size="small" align='center'>{program.Summary}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    {userIsAdmin && <Button onClick={() => setIsAddProgramDialogOpen(true)} color="primary" variant="contained">Add Program</Button>}
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for adding a program */}
            < Dialog open={isAddProgramDialogOpen} onClose={() => setIsAddProgramDialogOpen(false)} >
                <DialogTitle>
                    Add Program to Event "{selectedEvent.Summary}"
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {addProgramError &&
                            <Grid item xs={12}>
                                <Alert severity="error" variant='outlined'>{addProgramErrorMessage}</Alert>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                id="Summary"
                                label="Summary"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                required
                                disabled={!userIsAdmin}
                                value={newProgramSummary}
                                onChange={(e) => setNewProgramSummary(e.target.value)}
                                error={newProgramSummaryError}
                                helperText={newProgramSummaryError ? newProgramSummaryErrorText : `${newProgramSummary.length}/${maxSummaryLength}`}
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
                                required
                                disabled={!userIsAdmin}
                                value={newProgramDescription}
                                onChange={(e) => setNewProgramDescription(e.target.value)}
                                error={newProgramDescriptionError}
                                helperText={newProgramDescriptionError ? newProgramDescriptionErrorText : `${newProgramDescription.length}/${maxDescriptionLength}`}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddProgramCancel}>Close</Button>
                    <Button onClick={handleAddProgramSubmit}>Submit</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for editing a program */}
            < Dialog open={isUpdateProgramDialogOpen} onClose={() => setIsUpdateProgramDialogOpen(false)} >
                <DialogTitle>
                    Edit Program "{selectedProgram.Summary}"
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {updateProgramError &&
                            <Grid item xs={12}>
                                <Alert severity="error" variant='outlined'>{updateProgramErrorMessage}</Alert>
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                id="Summary"
                                label="Summary"
                                type="text"
                                fullWidth
                                variant="filled"
                                margin="none"
                                required
                                disabled={!userIsAdmin}
                                value={updateProgramSummary}
                                onChange={(e) => setUpdateProgramSummary(e.target.value)}
                                error={updateProgramSummaryError}
                                helperText={updateProgramSummaryError ? updateProgramSummaryErrorText : `${updateProgramSummary.length}/${maxSummaryLength}`}
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
                                required
                                disabled={!userIsAdmin}
                                value={updateProgramDescription}
                                onChange={(e) => setUpdateProgramDescription(e.target.value)}
                                error={updateProgramDescriptionError}
                                helperText={updateProgramDescriptionError ? updateProgramDescriptionErrorText : `${updateProgramDescription.length}/${maxDescriptionLength}`}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteConfOpen(true)} color="error">Delete Program</Button>
                    <Button onClick={handleUpdateProgramCancel}>Close</Button>
                    <Button onClick={handleUpdateProgramSubmit}>Submit</Button>
                </DialogActions>
            </Dialog >

            {/* Popup dialog for confirming deletion of a program */}
            < Dialog open={isDeleteConfOpen} onClose={() => setIsDeleteConfOpen(false)} >
                <DialogTitle>
                    Confirm
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to delete program: "{selectedProgram.Summary}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setIsDeleteConfOpen(false)
                        setIsUpdateProgramDialogOpen(false)
                    }}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Confirm Delete</Button>
                </DialogActions>
            </Dialog >

            <Snackbar open={isSuccessSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSuccessSnackbarOpen(false)}>
                <Alert onClose={() => setIsSuccessSnackbarOpen(false)} severity="success" sx={{ width: '100%' }} variant='outlined'>
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}