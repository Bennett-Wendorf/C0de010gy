import React, { useState } from "react";
import { Grid, Link, Card, TextField, Container, CssBaseline, Box, Avatar, Typography, FormControlLabel, Checkbox, Button, Alert } from "@mui/material";

import Person from '@mui/icons-material/Person';

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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        //validate a successful login prior to redirect
        AuthService.login(username, password).then(response => {
            navigate("/")
        }).catch(err => {
            // setError(err.response.data);
            console.log(err)
        })
    };

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
                    <TextField id="username"
                        label="Username"
                        error={error}
                        margin="normal"
                        required
                        fullWidth
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        autoComplete="username"
                        variant="filled"
                        autoFocus
                    />
                    <TextField
                        id="password"
                        error={error}
                        margin="normal"
                        required
                        fullWidth
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        label="Password"
                        value={password}
                        type="password"
                        variant="filled"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" />}
                        label="Remember me"
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
                    </Grid>
                    {error ? <Alert severity="error">{error}</Alert> : null}
                </Box>
            </Card>
        </Container>
    );
}