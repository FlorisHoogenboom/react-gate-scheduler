import Gate from "./Gate";

import data from './data.json';
import Turnaround from "./Turnaround";
import moment from "moment";


const rootStyle = {
    minHeight: "100%",
    width: "100%",
};

const pierHeaderStyle = {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    fontWeight: "bold",
    fontSize: "20px",
    verticalAlign: "middle",
    backgroundColor: "#1B60DB",
    color: "#FFFFFF"
};

const gateContainerStyle = {
    padding: "3px"
};

const gateStyle = {
    position: "relative"
};

const evenGateStyleEven = {
    ...gateStyle,
    backgroundColor: "#FFFFFF"
};

const eventGateStyleOdd = {
    ...gateStyle,
    backgroundColor: "#EEEEEE"
};

function getStandName(pier, number) {
    return [pier, number].join("")
};

function GateChart({style, startTime, windowInSeconds, ...props}) {
    return (
        <div style={{...rootStyle, ...style}} >
            {data.map((pier, pierIndex) =>
                <div key={pier.name}>
                    <div style={pierHeaderStyle}>{pier.name}</div>
                    {pier.stands.map((stand, standIndex) =>
                        <div
                            key={getStandName(pier.name, stand.name)}
                            style={gateContainerStyle}>
                            <Gate
                                startTime={startTime}
                                windowInSeconds={windowInSeconds}
                                standName={getStandName(pier.name, stand.name)}
                                style={standIndex % 2 === 0 ? evenGateStyleEven : eventGateStyleOdd}>
                                {stand.turnarounds.map((turnaround, turnaroundIndex)=>
                                    <Turnaround
                                        key={turnaroundIndex}
                                        inboundFlight={turnaround.inboundFlight}
                                        outboundFlight={turnaround.outboundFlight}></Turnaround>
                                )}
                            </Gate>
                        </div>)}
                </div>
            )}
        </div>
    );
}

export default GateChart;
