import React from "react";
import { SERVER_ENDPOINT } from "../utilities/Structures";
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

export default class Timecode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            patient_id: "Create ID",
            initials: "",
            log: []
        };
    }

    componentDidMount() {
        this.getLog();
        this.logTimer = setInterval(
            () => this.getLog(),
            30000
        );
    }

    componentWillUnmount() {
        clearInterval(this.logTimer);
    }

    async tick(e) {
        e.preventDefault();
        if (this.state.initials === "") {
            alert("Please input your initials");
            return;
        };
        let entry = await fetch(`${SERVER_ENDPOINT}/patient_id?initials=${this.state.initials}`)
            .then((entry) => entry.json())
            .catch((err) => console.log(err));
        console.log(entry);
        this.setState({
            patient_id: entry.code,
            initials: ""
        });
        this.getLog();
    };

    updateInitials(e) {
        let initials = e.target.value;
        this.setState({
            initials: initials,
        });
    };

    async getLog() {
        let log = await fetch(`${SERVER_ENDPOINT}/patient_id/log`)
            .then((res) => res.json())
            .catch((err) => console.log(err));
        log.sort((a, b) => {
            if (b.timestamp < a.timestamp) {
                return -1;
            }
            if (b.timestamp > a.timestamp) {
                return 1;
            }
            return 0;
        });
        this.setState({
            log: log
        });
    };

    async strikeThrough(e, code) {
        let targID = code;
        let target = document.getElementById(targID);
        let unused = e.target.checked;
        if (unused) {
            target.classList.add("unused");
        } else {
            target.classList.remove("unused");
        }
        let log = await fetch(`${SERVER_ENDPOINT}/patient_id/strikeout?code=${targID}&unused=${unused ? 1 : 0}`)
            .then((res) => res.json())
            .catch((err) => console.log(err));
        this.setState({
            log: log
        });
    }

    render() {
        return (
            <section>
                <div className="container-fluid">
                    <div className="row justify-content-center mt-5 mb-3 text-center">
                        <h1 className="mb-5">Hi there,</h1>
                        <h2><span style={{'color': "#ff0000"}}>{this.state.patient_id.substring(0, 6)}</span><span style={{'color': "#0000ff"}}>{this.state.patient_id.substring(6)}</span></h2>
                        <div className="form-group mt-3 mb-3 col-md-8 row">
                            <div className="col-lg-6 dropdown">
                                <input type="input" className="form-control form-control-lg" placeholder="Initials"
                                    value={this.state.initials}
                                    onChange={this.updateInitials.bind(this)}
                                    required
                                />
                            </div>
                            <div className="col-lg-6 dropdown">
                                <input type="submit" className="form-control form-control-lg btn btn-outline-primary btn-lg" onClick={this.tick.bind(this)} value="Generate" />
                            </div>
                        </div>
                        {
                            this.state.log.map((entry) => (
                                <div className="row justify-content-center text-center">
                                    <div className={`col-md-8 d-flex justify-content-between ${entry.unused ? "unused" : ""}`} id={entry.code}>
                                        <p>Patient ID: <strong>{entry.code}</strong></p>
                                        <p>{entry.timestamp}</p>
                                        <p>{entry.initials}</p>
                                    </div>
                                    <div className="col-md-1">
                                        <input type="checkbox" onChange={(e) => {
                                            this.strikeThrough(e, entry.code)
                                        }} 
                                        checked={entry.unused ? true : false}/>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        )
    }
}