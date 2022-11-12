import {Stack, Typography} from '@mui/material';

import Gate from './Gate';
import Turnaround from './Turnaround';
import Pier from './Pier';
import _ from 'lodash';


function GateChart({
    style,
    currentTime,
    startTime,
    endTime,
    gateConfig,
    turnarounds,
    assignTurnaroundToStand,
    hideEmpty,
    ...props
}) {
    const mapTurnaroundToGates = (gateConfig, tunrarounds) => {
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
    };

    const renderTurnarounds = (turnarounds, startTime, endTime) => {
        if (!!!turnarounds) {
            return;
        }

        return (turnarounds
            .filter((turnaround) => {
                const ibt = new Date(turnaround.inboundFlight.sbt);
                const obt = new Date(turnaround.outboundFlight.sbt);

                return ibt < endTime && obt > startTime;
            })
            .map((turnaround, turnaroundIndex)=> {
                const ibt = new Date(turnaround.inboundFlight.sbt);
                const obt = new Date(turnaround.outboundFlight.sbt);

                return (
                    <Turnaround
                        key={turnaround.turnaroundId}
                        turnaroundId={turnaround.turnaroundId}
                        inboundFlight={turnaround.inboundFlight}
                        ibt={ibt}
                        obt={obt}
                        outboundFlight={turnaround.outboundFlight}></Turnaround>
                );
            }));
    };

    return (
        <Stack spacing={2}>
            {(_.size(turnarounds) === 0) && <Typography>No turnarounds to display</Typography>}

            {Object.entries(mapTurnaroundToGates(gateConfig, turnarounds)).map(([pierId, pier]) =>
                <Pier
                    key={pierId}
                    name={pier.name}
                    hideWhenEmpty={hideEmpty}>
                    {Object.entries(pier.stands).map(([standId, stand], i)=>
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
                        >
                            {renderTurnarounds(stand.turnarounds, startTime, endTime)}
                        </Gate>)}
                </Pier>,
            )}
        </Stack>
    );
}

export default GateChart;
