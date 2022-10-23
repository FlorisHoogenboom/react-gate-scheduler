import {useEffect, useState} from 'react';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';
import {ThemeProvider} from '@mui/material/styles';
import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';

import {
    DefaultBackwardWindowInSeconds,
    DefaultFowardWindowInSeconds,
    StartTime,
} from './Constants';
import GateChart from './GateChart';
import {theme} from './theming';


function App() {
    const [time, setTime] = useState(
        () => StartTime,
    );

    const [view, setView] = useState(() => 'full');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((current) => {
                const result = new Date(current);
                result.setSeconds(result.getSeconds() + 18);
                return result;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <div hidden={view === 'watchlist'} style={{padding: '5px'}}>
                    <GateChart
                        startTime={time}
                        forwardWindowInSeconds={DefaultFowardWindowInSeconds}
                        backwardWindowInSeconds={DefaultBackwardWindowInSeconds}></GateChart>
                </div>


                <AppBar position="fixed" color="primary" sx={{top: 'auto', bottom: 0}}>
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
