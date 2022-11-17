import {Stack, Typography} from '@mui/material';
import _ from 'lodash';

import Gate from './Gate';
import Turnaround from './Turnaround';
import Pier from './Pier';


function GateChart({
    currentTime,
    startTime,
    endTime,
    gateConfig,
    turnarounds,
    assignTurnaroundToStand,
    hideEmpty,
    showMockTurnarounds,
}) {
    const addTurnaroundToResult = (result, pier, stand, turnaround, turnaroundId, subpath) => {
        subpath = subpath || 'turnarounds';
        if (!!!result[pier]['stands'][stand][subpath]) {
            result[pier]['stands'][stand][subpath] = [];
        }
        result[pier]['stands'][stand][subpath].push({
            ...turnaround,
            turnaroundId,
        });

        return result;
    };


    const mapTurnaroundToGates = (gateConfig, tunrarounds) => {
        if (_.isEmpty(gateConfig)) {
            return gateConfig;
        }

        let result = _.cloneDeep(gateConfig);

        for (const [turnaroundId, turnaround] of Object.entries(tunrarounds)) {
            result = addTurnaroundToResult(
                result,
                turnaround['pier'],
                turnaround['stand'],
                turnaround,
                turnaroundId,
            );

            if (!!turnaround.previous) {
                result = addTurnaroundToResult(
                    result,
                    turnaround.previous['pier'],
                    turnaround.previous['stand'],
                    turnaround.previous,
                    turnaroundId,
                    'previousTurnarounds',
                );
            }
        }

        return result;
    };

    const renderTurnarounds = (turnarounds, startTime, endTime, renderLight) => {
        if (!!!turnarounds) {
            return false;
        }

        return (turnarounds
            .filter((turnaround) => {
                const ibt = new Date(turnaround.inboundFlight.sbt);
                const obt = new Date(turnaround.outboundFlight.sbt);

                return ibt < endTime && obt > startTime;
            })
            .map((turnaround)=> {
                const ibt = new Date(turnaround.inboundFlight.sbt);
                const obt = new Date(turnaround.outboundFlight.sbt);

                return (
                    <Turnaround
                        key={turnaround.turnaroundId}
                        turnaroundId={turnaround.turnaroundId}
                        inboundFlight={turnaround.inboundFlight}
                        ibt={ibt}
                        obt={obt}
                        hasChanged={!!turnaround.previous}
                        outboundFlight={turnaround.outboundFlight}
                        isMock={!!renderLight}></Turnaround>
                );
            }));
    };

    const determineTurnaroundsToRender = (stand, startTime, endTime, showMockTurnarounds) => {
        if (!showMockTurnarounds) {
            return renderTurnarounds(stand.turnarounds, startTime, endTime);
        } else {
            return _.union(
                renderTurnarounds(stand.turnarounds, startTime, endTime),
                renderTurnarounds(stand.previousTurnarounds, startTime, endTime, true),
            );
        }
    };

    return (
        <Stack spacing={2}>
            {(_.size(turnarounds) === 0) && <Typography>No turnarounds to display</Typography>}

            {Object.entries(mapTurnaroundToGates(gateConfig, turnarounds)).map(([pierId, pier]) =>
                <Pier
                    key={pierId}
                    name={pier.name}
                    hideWhenEmpty={hideEmpty}>
                    {Object.entries(pier.stands).map(([standId, stand])=>
                        <Gate
                            key={standId}
                            currentTime={currentTime}
                            startTime={startTime}
                            endTime={endTime}
                            pierId={pierId}
                            standId={standId}
                            standName={stand.name}
                            dropTurnaroundHandler={assignTurnaroundToStand}
                            hideWhenEmpty={hideEmpty} // TODO: this still has bugs for non visible ta's
                            turnarounds={determineTurnaroundsToRender(stand, startTime, endTime, showMockTurnarounds)}
                        ></Gate>)}
                </Pier>,
            )}
        </Stack>
    );
}

export default GateChart;
