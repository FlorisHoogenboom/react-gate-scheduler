import {useEffect, useState} from 'react';
import _ from 'lodash';

import GateChart from './GateChart';
import gateConfig from './gateConfig.json';
import {BottomControlBar} from './BottomControlBar';
import {DefaultBackwardWindowInSeconds, DefaultFowardWindowInSeconds, StartTime} from './Constants';
import {getTurnarounds} from './data';


function App() {
    const [time, setTime] = useState(
        () => StartTime,
    );
    const [view, setView] = useState(() => 'full');
    const [turnarounds, setTurnarounds] = useState({});
    const [showChanges, setShowChanges] = useState(false);
    const [forwardWindow, setForwardWindow] = useState(DefaultFowardWindowInSeconds);
    const [backwardWindow, setBackwardWindow] = useState(DefaultBackwardWindowInSeconds);

    const [watchlistTurnaroundIds, setWatchlistTurnaroundIds] = useState([]);

    useEffect(() => {
        // Effect to let the time iterate, now mocked for testing purposes.
        const interval = setInterval(() => {
            setTime((current) => {
                const result = new Date(current);
                result.setSeconds(result.getSeconds() + 6);
                return result;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect( () => {
        (async function inner() {
            const data = await getTurnarounds();
            setTurnarounds(data);
        })();
    });

    const assignTurnaroundToStand = (turnaroundId, pierId, standId) => {
        setTurnarounds((prevState) => {
            const result = _.cloneDeep(prevState);
            if (!result[turnaroundId].previous) {
                // Save the previous turnaround if this is the first time
                // this flight has moved
                result[turnaroundId].previous = prevState[turnaroundId];
            }

            result[turnaroundId].pier = pierId;
            result[turnaroundId].stand = standId;

            if (
                result[turnaroundId].pier === result[turnaroundId].previous.pier &&
                result[turnaroundId].stand === result[turnaroundId].previous.stand
            ) {
                // If we've just moved this flight back to it's orignal position
                // remove the previous state as a signal this flight has not moved.
                result[turnaroundId].previous = null;
            }

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

    const resetAllTurnarounds = () => {
        setTurnarounds((previous) => {
            let results = _.cloneDeep(previous);
            results = _.map(results, (turnaround) => {
                if (!!turnaround.previous) {
                    turnaround.pier = turnaround.previous.pier;
                    turnaround.stand = turnaround.previous.stand;
                    delete turnaround.previous;
                }

                return turnaround;
            });

            return results;
        });
    };

    const filterModifiedTurnarounds = (turnarounds) => {
        return _.pickBy(turnarounds, (val) => !!val.previous);
    };

    const visualizationStartTime = new Date(time);
    visualizationStartTime.setSeconds(visualizationStartTime.getSeconds() + backwardWindow);

    const visualizationEndTime = new Date(time);
    visualizationEndTime.setSeconds(visualizationEndTime.getSeconds() + forwardWindow);

    return (
        <>
            <div hidden={view !== 'full'} style={{padding: '5px'}}>
                <GateChart
                    gateConfig={gateConfig}
                    turnarounds={turnarounds}
                    currentTime={time}
                    startTime={visualizationStartTime}
                    endTime={visualizationEndTime}
                    assignTurnaroundToStand={assignTurnaroundToStand}
                    hideEmpty={false}
                    showMockTurnarounds={showChanges}></GateChart>
            </div>
            <div hidden={view !== 'watchlist'} style={{padding: '5px'}}>
                <GateChart
                    turnarounds={_.pick(turnarounds, watchlistTurnaroundIds)}
                    gateConfig={gateConfig}
                    currentTime={time}
                    startTime={visualizationStartTime}
                    endTime={visualizationEndTime}
                    assignTurnaroundToStand={assignTurnaroundToStand}
                    hideEmpty={true}></GateChart>
            </div>

            <div hidden={view !== 'changes'} style={{padding: '5px'}}>
                <GateChart
                    turnarounds={filterModifiedTurnarounds(turnarounds)}
                    gateConfig={gateConfig}
                    currentTime={time}
                    startTime={visualizationStartTime}
                    endTime={visualizationEndTime}
                    assignTurnaroundToStand={assignTurnaroundToStand}
                    hideEmpty={true}
                    showMockTurnarounds={true}></GateChart>
            </div>

            <BottomControlBar
                onViewChange={(event, value) => setView(value)}
                view={view}
                gateConfig={gateConfig}
                forwardWindow={forwardWindow}
                backwardWindow={backwardWindow}
                setForwardWindow={setForwardWindow}
                setBackwardWindow={setBackwardWindow}
                modifiedTurnarounds={filterModifiedTurnarounds(turnarounds)}
                addTurnaroundToWatchlist={addTurnaroundToWatchlist}
                numberOnWatchlist={watchlistTurnaroundIds.length}
                onViewChanges={setShowChanges}
                onReset={() => resetAllTurnarounds}/>
        </>
    );
}

export default App;
