import React from "react";
import CopyComponent from "../CopyComponent";
export default class PatientInfoField extends React.Component {

    render() {
        return (
            <div class="mb-4">
                <h4 className="mb-4">Patient Information</h4>
                <div className="col-lg-12 mb-2">
                    <span>Participant ID:</span> 
                    <CopyComponent value={this.props.participant.participant_id} />
                </div>
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
                                            value={this.props.participant.mob}
                                            onChange={this.props.updateMOB}/>
                                    </div>
                            </label>
                        </div>
                        <div className="mb-3 row">
                            <label>
                                Gender
                                <div className="form-group">
                                    <select class="form-control form-control-lg" name="severity" id="severity"
                                        onChange={this.props.updateGender}
                                        value={this.props.participant.sex}
                                        required>
                                        <option value="" selected disabled hidden>Choose patient declared gender ↓</option>
                                        <option value="f">Female</option>
                                        <option value="m">Male</option>
                                        <option value="o">Other/Not listed</option>
                                    </select>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="mb-3 row">
                            <label>
                                Fitzpatrick Skin Type
                                <div className="form-group">
                                    <select class="form-control form-control-lg" name="skintype" id="skintype"
                                        onChange={this.props.updateSkinType}
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
                                Ethnicity
                                <div className="form-group">
                                    <select class="form-control form-control-lg" name="ethnicity" id="ethnicity"
                                        onChange={this.props.updateEthnicity}
                                        required>
                                        <option value="" selected disabled hidden>Choose the most appropriate option ↓</option>
                                        <option value="black">Black or African American</option>
                                        <option value="eastasian">East Asian</option>
                                        <option value="latino">Latino</option>
                                        <option value="middleeastern">Middle Eastern</option>
                                        <option value="southasian">South Asian</option>
                                        <option value="seasian">Southeast Asian</option>
                                        <option value="pi">Pacific Islander</option>
                                        <option value="white">White</option>
                                        <option value="multi">I identify with two or more categories</option>
                                        <option value="other">Other</option>
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