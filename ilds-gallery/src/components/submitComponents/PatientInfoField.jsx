import React from "react";

export default class PatientInfoField extends React.Component {
    render() {
        return (
            <div class="mb-4">
                <h4 className="mb-4">Patient Information</h4>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="mb-3 row">
                            <label htmlFor="age">
                                Month of Birth
                                    <div className="form-group">
                                        {/* <input type="number" className="form-control form-control-lg" id="age"
                                            name="age" placeholder="Age" min="0"
                                            onChange={this.props.updateAge}/> */}
                                        <input type="month" className="form-control form-control-lg" 
                                            value={this.props.participant.mob}/>
                                    </div>
                            </label>
                        </div>
                        <div className="mb-3 row">
                            <label>
                                Birth Sex
                                <div className="form-group">
                                    <select class="form-control form-control-lg" name="severity" id="severity"
                                        onChange={this.props.updateSex}
                                        value={this.props.participant.sex}
                                        required>
                                        <option value="" selected disabled hidden>Choose patient declared sex ↓</option>
                                        <option value="f">Female</option>
                                        <option value="m">Male</option>
                                    </select>
                                </div>
                            </label>
                        </div>
                        <div className="mb-3 row">
                            <label>
                                History
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
                            </label>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="mb-3 row">
                            <label>
                                Eye Colour
                                <div className="form-group">
                                    <select class="form-control form-control-lg" name="eyecol" id="eyecol"
                                        // onChange={this.props.updateSex}
                                        value={this.props.participant.eye_colour}
                                        required>
                                        <option value="" selected disabled hidden>Choose eye colour ↓</option>
                                        <option value="L">Light: Blue/Green/Grey</option>
                                        <option value="M">Medium: Hazel/Medium Brown/Light Brown</option>
                                        <option value="D">Dark: Dark Brown</option>
                                        <option value="blue"hidden>Blue</option>
                                        <option value="brown"hidden>Brown</option>
                                        <option value="green"hidden>Green</option>
                                        <option value="grey"hidden>Grey</option>
                                        <option value="hazel"hidden>Hazel</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </label>
                        </div>
                        <div className="mb-3 row">
                            <label>
                                Fitzpatrick Skin Type
                                <div className="form-group">
                                    <select class="form-control form-control-lg" name="skintype" id="skintype"
                                        // onChange={this.props.updateSex}
                                        value={this.props.participant.skin_type}
                                        required>
                                        <option value="" selected disabled hidden>Choose Fitzpatrick skin type ↓</option>
                                        <option value="1">I</option>
                                        <option value="2">II</option>
                                        <option value="3">III</option>
                                        <option value="4">IV</option>
                                        <option value="5">V</option>
                                        <option value="6">VI</option>
                                    </select>
                                </div>
                            </label>
                        </div>
                        <div className="mb-3 row">
                            <label>
                                Natural Hair Colour
                                <div className="form-group">
                                    <select class="form-control form-control-lg" name="severity" id="severity"
                                        onChange={this.props.updateHist}
                                        onLoad={this.props.updateHist}
                                        value={this.props.participant.hair_colour}
                                        required>
                                        <option value="" selected disabled hidden>Choose natural hair colour (at age 20) ↓</option>
                                        <option value="black">Black</option>
                                        <option value="darkbrown">Dark Brown</option>
                                        <option value="lightbrown">Light Brown</option>
                                        <option value="blonde">Blonde</option>
                                        <option value="red">Red</option>
                                    </select>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}