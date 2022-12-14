import _ from 'lodash';
import React from 'react';
import {useTheme} from '@mui/material/styles';

import {useDrop} from 'react-dnd';
import {DragTypes} from './Constants';
import {Avatar} from '@mui/material';

function getFractionOfWindow(
    startTime,
    endTime,
    timestamp,
) {
    const totalWindowInMs = endTime - startTime;

    return (timestamp - startTime) / totalWindowInMs;
}

function Gate({
    currentTime,
    startTime,
    endTime,
    pierId,
    standId,
    standName,
    dropTurnaroundHandler,
    style,
    hideWhenEmpty,
    turnarounds,
}) {
    turnarounds = React.Children.toArray(turnarounds);

    const theme = useTheme();

    const doesOverlap = (ibt, obt) => {
        return !turnarounds.every((turnaround) => {
            if (!!turnaround.props.isMock) {
                return true;
            }

            if (turnaround.props.ibt >= obt) {
                return true;
            } else {
                return turnaround.props.obt <= ibt;
            }
        });
    };

    const [{canDrop, isOver}, dropRef] = useDrop(() => ({
        accept: DragTypes.FLIGHT,
        drop: (item) => {
            dropTurnaroundHandler(item.turnaroundId, pierId, standId);
        },
        canDrop: (item) => !doesOverlap(item.ibt, item.obt),
        collect: (monitor) => ({
            canDrop: !!monitor.canDrop(),
            isOver: !!monitor.isOver(),
        }),

    }), [turnarounds]);

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
        isolation: 'isolate',
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
        borderLeft: '2px dashed #CCCCCC',
        left: (
            getFractionOfWindow(startTime, endTime, currentTime) * 100
        ).toFixed(2) + '%',
    };


    if (canDrop && isOver) {
        highlightRootStyle = {
            backgroundColor: theme.palette.warning.light,
        };
    } else if (canDrop && !isOver) {
        highlightRootStyle = {
            'animationName': 'color',
            'animationDuration': '2s',
            'animationIterationCount': 'infinite',
            '--animationStartColor': '#FFFFFF',
            '--animationEndColor': theme.palette.grey.light,
            'background': 'linear-gradient(90deg, var(--animatedColor), #FFFFFF)',
        };
    }

    const addPositioningToTurnaround = (child) => {
        const sibt = child.props.ibt;
        const sobt = child.props.obt;
        const startFraction = getFractionOfWindow(
            startTime, endTime, sibt,
        );
        const endFraction = getFractionOfWindow(
            startTime, endTime, sobt,
        );
        const left = (startFraction * 100).toFixed(2) + '%';
        const right = (100 - endFraction * 100).toFixed(2) + '%';

        const fractionDone = _.clamp(
            getFractionOfWindow(sibt, sobt, currentTime),
            0,
            1,
        );

        return React.cloneElement(
            child,
            {sibtMargin: left, sobtMargin: right, fractionDone: fractionDone},
        );
    };

    return (
        <>
            {((!turnarounds || !turnarounds.length) && hideWhenEmpty) ?
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
                                {!!turnarounds &&
                                    turnarounds.map(addPositioningToTurnaround)}
                                <div style={currentTimeBarStyle}></div>
                            </div>
                        </div>

                    </div>
                )}
        </>
    );
}

export default Gate;
