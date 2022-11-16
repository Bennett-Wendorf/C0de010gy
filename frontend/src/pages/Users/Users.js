// Import React stuff
import React, { useState, useEffect } from 'react';

// Import utilities and components
import api from '../../utils/api';
import Bar from '../../components/AppBar';
import AuthService from '../../services/auth.service';

import UserTable from './UserTable';

// Import general mui stuff
import { Button, IconButton, Tooltip, Grid, Alert } from '@mui/material';

// Import icons from mui
import AddIcon from '@mui/icons-material/AddCircle'

// Import dialog stuff from mui
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export function Users() {
    const [users, setUsers] = useState([]);
    const [unauthorizedError, setUnauthorizedError] = useState(false);

    const handleAddClick = () => {
    }

    // Make an api call to the backend to update the list of users
    const updateUsers = () => {
        api.get(`/api/users`)
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.log(err);
                if (err.response.status === 401) {
                    setUnauthorizedError(true);
                }
            })
    }

    useEffect(() => {
        updateUsers();
    }, [])

    const userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    return (
        <>
            {/* Define the bar for the top of the screen, with its buttons */}
            <Bar title="Users">
                {userIsAdmin && 
                    <Tooltip title="Add user">
                        <IconButton disabled aria-label="add" size="large" onClick={handleAddClick}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                }
            </Bar>

            <UserTable rows={users} updateUsers={updateUsers} userHasPermissions={!unauthorizedError}/>
        </>
    )
}