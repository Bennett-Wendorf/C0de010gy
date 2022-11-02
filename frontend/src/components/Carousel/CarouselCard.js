// Import React stuff
import React from "react";

// Import MUI stuff
import { Card, Typography, Divider } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'

import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

import AuthService from "../../services/auth.service";

// Setup a general format for dates
const dateFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
}

const cardStyles = {
    width: 320,
    height: 160,
    padding: 2,
    cursor: 'pointer',
    '&:hover': { boxShadow: '0 0 0 2px grey' },
    m: 2,
}

const summaryStyles = {
    fontSize: 25
}

const timeStyles = {
    fontSize: 13,
    color: 'text.secondary'
}

const dividerStyles = {
    m: 0.75
}

export default function CarouselCard({ event, eventClick, eventClickView }) {

    const userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    return (
        <Card sx={cardStyles} onClick={() => { userIsAdmin ? eventClick(event) : eventClickView(event) }}>
            <Typography sx={summaryStyles}>
                {event.Summary}
            </Typography>
            <Typography sx={timeStyles}>
                Start: {new Date(event.StartTime).toLocaleString("en-US", dateFormatOptions)}
            </Typography>
            <Typography sx={timeStyles}>
                End: {new Date(event.EndTime).toLocaleString("en-US", dateFormatOptions)}
            </Typography>
            <Divider sx={dividerStyles} />
            <Grid2 container spacing={3} columns={24}>
                <Grid2 xs={3}><LocationOnIcon /></Grid2>
                <Grid2 xs={13}><Typography noWrap>{event.Location}</Typography></Grid2>
                <Grid2 xs={3}><PeopleIcon /></Grid2>
                <Grid2 xs={5}><Typography>{event.NeededVolunteers}</Typography></Grid2>
            </Grid2>
        </Card>

    )
}