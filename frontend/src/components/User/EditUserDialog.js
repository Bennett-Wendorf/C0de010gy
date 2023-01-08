import React, { useEffect, useState } from 'react';

import { Dialog, Button, DialogTitle, DialogActions, DialogContent, Snackbar, Alert, TextField, MenuItem, Link } from '@mui/material';
import HelpDialog from '../HelpDialog';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import api from '../../utils/api';
import AuthService from '../../services/auth.service';
import useUserStore from '../../utils/Stores'
import ChangePassword from './ChangePassword';

export default function EditUserDialog({ open, setOpen, user, setUser }) {

    const maxFirstNameLength = 50;
    const maxLastNameLength = 50;
    const maxEmailLength = 100;
    const maxUsernameLength = 100;

    const [possibleRoles, setPossibleRoles] = useState([])

    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

    const [updateFirstName, setUpdateFirstName] = useState(user.FirstName);
    const [updateLastName, setUpdateLastName] = useState(user.LastName);
    const [updateEmail, setUpdateEmail] = useState(user.Email);
    const [updateUsername, setUpdateUsername] = useState(user.Username);
    const [updateRoles, setUpdateRoles] = useState([]);

    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarError, setSnackbarError] = useState(false);

    const [firstNameError, setFirstNameError] = useState(false);
    const [LastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [rolesError, setRolesError] = useState(false);
    const [firstNameErrorText, setFirstNameErrorText] = useState('');
    const [lastNameErrorText, setLastNameErrorText] = useState('');
    const [emailErrorText, setEmailErrorText] = useState('');
    const [usernameErrorText, setUsernameErrorText] = useState('');
    const [rolesErrorText, setRolesErrorText] = useState('');

    const resetState = () => {
        setUpdateFirstName(user.FirstName);
        setUpdateLastName(user.LastName);
        setUpdateEmail(user.Email);
        setUpdateUsername(user.Username);
        setupUsersRoles(user.UserRoles);
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        setUsernameError(false);
        setFirstNameErrorText('');
        setLastNameErrorText('');
        setEmailErrorText('');
        setUsernameErrorText('');
    }

    let userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    const setupPossibleRoles = (roles) => {
        let roleNames = [];
        roles.forEach((role) => {
            if (role.DisplayName !== "Demo User" && (userIsAdmin || role.DisplayName !== 'Administrator')) { // Only allow admins to add/remove admin role
                roleNames.push(role.DisplayName);
            }
        });
        setPossibleRoles(roleNames);
    }

    const handleClose = () => {
        setOpen(false);
        resetState();
    }

    const updatedLoggedInUser = (updatedUser) => {
        if (useUserStore.getState().UserID === updatedUser.UserID) {
            useUserStore.setState({ FullName: updatedUser.FullName, Roles: updatedUser.UserRoles ?? [] })
        }
    }

    const handleSave = () => {
        api.post(`/api/users/${user.UserID}`, {
            firstName: updateFirstName,
            lastName: updateLastName,
            email: updateEmail,
            username: updateUsername,
            roles: updateRoles,
        })
            .then((response) => {
                setUser(response.data.user);
                updatedLoggedInUser(response.data.user);
                handleClose();
                setIsSnackbarOpen(true)
                setSnackbarError(false)
                setSnackbarMessage(response.data.message)
            })
            .catch((err) => {
                handleClose()
                handleResponseError(err)
            })
    }

    const handleResponseError = (error) => {
        let fieldName = error.response?.data?.field ?? ""
        let message = error.response?.data?.message ?? error.message
        switch (fieldName) {
            case 'username':
                setUsernameError(true)
                setUsernameErrorText(message)
                break
            case 'email':
                setEmailError(true)
                setEmailErrorText(message)
                break
            case 'firstName':
                setFirstNameError(true)
                setFirstNameErrorText(message)
                break
            case 'lastName':
                setLastNameError(true)
                setLastNameErrorText(message)
                break
            case 'roles':
                setRolesError(true)
                setRolesErrorText(message)
                break
            default:
                setSnackbarError(true)
                setSnackbarMessage(message)
                setIsSnackbarOpen(true)
                break
        }
    }

    const setupUsersRoles = (roles) => {
        let roleNames = [];
        roles.forEach((role) => {
            roleNames.push(role.DisplayName);
        });
        setUpdateRoles(roleNames);
    }

    useEffect(() => {
        setUpdateFirstName(user.FirstName);
        setUpdateLastName(user.LastName);
        setUpdateEmail(user.Email);
        setUpdateUsername(user.Username);
        setupUsersRoles(user.UserRoles ?? []);
    }, [user]);

    useEffect(() => {
        api.get('/api/users/roles')
            .then((response) => {
                setupPossibleRoles(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Edit User
                    <HelpDialog messages={[
                        'This menu can be used to edit the user\'s information.',
                        'The user\'s name, email, and password can be changed.',
                        'In addition, the user\'s roles can be added or removed.',
                    ]} usedInDialog={true} />
                </DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                variant="filled"
                                onChange={(event) => setUpdateFirstName(event.target.value)}
                                value={updateFirstName}
                                inputProps={{ maxLength: maxFirstNameLength }}
                                error={firstNameError}
                                helperText={firstNameErrorText}
                            />
                        </Grid2>
                        <Grid2 item xs={12} sm={6}>
                            <TextField
                                autoComplete="family-name"
                                name="lastName"
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                variant="filled"
                                onChange={(event) => setUpdateLastName(event.target.value)}
                                value={updateLastName}
                                inputProps={{ maxLength: maxLastNameLength }}
                                error={LastNameError}
                                helperText={lastNameErrorText}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                autoComplete="email"
                                name="email"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                variant="filled"
                                onChange={(event) => setUpdateEmail(event.target.value)}
                                value={updateEmail}
                                inputProps={{ maxLength: maxEmailLength }}
                                error={emailError}
                                helperText={emailErrorText}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                autoComplete="username"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                variant="filled"
                                onChange={(event) => setUpdateUsername(event.target.value)}
                                value={updateUsername}
                                inputProps={{ maxLength: maxUsernameLength }}
                                error={usernameError}
                                helperText={usernameErrorText}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                select
                                fullWidth
                                name="Roles"
                                id="roles"
                                variant="filled"
                                label="Roles"
                                SelectProps={{
                                    multiple: true,
                                    value: updateRoles,
                                    onChange: (event) => setUpdateRoles(event.target.value),
                                }}
                                error={rolesError}
                                helperText={rolesErrorText}
                            >
                                {possibleRoles.map((role) => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </TextField>
                        </Grid2>
                        {AuthService.isCurrentUser(user.UserID) &&
                            <Grid2 item xs={12}>
                                <Link variant="body2" component="button" onClick={() => setChangePasswordDialogOpen(true)}>
                                    Change Your Password
                                </Link>
                            </Grid2>
                        }
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <ChangePassword open={changePasswordDialogOpen} setOpen={setChangePasswordDialogOpen} user={user} />

            {/* Create the alert snackbar */}
            <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={() => setIsSnackbarOpen(false)}>
                <Alert onClose={() => setIsSnackbarOpen(false)} severity={snackbarError ? "error" : "success"} sx={{ width: '100%' }} variant='outlined'>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}