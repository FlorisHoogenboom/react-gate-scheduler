import _ from 'lodash';

import Gate from './Gate';
import gateConfig from './gateConfig.json';
import baseTurnarounds from './turnarounds.json';
import Turnaround from './Turnaround';
import {useTheme} from './theming';
import {useState} from 'react';


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

    const theme = useTheme();

    const rootStyle = {
        width: '100%',
    };

    const pierHeaderStyle = {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        fontWeight: 'bold',
        fontSize: '20px',
        verticalAlign: 'middle',
        backgroundColor: theme.primaryColor,
        color: theme.lightTextColor,
    };

    const gateContainerStyle = {
        padding: '3px',
    };

    const gateStyle = {
        position: 'relative',
    };

    const evenGateStyleEven = {
        ...gateStyle,
        backgroundColor: '#FFFFFF',
    };

    const eventGateStyleOdd = {
        ...gateStyle,
        backgroundColor: '#EEEEEE',
    };

    return (
        <div style={{...rootStyle, ...style}} >
            {!!turnarounds && Object.entries(toNestedStructure(gateConfig, turnarounds)).map(([pierId, pier]) =>
                <div key={pierId}>
                    <div style={pierHeaderStyle}>{pier.name}</div>
                    {Object.entries(pier.stands).map(([standId, stand], i)=>
                        <div
                            key={standId}
                            style={gateContainerStyle}>
                            <Gate
                                startTime={startTime}
                                backwardWindowInSeconds={backwardWindowInSeconds}
                                forwardWindowInSeconds={forwardWindowInSeconds}
                                pierId={pierId}
                                standId={standId}
                                standName={stand.name}
                                dropTurnaroundHandler={assignTurnaroundToStand}
                                hideWhenEmpty={hideEmpty} // TODO: this stil has bugs for non visible ta's
                                // eslint-disable-next-line max-len
                                style={i % 2 === 0 ? evenGateStyleEven : eventGateStyleOdd}>
                                {!!stand.turnarounds && stand.turnarounds.map((turnaround, turnaroundIndex)=>
                                    <Turnaround
                                        key={turnaround.turnaroundId}
                                        turnaroundId={turnaround.turnaroundId}
                                        inboundFlight={turnaround.inboundFlight}
                                        outboundFlight={turnaround.outboundFlight}></Turnaround>,
                                )}
                            </Gate>
                        </div>)}
                </div>,
            )}
        </div>
    );
}

export default GateChart;
