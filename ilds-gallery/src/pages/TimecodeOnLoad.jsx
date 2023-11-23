import React from "react";
import { SERVER_ENDPOINT } from "../utilities/Structures";

export default class TimecodeOnLoad extends React.Component {

    constructor(props) {
        super(props);
        // let load = new Date();
        // let code = this.getDateCode(load) + this.encode(this.getSecondsSince8(load.getTime()), alphabet)
        this.state = {
            patient_id: ""
        };
    }

    componentDidMount() {
        fetch(`${SERVER_ENDPOINT}/patient_id/tick`).then(() => {
            this.getPID();
        });
    }

    async getPID() {
        console.log("Getting patient ID");
        let code = await fetch(`${SERVER_ENDPOINT}/patient_id`)
            .then((code) => code.text())
            .catch((err) => console.log(err));
        console.log(`Code is: ${code}`);
        this.setState({
            patient_id: code
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    };

    async tick(e) {
        e.preventDefault();
        // clearInterval(this.timerID);
        await fetch(`${SERVER_ENDPOINT}/patient_id/tick`).then(() => {
            this.getPID();
        });
        // let cur_time = new Date();
        // let diff = this.getSecondsSince8(cur_time.getTime());
        // let encodedString = this.getDateCode(cur_time) + this.encode(diff, alphabet);
        // this.setState({
        //     patient_id: encodedString
        // });
    };

    getSecondsSince8(currentEpochTime) {
        let time_start = (Math.floor((Math.floor(currentEpochTime / (1000 * 3600)) - 7) / 24) * 24 + 15) * 60;
        let diff = Math.floor(currentEpochTime / 60000) - time_start;
        return diff;
    };

    encode(input, alphabet) {
        if (input === 0) {
            return alphabet[0];
        }

        let encodedString = ""
        let base = alphabet.length;
        while (input) {
            let index = input % base;
            input = Math.floor(input / base);
            encodedString = `${alphabet[index]}${encodedString}`;
        }
        return encodedString;
    }

    getDateCode(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();

        let formattedMonth = month.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
        let formattedDay = day.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });

        return `${year.toLocaleString('en-US').substring(3)}${formattedMonth}${formattedDay}`
    }

    render() {
        return (
            <section>
                <div className="container-fluid">
                    <div className="row justify-content-center mt-5 mb-3 text-center">
                        <h1 className="mb-5">Hi there,</h1>
                        <h3>The current ID is</h3>
                        <h2><span style={{'color': "#ff0000"}}>{this.state.patient_id.substring(0, 6)}</span><span style={{'color': "#0000ff"}}>{this.state.patient_id.substring(6)}</span></h2>
                    </div>
                </div>
            </section>
        )
    }
}