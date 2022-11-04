import React, { useCallback, useEffect, useState } from "react"

import { Paper, ImageList, ImageListItem, Box } from "@mui/material"

import CarouselCard from "./CarouselCard"

const drawerWidth = 220
const eventListMargin = 40

export default function Carousel({ events, eventClick, eventClickView }) {
    const scrollRef = useCallback(node => {
        if (node !== null) {
            const onWheel = (e) => {
                if (e.deltaY === 0) {
                    return;
                }

                e.preventDefault();

                node.scrollTo({
                    left: node.scrollLeft + e.deltaY,
                    behavior: "smooth"
                })
            }

            node.addEventListener("wheel", onWheel)
        }
    }, [])

    const [paperWidth, setPaperWidth] = useState(window.innerWidth - drawerWidth - eventListMargin)

    useEffect(() => {
        function handleWindowResize() {
            setPaperWidth(window.innerWidth - drawerWidth - eventListMargin)
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [])


    return (
        <>
            <Paper sx={{ width: `${paperWidth}px`, p: 0.5 }} elevation={0}>
                <Box component="h2" sx={{ ml: 3, mb: 0 }}>Upcoming Events</Box>
                {events.length > 0 ?
                    <ImageList
                        sx={{
                            gridAutoFlow: "column",
                            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr)) !important",
                            gridAutoColumns: "minmax(320px, 1fr)",
                            mt: 0,
                            pr: 4
                        }}
                        ref={scrollRef}
                    >
                        {events.map((event) => (
                            <ImageListItem key={event.EventID}>
                                <CarouselCard event={event} eventClick={eventClick} eventClickView={eventClickView} />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    :
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <h3>No events coming up</h3>
                    </div>
                }

            </Paper>

        </>
    )
}