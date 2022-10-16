import GateChart from './GateChart';
import {ThemeProvider} from './theming';
import {useEffect, useState} from "react";

function App() {
    const [time, setTime] = useState(
        () => new Date('2022-01-01T09:30:00+00:00')
    )

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
                    windowInSeconds={3600 * 2}></GateChart>
                <div style={{width: '250px'}}>
                    My Warnings pane!
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
