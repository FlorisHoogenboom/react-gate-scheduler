import GateChart from './GateChart';
import {ThemeProvider} from './theming';
import {useEffect, useState} from 'react';
import {
    DefaultBackwardWindowInSeconds,
    DefaultFowardWindowInSeconds,
    StartTime,
} from './Constants';

function App() {
    const [time, setTime] = useState(
        () => StartTime,
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((current) => {
                const result = new Date(current);
                result.setSeconds(result.getSeconds() + 60);
                return result;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ThemeProvider>
            <div style={{display: 'flex'}}>
                <GateChart
                    startTime={time}
                    forwardWindowInSeconds={DefaultFowardWindowInSeconds}
                    backwardWindowInSeconds={DefaultBackwardWindowInSeconds}></GateChart>
                <div style={{width: '250px'}}>
                    My Warnings pane!
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
