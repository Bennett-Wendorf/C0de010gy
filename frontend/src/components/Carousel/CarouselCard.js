// Import React stuff
import React from "react";

// Import MUI stuff
import { Card, Typography, Divider } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'

import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

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

export default function CarouselCard({ event, eventClick, style }) {
    return (
        <Card sx={cardStyles} style={style} onClick={eventClick}>
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
            <Grid2 container spacing={2}>
                <Grid2 xs={8}>
                    <Grid2 container spacing={1}>
                        <Grid2><LocationOnIcon /></Grid2>
                        <Grid2><Typography noWrap>{event.Location}</Typography></Grid2>
                    </Grid2>
                </Grid2>
                <Grid2 xs={4}>
                    <Grid2 container spacing={1}>
                        <Grid2><PeopleIcon /></Grid2>
                        <Grid2><Typography>{event.NeededVolunteers}</Typography></Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Card>

    )
}