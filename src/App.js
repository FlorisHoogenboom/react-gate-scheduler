import {useEffect, useState} from 'react';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';
import {ThemeProvider} from '@mui/material/styles';
import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction, Card,
    Stack,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';

import {
    DefaultBackwardWindowInSeconds,
    DefaultFowardWindowInSeconds,
    StartTime,
} from './Constants';
import GateChart from './GateChart';
import DropArea from './DropArea';
import {theme} from './theming';


function App() {
    const [time, setTime] = useState(
        () => StartTime,
    );

    const [view, setView] = useState(() => 'watchlist');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((current) => {
                const result = new Date(current);
                result.setSeconds(result.getSeconds() + 60);
                return result;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <div hidden={view === 'watchlist'}>
                    <Stack
                        spacing={2}>
                        <Card elevation={3}>
                            <div style={{height: '100px', padding: '20px 20px 20px 20px', boxSizing: 'border-box'}}>
                                <DropArea
                                    text="Add to watchlist"></DropArea>
                            </div>
                        </Card>
                        <GateChart
                            startTime={time}
                            forwardWindowInSeconds={DefaultFowardWindowInSeconds}
                            backwardWindowInSeconds={DefaultBackwardWindowInSeconds}></GateChart>
                    </Stack>
                </div>


                <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                    <BottomNavigation
                        onChange={(event, value) => setView(value)}
                        value={view}
                        showLabels>
                        <BottomNavigationAction
                            value="full"
                            label="Full view"
                            icon={<AlignHorizontalLeftIcon />}/>
                        <BottomNavigationAction
                            value="watchlist"
                            label="Watchlist"
                            icon={<NotificationsActiveIcon />}/>
                    </BottomNavigation>
                </AppBar>
            </DndProvider>
        </ThemeProvider>
    );
}

export default App;
