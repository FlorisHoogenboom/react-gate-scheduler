import _ from 'lodash';
import React from 'react';
import {useTheme} from '@mui/material/styles';

import {useDrop} from 'react-dnd';
import {DragTypes} from './Constants';
import {Avatar} from '@mui/material';


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

    const doesOverlap = (ibt, obt) => {
        if (!Array.isArray(children)) {
            return false;
        }

        return !children.every((turnaround) => {
            if (turnaround.props.ibt >= obt) {
                return true;
            } else {
                return turnaround.props.obt <= ibt;
            };
        });
    };

    const [{canDrop, isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item, monitor) => {
            dropTurnaroundHandler(item.turnaroundId, pierId, standId);
        },
        canDrop: (item, monitor) => !doesOverlap(item.ibt, item.obt),
        collect: (monitor) => ({
            canDrop: !!monitor.canDrop(),
            isOver: !!monitor.isOver(),
        }),

    }), [children]);

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
        paddingLeft: '3px',
    };

    const avatarStyle = {
        bgcolor: theme.palette.primary.light,
        width: '30px',
        height: '30px',
        fontSize: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
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
                            <Avatar sx={avatarStyle}>{standName}</Avatar>
                        </div>

                        <div style={timelineStyle}>
                            <div style={innerTimelineStyle}>
                                {!!children && children.map((child) => {
                                    const sibt = child.props.ibt;
                                    const sobt = child.props.obt;
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
