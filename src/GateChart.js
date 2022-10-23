import _ from 'lodash';
import {useState} from 'react';
import {Stack} from '@mui/material';

import Gate from './Gate';
import gateConfig from './gateConfig.json';
import baseTurnarounds from './turnarounds.json';
import Turnaround from './Turnaround';
import Pier from './Pier';


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

function GateChart({
    style,
    startTime,
    backwardWindowInSeconds,
    forwardWindowInSeconds,
    data,
    hideEmpty,
    ...props
}) {
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
        <Stack spacing={2}>
            {!!turnarounds && Object.entries(toNestedStructure(gateConfig, turnarounds)).map(([pierId, pier]) =>
                <Pier key={pierId} name={pier.name}>
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
                            hideWhenEmpty={hideEmpty} // TODO: this stil has bugs for non visible ta's
                        >
                            {!!stand.turnarounds && stand.turnarounds.map((turnaround, turnaroundIndex)=>
                                <Turnaround
                                    key={turnaround.turnaroundId}
                                    turnaroundId={turnaround.turnaroundId}
                                    inboundFlight={turnaround.inboundFlight}
                                    outboundFlight={turnaround.outboundFlight}></Turnaround>,
                            )}
                        </Gate>)}
                </Pier>,
            )}
        </Stack>
    );
}

export default GateChart;
