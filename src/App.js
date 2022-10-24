import {useEffect, useState} from 'react';
import {DefaultBackwardWindowInSeconds, DefaultFowardWindowInSeconds, StartTime,} from './Constants';
import _ from 'lodash';

import GateChart from './GateChart';
import gateConfig from './gateConfig.json';
import baseTurnarounds from './turnarounds.json';
import {BottomControlBar} from './BottomControlBar';


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
        <>
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

            <BottomControlBar
                onViewChange={(event, value) => setView(value)}
                view={view}
                addTurnaroundToWatchlist={addTurnaroundToWatchlist}
                numberOnWatchlist={watchlistTurnaroundIds.length}/>
        </>
    );
}

export default App;
