import {useRef, useEffect, useState} from 'react';
import {useDrop} from 'react-dnd';
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
    DefaultFowardWindowInSeconds, DragTypes,
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
    const [turnarounds, setTurnarounds] = useState(baseTurnarounds);

    const [watchlistTurnaroundIds, setWatchlistTurnaroundIds] = useState([]);


    const rippleRef = useRef();

    const [{isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item, monitor) => {
            addTurnaroundToWatchlist(item.turnaroundId);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),

    }));

    useEffect(() => {
        if (isOver) {
            rippleRef.current && rippleRef.current.start();
        } else {
            rippleRef.current && rippleRef.current.stop();
        }
    }, [isOver]);


    useEffect(() => {
        const interval = setInterval(() => {
            setTime((current) => {
                const result = new Date(current);
                result.setSeconds(result.getSeconds() + 6);
                return result;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const assignTurnaroundToStand = (turnaroundId, pierId, standId) => {
        setTurnarounds((prevState) => {
            const result = _.cloneDeep(prevState);
            result[turnaroundId]['pier'] = pierId;
            result[turnaroundId]['stand'] = standId;

            return result;
        });
    };

    const addTurnaroundToWatchlist = (turnaroundId) => {
        setWatchlistTurnaroundIds((current) => {
            if (_.includes(current, turnaroundId)) {
                return current;
            } else {
                const result = _.cloneDeep(current);
                result.push(turnaroundId);
                return result;
            }
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <div hidden={view !== 'full'} style={{padding: '5px'}}>
                <GateChart
                    data={toNestedStructure(gateConfig, turnarounds)}
                    startTime={time}
                    forwardWindowInSeconds={DefaultFowardWindowInSeconds}
                    backwardWindowInSeconds={DefaultBackwardWindowInSeconds}
                    assignTurnaroundToStand={assignTurnaroundToStand}
                    hideEmpty={false}></GateChart>
            </div>
            <div hidden={view !== 'watchlist'} style={{padding: '5px'}}>
                <GateChart
                    data={toNestedStructure(gateConfig, _.pick(turnarounds, watchlistTurnaroundIds))}
                    startTime={time}
                    forwardWindowInSeconds={DefaultFowardWindowInSeconds}
                    backwardWindowInSeconds={DefaultBackwardWindowInSeconds}
                    assignTurnaroundToStand={assignTurnaroundToStand}
                    hideEmpty={true}></GateChart>
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
                        ref={dropRef}
                        value="watchlist"
                        label="Watchlist"
                        icon={<NotificationsActiveIcon />}
                        touchRippleRef={rippleRef}/>

                </BottomNavigation>
            </AppBar>
        </ThemeProvider>
    );
}

export default App;
