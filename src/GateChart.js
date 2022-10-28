import {Stack} from '@mui/material';

import Gate from './Gate';
import Turnaround from './Turnaround';
import Pier from './Pier';
import _ from 'lodash';


function GateChart({
    style,
    startTime,
    backwardWindowInSeconds,
    forwardWindowInSeconds,
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

    return (
        <Stack spacing={2}>
            {Object.entries(mapTurnaroundToGates(gateConfig, turnarounds)).map(([pierId, pier]) =>
                <Pier
                    key={pierId}
                    name={pier.name}
                    hideWhenEmpty={hideEmpty}>
                    {Object.entries(pier.stands).map(([standId, stand], i)=>
                        <Gate
                            key={standId}
                            startTime={startTime}
                            backwardWindowInSeconds={backwardWindowInSeconds}
                            forwardWindowInSeconds={forwardWindowInSeconds}
                            pierId={pierId}
                            standId={standId}
                            standName={stand.name}
                            dropTurnaroundHandler={assignTurnaroundToStand}
                            hideWhenEmpty={hideEmpty} // TODO: this still has bugs for non visible ta's
                        >
                            {!!stand.turnarounds && stand.turnarounds.map((turnaround, turnaroundIndex)=>
                                <Turnaround
                                    key={turnaround.turnaroundId}
                                    turnaroundId={turnaround.turnaroundId}
                                    inboundFlight={turnaround.inboundFlight}
                                    ibt={new Date(turnaround.inboundFlight.sbt)}
                                    obt={new Date(turnaround.outboundFlight.sbt)}
                                    outboundFlight={turnaround.outboundFlight}></Turnaround>,
                            )}
                        </Gate>)}
                </Pier>,
            )}
        </Stack>
    );
}

export default GateChart;
