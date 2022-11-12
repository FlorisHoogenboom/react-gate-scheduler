import {Slider} from '@mui/material';


function TimeSelector({
    forwardWindow,
    backwardWindow,
    setForwardWindow,
    setBackwardWindow,
}) {
    const minDistance = 3600;

    const marks = [
        {
            value: 0,
        },
    ];

    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setBackwardWindow(Math.min(newValue[0], forwardWindow - minDistance));
        } else {
            setForwardWindow(Math.max(newValue[1], backwardWindow + minDistance));
        }
    };

    const getValuetext = (value) => {
        return (value / 60).toFixed(0) + ' min';
    };


    return (
        <Slider
            getAriaLabel={() => 'Minimum distance'}
            value={[backwardWindow, forwardWindow]}
            onChange={handleChange}
            valueLabelDisplay="auto"
            valueLabelFormat={getValuetext}
            disableSwap
            step={15*60}
            marks={marks}
            min={-3600}
            max={6*3600}
        />
    );
}

export default TimeSelector;
