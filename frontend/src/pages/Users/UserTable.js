// Import React stuff
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    Tooltip,
    IconButton,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2'

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PaidIcon from '@mui/icons-material/Paid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

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

const barHeight = 62
const margin = 45

export default function UserTable({ rows, updateUsers, userHasPermissions }) {

    const navigate = useNavigate()

    const handleRowClick = (user) => {
        navigate(`/users/${user.UserID}`)
    }

    const [containerHeight, setContainerHeight] = useState(window.innerHeight - barHeight - margin)

    useEffect(() => {
        function handleWindowResize() {
            setContainerHeight(window.innerHeight - barHeight - margin)
        }

        window.addEventListener('resize', handleWindowResize)

        return () => window.removeEventListener('resize', handleWindowResize)
    }, [])

    const userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    return (
        <>
            {/* Build the user table */}
            <TableContainer component={Paper} sx={{ height: rows.length > 0 ? `${containerHeight}px` : `auto` }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="Users">
                    <colgroup>
                        <col width="5%" />
                        <col width="10%" />
                        <col width="30%" />
                        <col width="30%" />
                        <col width="25%" />
                    </colgroup>
                    {/* Generate the headers of the rows */}
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Active</TableCell>
                            <TableCell align="left">Permissions</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="right">Joined</TableCell>
                        </TableRow>
                    </TableHead>
                    {/* Generate the rows of the table */}
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.UserID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                onClick={() => { handleRowClick(row) }}
                                hover
                            >
                                <TableCell align="left">{row.Active ? <CheckCircleOutlineIcon color="success" /> : <DoNotDisturbIcon color="error" />}</TableCell>
                                <TableCell align="left">
                                    <Grid2 container spacing={1}>
                                        {row.UserRoles.some(role => role.DisplayName === "Administrator") &&
                                            <Grid2 item>
                                                <AdminPanelSettingsIcon color="primary" />
                                            </Grid2>
                                        }
                                        {row.UserRoles.some(role => role.DisplayName === "Volunteer") &&
                                            <Grid2 item>
                                                <VolunteerActivismIcon color="primary" />
                                            </Grid2>
                                        }
                                        {row.UserRoles.some(role => role.DisplayName === "Donor") &&
                                            <Grid2 item>
                                                <PaidIcon color="primary" />
                                            </Grid2>
                                        }
                                    </Grid2>
                                </TableCell>
                                <TableCell align="left">{row.FullName}</TableCell>
                                <TableCell align="left">{row.Email}</TableCell>
                                <TableCell align="right">{new Date(row.CreatedDateTime).toLocaleDateString('en-US', dateFormatOptions)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {(rows.length <= 0 || !userHasPermissions) &&
                <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                    {userIsAdmin && userHasPermissions ? 'There are no users to display here. :(' : "You don't have permission to view users."}
                </Typography>
            }
        </>
    )
}