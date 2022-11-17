import {useEffect, useState} from 'react';
import _ from 'lodash';

import GateChart from './GateChart';
import {BottomControlBar} from './BottomControlBar';
import {DefaultBackwardWindowInSeconds, DefaultFowardWindowInSeconds, StartTime} from './Constants';
import {getGateConfig, getTurnarounds} from './data';


function App() {
    const [time, setTime] = useState(
        () => StartTime,
    );
    const [view, setView] = useState(() => 'full');
    const [turnarounds, setTurnarounds] = useState({});
    const [gateConfig, setGateConfig] = useState({});
    const [showChanges, setShowChanges] = useState(false);
    const [forwardWindow, setForwardWindow] = useState(DefaultFowardWindowInSeconds);
    const [backwardWindow, setBackwardWindow] = useState(DefaultBackwardWindowInSeconds);

    const [watchlistTurnaroundIds, setWatchlistTurnaroundIds] = useState([]);

    useEffect(() => {
        // Effect to let the time iterate, now mocked for testing purposes.
        const interval = setInterval(() => {
            setTime((current) => {
                const result = new Date(current);
                result.setSeconds(result.getSeconds() + 3);
                return result;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect( () => {
        getTurnarounds().then((data) => {
            setTurnarounds((currentTurnarounds) => {
                // Merge the current turnarounds (and their changes) with the new state
                const result = _.cloneDeep(currentTurnarounds);
                const existingKeys = Object.keys(currentTurnarounds);
                const newKeys = Object.keys(data);

                const keysToAdd = _.difference(newKeys, existingKeys);
                const keysToRemove = _.difference(existingKeys, newKeys);
                const keysToUpdate = _.intersection(existingKeys, newKeys);


                // Remove the keys that no longer exist remotely
                keysToRemove.forEach((key) => {
                    delete result[key];
                });

                // Add new turnarounds that are not known yet
                keysToAdd.forEach((key) => {
                    result[key] = data[key];
                });

                keysToUpdate.forEach((key) => {
                    currentTurnarounds[key].inboundFlight = data[key].inboundFlight;
                    currentTurnarounds[key].outboundFlight = data[key].outboundFlight;

                    if (currentTurnarounds[key].previous) {
                        currentTurnarounds[key].previous.inboundFlight = data[key].inboundFlight;
                        currentTurnarounds[key].previous.outboundFlight = data[key].outboundFlight;
                    }
                });

                return result;
            });
        });
    }, [time]);

    useEffect(() => {
        (async function inner() {
            const data = await getGateConfig();
            setGateConfig(data);
        })();
    }, []);

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
                delete result[turnaroundId].previous;
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

            return _.keyBy(results, 'id');
        });
    };

    const filterModifiedTurnarounds = (tas) => {
        return _.pickBy(tas, (val) => {
            return !!val && !!val.previous;
        });
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
