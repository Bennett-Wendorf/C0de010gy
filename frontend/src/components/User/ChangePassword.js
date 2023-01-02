import React, { useState } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputAdornment, IconButton, Tooltip, Snackbar, Alert } from '@mui/material'
import HelpDialog from '../HelpDialog';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import api from '../../utils/api';

export default function ChangePassword({ open, setOpen, user }) {

    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarError, setSnackbarError] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
    const [newPasswordVisible, setNewPasswordVisible] = useState(false)
    const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false)

    const [currentPasswordError, setCurrentPasswordError] = useState(false)
    const [newPasswordError, setNewPasswordError] = useState(false)
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false)
    const [currentPasswordErrorText, setCurrentPasswordErrorText] = useState('')
    const [newPasswordErrorText, setNewPasswordErrorText] = useState('')
    const [confirmNewPasswordErrorText, setConfirmNewPasswordErrorText] = useState('')

    const handleClose = () => {
        setOpen(false)
        resetState()
    }

    const resetState = async () => {
        await setCurrentPassword('')
        await setNewPassword('')
        await setConfirmNewPassword('')
        await resetErrors()
    }

    const resetErrors = async () => {
        await setCurrentPasswordError(false)
        await setNewPasswordError(false)
        await setConfirmNewPasswordError(false)
        await setCurrentPasswordErrorText('')
        await setNewPasswordErrorText('')
        await setConfirmNewPasswordErrorText('')
    }

    const handleSubmit = async () => {
        await resetErrors()

        if (newPassword !== confirmNewPassword) {
            setNewPasswordError(true)
            setConfirmNewPasswordError(true)
            setConfirmNewPasswordErrorText("Passwords do not match")
            return
        }

        api.post(`/api/users/${user.UserID}/changePassword`, {
            password: currentPassword,
            newPassword: newPassword
        }).then(response => {
            handleClose()
            setSnackbarMessage("Password changed successfully")
            setIsSnackbarOpen(true)
        }).catch(error => {
            let fieldName = error.response?.data?.field ?? 'Something went wrong'
            let message = error.response?.data?.message ?? 'general'
            switch (fieldName) {
                case 'password':
                    setCurrentPasswordError(true)
                    setCurrentPasswordErrorText(message)
                    break
                case 'newPassword':
                    setNewPasswordError(true)
                    setNewPasswordErrorText(message)
                    break
                case 'confirmNewPassword':
                    setConfirmNewPasswordError(true)
                    setConfirmNewPasswordErrorText(message)
                    break
                default:
                    setSnackbarError(true)
                    setSnackbarMessage(message)
                    setIsSnackbarOpen(true)
                    break
            }
        })
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Change Password
                    <HelpDialog messages={[
                        'This dialog can be used to change the user\'s password.',
                    ]} usedInDialog={true} />
                </DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Current Password"
                                type={currentPasswordVisible ? "text" : "password"}
                                variant="filled"
                                autoComplete="current-password"
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                value={currentPassword}
                                error={currentPasswordError}
                                helperText={currentPasswordErrorText}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            {currentPasswordVisible ?
                                                <Tooltip title="Hide Password">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setCurrentPasswordVisible(false)}
                                                    >
                                                        <VisibilityOffIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                :
                                                <Tooltip title="Show Password">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setCurrentPasswordVisible(true)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>

                                            }
                                        </InputAdornment>
                                }}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="New Password"
                                id='newPassword'
                                name='newPassword'
                                type={newPasswordVisible ? "text" : "password"}
                                variant="filled"
                                autoComplete="new-password"
                                onChange={(event) => setNewPassword(event.target.value)}
                                value={newPassword}
                                error={newPasswordError}
                                helperText={newPasswordErrorText}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            {newPasswordVisible ?
                                                <Tooltip title="Hide Password">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setNewPasswordVisible(false)}
                                                    >
                                                        <VisibilityOffIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                :
                                                <Tooltip title="Show Password">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setNewPasswordVisible(true)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>

                                            }
                                        </InputAdornment>
                                }}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Confirm New Password"
                                id='confirmNewPassword'
                                name='confirmNewPassword'
                                type={confirmNewPasswordVisible ? "text" : "password"}
                                variant="filled"
                                autoComplete="new-password"
                                onChange={(event) => setConfirmNewPassword(event.target.value)}
                                value={confirmNewPassword}
                                error={confirmNewPasswordError}
                                helperText={confirmNewPasswordErrorText}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            {confirmNewPasswordVisible ?
                                                <Tooltip title="Hide Password">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setConfirmNewPasswordVisible(false)}
                                                    >
                                                        <VisibilityOffIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                :
                                                <Tooltip title="Show Password">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setConfirmNewPasswordVisible(true)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>

                                            }
                                        </InputAdornment>
                                }}
                            />
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="error">Change Password</Button>
                </DialogActions>
            </Dialog>

            {/* Create the alert snackbar */}
            <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
                <Alert onClose={() => setIsSnackbarOpen(false)} severity={snackbarError ? "error" : "success"} sx={{ width: '100%' }} variant='outlined'>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}