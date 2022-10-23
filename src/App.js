import {useEffect, useState} from 'react';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';
import {ThemeProvider} from '@mui/material/styles';
import {
    AppBar,
    BottomNavigation,
    BottomNavigationAction,
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

import gateConfig from './gateConfig.json';
import baseTurnarounds from './turnarounds.json';
import _ from 'lodash';


function toNestedStructure(gateConfig, tunrarounds) {
    const result = _.cloneDeep(gateConfig);

    for (const [turnaroundId, turnaround] of Object.entries(tunrarounds)) {
        const pier = turnaround['pier'];
        const stand = turnaround['stand'];

        if (!!!result[pier]['stands'][stand]['turnarounds']) {
            result[pier]['stands'][stand]['turnarounds'] = [];
        }
        result[pier]['stands'][stand]['turnarounds'].push({
            ...turnaround,
            turnaroundId,
        });
    }

    return result;
}

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

    const [turnarounds, setTurnarounds] = useState(baseTurnarounds);

    const assignTurnaroundToStand = (turnaroundId, pierId, standId) => {
        setTurnarounds((prevState) => {
            const result = _.cloneDeep(prevState);
            result[turnaroundId]['pier'] = pierId;
            result[turnaroundId]['stand'] = standId;

            return result;
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <div hidden={view === 'watchlist'} style={{padding: '5px'}}>
                    <GateChart
                        data={toNestedStructure(gateConfig, turnarounds)}
                        startTime={time}
                        forwardWindowInSeconds={DefaultFowardWindowInSeconds}
                        backwardWindowInSeconds={DefaultBackwardWindowInSeconds}
                        assignTurnaroundToStand={assignTurnaroundToStand}
                        hideEmpty={false}></GateChart>
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
