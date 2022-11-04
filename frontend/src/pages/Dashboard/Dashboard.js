// Import React stuff
import React, { useState, useEffect } from "react";

// Import utilities and components
import api from "../../utils/api";
import Bar from "../../components/AppBar";
import Carousel from "../../components/Carousel/Carousel";
import ModifyEventDialog from "../../components/Event/ModifyEventDialog";

import AuthService from "../../services/auth.service";

export function Dashboard() {

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState({});

    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)

    const [hasVolunteered, setHasVolunteered] = useState(false)
    const [hasDonated, setHasDonated] = useState(false)

    // Make an api call to the backend to update the list of events
    const updateEvents = () => {
        api.get(`/api/events/future`)
            .then(response => {
                setEvents(response.data ? response.data.events : [])
                console.log("Updating events");
            })
            .catch(err => console.error(err.message))
    }

    // The first time this component renders, update the Event
    useEffect(() => {
        updateEvents()
    }, [])

    // Handle when a row is clicked and set up the pieces of state
    const handleEventClick = (event) => {
        setSelectedEvent(event)
        setIsModifyDialogOpen(true)
    }

    const handleEventClickView = async (event) => {
        setSelectedEvent(event)
        checkIfVolunteered(event)
            .then((volunteered) => {
                if (volunteered) {
                    setHasVolunteered(true)
                } else {
                    setHasVolunteered(false)
                }
                setIsViewDialogOpen(true)
            })
        checkIfDonated(event)
            .then((donated) => {
                if (donated) {
                    setHasDonated(true)
                } else {
                    setHasDonated(false)
                }
                setIsViewDialogOpen(true)
            })
    }

    const checkIfVolunteered = async (event) => {
        return api.get(`/api/events/${event.EventID}/volunteer`)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return false
            }
        )
    }

    const checkIfDonated = async (event) => {
        return api.get(`/api/events/${event.EventID}/donate`)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return false
            })
    }

    return (
        <div>
            {/* Define the bar for the top of the screen, with its buttons */}
            <Bar title="Dashboard" />
            <Carousel events={events} eventClick={handleEventClick} eventClickView={handleEventClickView}/>
            <ModifyEventDialog
                selectedEvent={selectedEvent}
                hasDonated={hasDonated}
                hasVolunteered={hasVolunteered}
                isViewDialogOpen={isViewDialogOpen}
                setIsViewDialogOpen={setIsViewDialogOpen}
                isModifyDialogOpen={isModifyDialogOpen}
                setIsModifyDialogOpen={setIsModifyDialogOpen}
                eventUpdate={updateEvents}
            />
        </div>
    )
}