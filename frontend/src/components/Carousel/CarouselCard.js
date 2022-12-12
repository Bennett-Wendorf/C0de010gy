// Import React stuff
import React from "react";

// Import MUI stuff
import { Card, Typography, Divider } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'

import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import AuthService from "../../services/auth.service";
import useUserStore from "../../utils/Stores";

// Setup a general format for dates
const dateFormatOptions = {
    year: 'numeric',
    month: 'short',
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
    fontSize: 25,
}

const timeStyles = {
    fontSize: 13,
    color: 'text.secondary',
}

const timeLabelStyles = {
    fontSize: 13,
    color: 'text.secondary',
    fontWeight: 'bold',
}

const dividerStyles = {
    mt: 1.4,
    mb: 1.75
}

// A card component for the carousel
export default function CarouselCard({ event, eventClick, eventClickView }) {

    const userIsAdmin = AuthService.useHasPermissions(["Administrator"])

    const currentUserID = useUserStore(state => state.UserID)
    const userHasVolunteered = event.Volunteers.some(volunteer => volunteer.UserID === currentUserID)

    return (
        <Card elevation={6} sx={cardStyles} onClick={() => { userIsAdmin ? eventClick(event) : eventClickView(event) }}>
            <Grid2 container spacing={3}>
                <Grid2 item xs={userHasVolunteered ? 10 : 12}>
                    <Typography noWrap sx={summaryStyles}>{event.Summary}</Typography>
                </Grid2>
                {userHasVolunteered &&
                    <Grid2 item xs={2}>
                        <VolunteerActivismIcon color="primary"/>
                    </Grid2>
                }
            </Grid2>
            <Grid2 container>
                <Grid2 item xs={2}>
                    <Typography sx={timeLabelStyles}>Start: </Typography>
                </Grid2>
                <Grid2 item xs={10}>
                    <Typography sx={timeStyles}>
                        {new Date(event.StartTime).toLocaleString('en-US', dateFormatOptions)}
                    </Typography>
                </Grid2>
            </Grid2>
            <Grid2 container>
                <Grid2 item xs={2}>
                    <Typography sx={timeLabelStyles}>End: </Typography>
                </Grid2>
                <Grid2 item xs={10}>
                    <Typography sx={timeStyles}>
                        {new Date(event.EndTime).toLocaleString("en-US", dateFormatOptions)}
                    </Typography>
                </Grid2>
            </Grid2>
            <Divider sx={dividerStyles} />
            <Grid2 container spacing={3} columns={24}>
                <Grid2 xs={3}><LocationOnIcon color="primary" /></Grid2>
                <Grid2 xs={13}><Typography noWrap>{event.Location}</Typography></Grid2>
                <Grid2 xs={3}><PeopleIcon color="primary" /></Grid2>
                <Grid2 xs={5}><Typography noWrap>{event.NeededVolunteers - (event.Volunteers?.length ?? 0)}</Typography></Grid2>
            </Grid2>
        </Card>

    )
}