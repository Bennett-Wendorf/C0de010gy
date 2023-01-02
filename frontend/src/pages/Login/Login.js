import React, { useState } from "react";
import { Grid, Link, Card, TextField, Container, CssBaseline, 
    Box, Avatar, Typography, Button, InputAdornment, Tooltip, IconButton } from "@mui/material";

import Person from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import AuthService from '../../services/auth.service'
const { useNavigate } = require('react-router-dom')

const cardStyles = {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 5
}

export function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false)

    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState("");
    const [passwordErrorText, setPasswordErrorText] = useState("");

    const navigate = useNavigate()

    // Handle the submission of a login form
    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        let username = data.get('username')
        let password = data.get('password')

        //validate a successful login prior to redirect
        AuthService.login(username, password).then(response => {
            navigate("/")
        }).catch(handleResponseError)
    }

    const handleResponseError = (error) => {
        let fieldName = error.response.data.field
        let message = error.response.data.message
        switch (fieldName) {
            case 'username':
                setUsernameError(true)
                setUsernameErrorText(message)
                break
            case 'password':
                setPasswordError(true)
                setPasswordErrorText(message)
                break
            case 'general':
                setPasswordError(true)
                setUsernameError(true)
                setPasswordErrorText(message)
                break
            default:
                break
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Card sx={cardStyles}>
                <Avatar sx={{ mb: 3, bgcolor: 'secondary.main' }}>
                    <Person />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Please Sign In To Continue
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        id="username"
                        label="Username"
                        name="username"
                        error={usernameError}
                        helperText={usernameErrorText}
                        margin="normal"
                        required
                        fullWidth
                        autoComplete="username"
                        variant="filled"
                        autoFocus
                    />
                    <TextField
                        id="password"
                        name="password"
                        error={passwordError}
                        helperText={passwordErrorText}
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type={passwordVisible ? "text" : "password"}
                        variant="filled"
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    {passwordVisible ?
                                        <Tooltip title="Hide Password">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setPasswordVisible(false)}
                                            >
                                                <VisibilityOffIcon />
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Show Password">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setPasswordVisible(true)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                    }
                                </InputAdornment>
                        }}
                    />
                    <Button
                        type="submit"
                        sx={[{ mt: 3, mb: 2 }]}
                        fullWidth
                        variant="contained"
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#/register" variant="body2">
                                Don't have an account? Sign up
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
    );
}