// Import React stuff
import React from "react";

// Import utilities and components
import api from "../../utils/api";
import Bar from "../../components/AppBar";
import Carousel from "../../components/Carousel/Carousel";
import CarouselCard from "../../components/Carousel/CarouselCard";

const testEvents = [{
    EventID: 10,
    Summary: 'Test Event',
    Description: 'Test event description',
    StartTime: new Date(),
    EndTime: new Date(),
    NeededVolunteers: 3,
    Location: 'Test Location test super long stuff',
    VolunteerQualifications: 'N/A',
    UserIDCreatedBy: 1,
    CreatedDateTime: new Date(),
    UserIDLastModifiedBy: 1,
    LastModifiedDateTime: new Date()
},
{
    EventID: 11,
    Summary: 'Test Event 2',
    Description: 'Test event description',
    StartTime: new Date(),
    EndTime: new Date(),
    NeededVolunteers: 3,
    Location: 'Test Location',
    VolunteerQualifications: 'N/A',
    UserIDCreatedBy: 1,
    CreatedDateTime: new Date(),
    UserIDLastModifiedBy: 1,
    LastModifiedDateTime: new Date()
},
{
    EventID: 12,
    Summary: 'Test Event 3',
    Description: 'Test event description',
    StartTime: new Date(),
    EndTime: new Date(),
    NeededVolunteers: 3,
    Location: 'Test Location',
    VolunteerQualifications: 'N/A',
    UserIDCreatedBy: 1,
    CreatedDateTime: new Date(),
    UserIDLastModifiedBy: 1,
    LastModifiedDateTime: new Date()
},
{
    EventID: 13,
    Summary: 'Test Event, 4',
    Description: 'Test event description',
    StartTime: new Date(),
    EndTime: new Date(),
    NeededVolunteers: 3,
    Location: 'Test Location',
    VolunteerQualifications: 'N/A',
    UserIDCreatedBy: 1,
    CreatedDateTime: new Date(),
    UserIDLastModifiedBy: 1,
    LastModifiedDateTime: new Date()
},
{
    EventID: 14,
    Summary: 'Test Event 5',
    Description: 'Test event description',
    StartTime: new Date(),
    EndTime: new Date(),
    NeededVolunteers: 3,
    Location: 'Test Location',
    VolunteerQualifications: 'N/A',
    UserIDCreatedBy: 1,
    CreatedDateTime: new Date(),
    UserIDLastModifiedBy: 1,
    LastModifiedDateTime: new Date()
},
{
    EventID: 15,
    Summary: 'Test Event 6',
    Description: 'Test event description',
    StartTime: new Date(),
    EndTime: new Date(),
    NeededVolunteers: 3,
    Location: 'Test Location',
    VolunteerQualifications: 'N/A',
    UserIDCreatedBy: 1,
    CreatedDateTime: new Date(),
    UserIDLastModifiedBy: 1,
    LastModifiedDateTime: new Date()
}]

export function Dashboard() {
    return (
        <div>
            {/* Define the bar for the top of the screen, with its buttons */}
            <Bar title="Dashboard" />
            <Carousel events={testEvents} />
        </div>
    )
}