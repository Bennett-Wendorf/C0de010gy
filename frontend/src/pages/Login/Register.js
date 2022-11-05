// Import React stuff
import React, { useState } from "react";

// Import utilites and components
import api from "../../utils/api";

// Import form control stuff from mui
import { 
    TextField, 
    Container, 
    CssBaseline, 
    Grid, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    formControlClasses, 
    Checkbox, 
    FormControlLabel
} from "@mui/material";

// Import general mui stuff
import { Avatar, Typography, Card, Box, Button, Link } from "@mui/material";

import Person from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";

const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 5
}

const checkboxStyles = {
    display: 'flex',
    justifyContent: 'center',
}

export function Register() {
    const [firstNameError, setFirstNameError] = useState(false)
    const [LastNameError, setLastNameError] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordConfirmError, setPasswordConfirmError] = useState(false)
    const [firstNameErrorText, setFirstNameErrorText] = useState("")
    const [lastNameErrorText, setLastNameErrorText] = useState("")
    const [usernameErrorText, setUsernameErrorText] = useState("")
    const [emailErrorText, setEmailErrorText] = useState("")
    const [passwordErrorText, setPasswordErrorText] = useState("")
    const [passwordConfirmErrorText, setPasswordConfirmErrorText] = useState("")

    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        resetErrors()
        const data = new FormData(event.currentTarget)

        let password = data.get('password')
        let passwordConfirm = data.get('passwordConfirm')
        if (password !== passwordConfirm) {
            setPasswordError(true)
            setPasswordConfirmError(true)
            setPasswordConfirmErrorText("Passwords do not match")
            return
        }

        let newRoles = []
        if (data.get('isVolunteer')) {
            newRoles.push('Volunteer')
        }
        if (data.get('isDonor')){ 
            newRoles.push('Donor')
        }

        const newUser = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            username: data.get('username'),
            password: password,
            email: data.get('email'),
            roles: newRoles
        }

        api.post(`/api/auth/register`, newUser).then((response) => {
            setIsConfirmationDialogOpen(true)
        }).catch(handleResponseError)
    }

    const resetErrors = () => {
        setFirstNameError(false)
        setLastNameError(false)
        setUsernameError(false)
        setEmailError(false)
        setPasswordError(false)
        setPasswordConfirmError(false)
        setFirstNameErrorText("")
        setLastNameErrorText("")
        setUsernameErrorText("")
        setEmailErrorText("")
        setPasswordErrorText("")
        setPasswordConfirmErrorText("")
    }


    const handleResponseError = (error) => {
        let fieldName = error.response.data.field
        let message = error.response.data.message
        switch(fieldName) {
            case 'username':
                setUsernameError(true)
                setUsernameErrorText(message)
                break
            case 'email':
                setEmailError(true)
                setEmailErrorText(message)
                break
            case 'password':
                setPasswordError(true)
                setPasswordErrorText(message)
                break
            case 'passwordConfirm':
                setPasswordConfirmError(true)
                setPasswordConfirmErrorText(message)
                break
            case 'firstName':
                setFirstNameError(true)
                setFirstNameErrorText(message)
                break
            case 'lastName':
                setLastNameError(true)
                setLastNameErrorText(message)
                break
            default:
                break
        }
    }

    const handleConfirmationOK = () => {
        setIsConfirmationDialogOpen(formControlClasses)
        navigate('/login')
    }

    return (
        <div>
            {/* Create the dialog box that will pop up when the Add button is pressed. This will add a new task to the database */}
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Card sx={cardStyles}>
                    <Avatar sx={{ mb: 3, bgcolor: 'secondary.main' }}>
                        <Person />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    variant="filled"
                                    error={firstNameError}
                                    helperText={firstNameErrorText}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="family-name"
                                    name="lastName"
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    variant="filled"
                                    error={LastNameError}
                                    helperText={lastNameErrorText}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="email"
                                    name="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    variant="filled"
                                    error={emailError}
                                    helperText={emailErrorText}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="username"
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    variant="filled"
                                    error={usernameError}
                                    helperText={usernameErrorText}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="new-password"
                                    name="password"
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    variant="filled"
                                    type="password"
                                    error={passwordError}
                                    helperText={passwordErrorText}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="new-password"
                                    name="passwordConfirm"
                                    required
                                    fullWidth
                                    id="passwordConfirm"
                                    label="Confirm Password"
                                    variant="filled"
                                    type="password"
                                    error={passwordConfirmError}
                                    helperText={passwordConfirmErrorText}
                                />
                            </Grid>
                            <Grid item xs={12} sx={checkboxStyles}>
                                <FormControlLabel
                                    control={<Checkbox name="isVolunteer" id="isVolunteer" color="primary" />}
                                    label="Volunteer"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="isDonor" id="isDonor" color="primary" />}
                                    label="Donor"
                                    labelPlacement="top"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                            <Grid item>
                            <Link href="/" variant="body2">
                                You can also skip registration and sign in as a guest
                            </Link>
                        </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Container>
            <Dialog open={isConfirmationDialogOpen} onClose={handleConfirmationOK}>
                <DialogTitle>New Account Created Successfully</DialogTitle>
                <DialogContent>Your new account has been created successfully. You will now be directed to login.</DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleConfirmationOK}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}