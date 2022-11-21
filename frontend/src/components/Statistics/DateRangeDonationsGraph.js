import React, { useState, useMemo, useEffect } from "react";

import api from "../../utils/api";

import { Card, Box, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import { Line } from "@ant-design/charts";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import HelpDialog from "../HelpDialog";

// Setup a general format for dates
const dateFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
}

const verticalAlignStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}

const drawerWidth = 220
const eventListMargin = 40

export default function DateRangeDonationsGraph() {
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    const [endDate, setEndDate] = useState(currentDate)

    const [dataUnauthorized, setDataUnauthorized] = useState(false)

    const [graphableData, setGraphableData] = useState([])

    const [totalDonations, setTotalDonations] = useState(0)

    const maxValue = (data) => {
        let max = 0
        data.forEach((element) => {
            if (element.value > max) {
                max = element.value
            }
        })

        return max
    }

    const config = useMemo(() => {
        const config = {
            data: graphableData,
            xField: "date",
            yField: "value",
            color: "cyan",
            tooltip: {
                customContent: (title, data) => {
                    return `<div style="padding: 8px 4px; font-size:16px; font-weight:600 background-color:cyan"><div>${data[0]?.data?.date}</div></br><div>$${data[0]?.value}</div></div>`;
                },
            },
            xAxis: {
                label: null,
                line: null,
            },
            yAxis: {
                label: null,
                grid: null,
            },
            smooth: true,
            lineStyle: {
                lineWidth: 4,
            },
            meta: {
                value: {
                    alias: "Donations",
                    min: -1,
                    max: (maxValue(graphableData) + 1),
                }
            },
        };

        return config;
    }, [graphableData]);

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

    const convertToDailyAmounts = (data, startDate, endDate) => {
        const dailyAmounts = []

        for (var i = new Date(startDate); i <= endDate; i.setDate(i.getDate() + 1)) {
            dailyAmounts.push({
                date: i.toLocaleDateString('en-US', dateFormatOptions),
                value: 0
            })
        }

        let donationSum = 0
        for (var i = 0; i < data.length; i++) {
            const createdDateTime = new Date(data[i].CreatedDateTime)
            const date = new Date(createdDateTime).toLocaleDateString('en-US', dateFormatOptions)
            const amount = data[i].Amount
            donationSum += amount

            // Find the index of the object with the same date
            const index = dailyAmounts.findIndex((obj => obj.date === date))

            if (index !== -1) {
                dailyAmounts[index].value += amount
            } else {
                dailyAmounts.push({ date: date, value: amount })
            }
        }
        setTotalDonations(donationSum)

        return dailyAmounts
    }

    const updateDonations = () => {
        api.get('/api/donations', { params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() } })
            .then(response => {
                const dailyAmounts = convertToDailyAmounts(response.data, startDate, endDate)
                console.log(response.data)
                setGraphableData(dailyAmounts)
                setDataUnauthorized(false)
                console.log(dailyAmounts)
            })
            .catch(err => {
                if ((err?.response?.status ?? 401) === 401) {
                    setDataUnauthorized(true)
                    console.log(err)
                }
            })
    }

    useEffect(() => {
        updateDonations()
    }, [startDate, endDate])

    return (
        <>
            <Card elevation={1} sx={{ width: `${paperWidth}px`, mb: 2, px: 2, pt: 2 }}>
                <Grid2 container spacing={2} sx={{ mb: 1 }}>
                    <Grid2 item xs={2}>
                        <Box component="h2">Donations</Box>
                    </Grid2>
                    <Grid2 item xs={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <Box component="h4" color="text.secondary"> Total: ${totalDonations}</Box>
                    </Grid2>
                    <Grid2 item xs={3} sx={verticalAlignStyles}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => {
                                    setStartDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid2>
                    <Grid2 item xs={3} sx={verticalAlignStyles}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => {
                                    setEndDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid2>
                    <Grid2 item xs={1} sx={verticalAlignStyles}>
                        <HelpDialog usedInDialog={false} messages={[
                            `This graph shows the total donations made between the start and end dates by day.`,
                            `Changing the start and end dates will update the graph automatically to show the new information.`,
                            `Hovering over the graph will list exact values of total donations on the given day.`,
                            `The graph also shows the total dollar amount of donations withing the specified date range.`,
                        ]} />
                    </Grid2>
                </Grid2>
                {!dataUnauthorized ?
                    <Line margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                        {...config}
                    /> :
                    <Box component="h2">You are not authorized to view this data</Box>
                }
            </Card>
        </>
    )
}