import _ from 'lodash';
import React from 'react';
import {useTheme} from '@mui/material/styles';

import {useDrop} from 'react-dnd';
import {DragTypes} from './Constants';


function getFractionOfWindow(
    startTime, backwardWindowInSeconds,
    forwardWindowInSeconds, timestamp,
) {
    const totalWindowInMs = (backwardWindowInSeconds + forwardWindowInSeconds) * 1000;
    timestamp = new Date(timestamp);
    startTime = new Date(startTime);
    startTime.setSeconds(startTime.getSeconds() - backwardWindowInSeconds);

    return (timestamp - startTime) / totalWindowInMs;
}

function Gate({
    startTime,
    backwardWindowInSeconds,
    forwardWindowInSeconds,
    pierId,
    standId,
    standName,
    dropTurnaroundHandler,
    style,
    hideWhenEmpty,
    children,
    ...props
}) {
    const theme = useTheme();

    const [{canDrop, isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item, monitor) => {
            dropTurnaroundHandler(item.turnaroundId, pierId, standId);
        },
        collect: (monitor) => ({
            canDrop: !!monitor.canDrop(),
            isOver: !!monitor.isOver(),
        }),

    }));

    const rootStyle = {
        width: '100%',
        height: '40px',
        display: 'flex',
        boxSizing: 'border-box',
        position: 'relative',
    };

    let highlightRootStyle = {};

    const labelStyle = {
        float: 'left',
        display: 'block',
        height: '100%',
        padding: '3px',
        boxSizing: 'border-box',
        borderRight: '1px solid black',
        borderRadius: '4px',
        userSelect: 'none',
        writingMode: 'vertical-lr',
        textAlign: 'center',
        backgroundColor: theme.palette.secondary.main,
        color: '#FFFFFF',
    };

    const timelineStyle = {
        height: '100%',
        width: '100%',
        paddingTop: '10px',
        paddingBottom: '10px',
        boxSizing: 'border-box',
        position: 'relative',
    };

    const innerTimelineStyle = {
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    };

    const currentTimeBarStyle = {
        height: '100%',
        position: 'absolute',
        borderLeft: '2px dashed #000000',
        left: (
            getFractionOfWindow(startTime, backwardWindowInSeconds, forwardWindowInSeconds, startTime) * 100
        ).toFixed(2) + '%',
    };


    if (canDrop && isOver) {
        highlightRootStyle = {
            backgroundColor: theme.palette.warning.light,
        };
    }

    return (
        <>
            {((!children || !children.length) && hideWhenEmpty) ?
                (
                    <></>
                ) : (
                    <div
                        ref={dropRef}
                        style={{
                            ...rootStyle,
                            ...style,
                            ...highlightRootStyle,
                        }}>
                        <div style={labelStyle}>
                            {standName}
                        </div>

                        <div style={timelineStyle}>
                            <div style={innerTimelineStyle}>
                                {!!children && children.map((child) => {
                                    const sibt = new Date(child.props.inboundFlight.sbt);
                                    const sobt = new Date(child.props.outboundFlight.sbt);
                                    const startFraction = getFractionOfWindow(
                                        startTime, backwardWindowInSeconds, forwardWindowInSeconds, sibt,
                                    );
                                    const endFraction = getFractionOfWindow(
                                        startTime, backwardWindowInSeconds, forwardWindowInSeconds, sobt,
                                    );
                                    const left = (startFraction * 100).toFixed(2) + '%';
                                    const right = (100 - endFraction * 100).toFixed(2) + '%';

                                    const fractionDone = _.clamp(
                                        getFractionOfWindow(sibt, 0, (sobt - sibt)/1000, startTime),
                                        0,
                                        1,
                                    );

                                    return React.cloneElement(
                                        child,
                                        {sibtMargin: left, sobtMargin: right, fractionDone: fractionDone},
                                    );
                                })}
                                <div style={currentTimeBarStyle}></div>
                            </div>
                        </div>

                    </div>
                )}
        </>
    );
}

export default Gate;
