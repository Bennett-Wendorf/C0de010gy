// Import React stuff
import React, { useState, useEffect } from 'react';

// Import utilities and components
import api from '../../utils/api';
import Bar from '../../components/AppBar';

import UserTable from './UserTable';

export function Users() {
    const [users, setUsers] = useState([]);
    const [unauthorizedError, setUnauthorizedError] = useState(false);

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

    return (
        <>
            {/* Define the bar for the top of the screen, with its buttons */}
            <Bar title="Users" />

            <UserTable rows={users} updateUsers={updateUsers} userHasPermissions={!unauthorizedError}/>
        </>
    )
}