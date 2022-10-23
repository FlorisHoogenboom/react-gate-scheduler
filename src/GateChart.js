import {Stack} from '@mui/material';

import Gate from './Gate';
import Turnaround from './Turnaround';
import Pier from './Pier';


function GateChart({
    style,
    startTime,
    backwardWindowInSeconds,
    forwardWindowInSeconds,
    data,
    assignTurnaroundToStand,
    hideEmpty,
    ...props
}) {
    return (
        <Stack spacing={2}>
            {!!data && Object.entries(data).map(([pierId, pier]) =>
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
                                    outboundFlight={turnaround.outboundFlight}></Turnaround>,
                            )}
                        </Gate>)}
                </Pier>,
            )}
        </Stack>
    );
}

export default GateChart;
