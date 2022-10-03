import moment from "moment";
import React from "react";

const rootStyle = {
    width: "100%",
    height: "40px",
    display: "flex",
    boxSizing: "border-box",
    position: "relative"
}

const labelStyle = {
    float: "left",
    display: "block",
    height: "100%",
    padding: "3px",
    boxSizing: "border-box",
    borderRight: "1px solid black",
    userSelect: "none",
    writingMode: "vertical-lr",
    textAlign: "center",
    backgroundColor: "#141251",
    color: "#FFFFFF"
}

const timelineStyle = {
    height: "100%",
    width: "100%",
    paddingTop: "10px",
    paddingBottom: "10px",
    boxSizing: "border-box",
    position: "relative"
}

const innerTimelineStyle = {
    position: "relative",
    height: "100%",
    width: "100%",
    overflow: "hidden"
}

function getFractionOfWindow(startTime, windowInSeconds, timestamp) {
    let windowInMs = windowInSeconds * 1000
    timestamp = new Date(timestamp)

    return (timestamp - startTime) / windowInMs
};

function Gate({startTime, windowInSeconds, standName, style, children, ...props}) {

    return (
        <div style={{...rootStyle, ...style}}>
            <div style={labelStyle}>
                {standName}
            </div>

            <div style={timelineStyle}>
                <div style={innerTimelineStyle}>
                    {children.map(child => {
                        let sibt = child.props.inboundFlight.sbt;
                        let sobt = child.props.outboundFlight.sbt;
                        let left = (getFractionOfWindow(startTime, windowInSeconds, sibt) * 100).toFixed(0) + "%"
                        let right = (100 - getFractionOfWindow(startTime, windowInSeconds, sobt) * 100).toFixed(0) + "%"

                        return React.cloneElement(child, {style: {position: "absolute", left: left, right: right}})
                    })}
                </div>
            </div>

        </div>
    );
}

export default Gate;
