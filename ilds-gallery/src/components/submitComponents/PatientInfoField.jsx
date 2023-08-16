import React from "react";

export default class PatientInfoField extends React.Component {
    render() {
        return (
            <>
                <h4 className="mb-4">Patient Information</h4>
                <label htmlFor="age">
                    Age
                    <div className="mb-3 row">
                        <div className="form-group">
                            <input type="number" className="form-control form-control-lg" id="age"
                                name="age" placeholder="Age" min="0"
                                onChange={this.props.updateAge}/>
                        </div>
                    </div>
                </label>
                <label>
                    Assigned Sex
                    <div className="mb-3 row">
                        <div className="form-group">
                            <select class="form-control form-control-lg" name="severity" id="severity"
                                onChange={this.props.updateSex}
                                required>
                                <option value="" selected disabled hidden>Choose patient declared sex ↓</option>
                                <option value="f">Female</option>
                                <option value="m">Male</option>
                            </select>
                        </div>
                    </div>
                </label>
                <label>
                    History
                    <div className="mb-3 row">
                        <div className="form-group">
                            <select class="form-control form-control-lg" name="severity" id="severity"
                                onChange={this.props.updateHist}
                                onLoad={this.props.updateHist}
                                required>
                                <option value="" selected disabled hidden>Does the patient have a family history of this condition? ↓</option>
                                <option value="f">No, the patient does not have a family history of this condition</option>
                                <option value="t">Yes, the patient has a family history of this condition</option>
                            </select>
                        </div>
                    </div>
                </label>
            </>
        )
    }
}