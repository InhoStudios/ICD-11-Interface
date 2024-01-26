import React from "react";
import { SERVER_ENDPOINT } from "../utilities/Structures";
import { ANATOMIC_SITES } from "../utilities/Structures";
import CopyComponent from "./CopyComponent";

export default class ConfirmModal extends React.Component {


    render() {
        return (
            <div id="confirm-modal" className="modal">
                <span className="mx-3 close" onClick={(e) => {
                    e.preventDefault();
                    this.props.parent.closeModal(e);
                }}>&times;</span>
                <div className="modal-content">
                    
                    <h3 className="mb-4">Participant Information</h3>
                    <div className="row mb-2">
                        <span>
                            Patient ID: <CopyComponent value={this.props.participant.participant_id} />
                        </span>
                    </div>
                    <div className="row mb-5">
                        <div className="col-lg-6">
                            <label>
                                Month of Birth
                            </label>
                            <input type="month" 
                                className="form-control form-control-lg mb-3" 
                                value={this.props.participant.mob} 
                                disabled
                            />
                        </div>
                        <div className="col-lg-6">
                            <label>
                                Fitzpatrick Skin Type
                            </label>
                            <input type="text" 
                                className="form-control form-control-lg mb-3" 
                                value={this.props.participant.skin_type} 
                                disabled
                            />
                        </div>
                        <div className="col-lg-6">
                            <label>
                                Gender
                            </label>
                            <input type="text" 
                                className="form-control form-control-lg mb-3" 
                                value={
                                    this.props.participant.gender == 'm' ?
                                    "Male" : this.props.participant.gender == 'f' 
                                    ? "Female" : "Other/Not Listed"
                                } 
                                disabled
                            />
                        </div>
                        <div className="col-lg-6">
                            <label>
                                Ethnicity
                            </label>
                            <input type="text" 
                                className="form-control form-control-lg mb-3" 
                                value={this.props.participant.ethnicity} 
                                disabled
                            />
                        </div>
                    </div>
                    {/*
                    IMAGE PANEL
                    */}
                    {
                        Object.values(this.props.measurements).map((measurement) => (
                            <div className="row mb-3">
                                <div className="col-lg-4 modal-img-panel text-center">
                                    <img src={measurement.image_file} class="img-fluid modal-img"/>
                                </div>
                                <div className="col-lg-8 modal-content-panel">
                                    <div className="row">
                                        <h1 className="mb-2"><u>{this.props.parent.state.lesions[measurement.metadata.lesion_id].diagnosis_title}</u></h1>
                                        <p>
                                            ICD-11 Entity: <strong>http://id.who.int/icd/entity/{this.props.parent.state.lesions[measurement.metadata.lesion_id].diagnosis_entity}</strong>
                                        </p>
                                    </div>
                                    <div className="row">
                                        <p className="mb-3">
                                            {this.props.parent.state.lesions[measurement.metadata.lesion_id].morphology}
                                        </p>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <label>
                                                Lesion Size
                                            </label>
                                            <input type="text" className="form-control form-control-lg mb-3" 
                                                value={`${this.props.parent.state.lesions[measurement.metadata.lesion_id].size} mm`} disabled />
                                        </div>
                                    
                                        <div className="col-lg-6">
                                            <label>
                                                Severity
                                            </label>
                                            <input type="text" className="form-control form-control-lg mb-3" 
                                                value={this.props.parent.state.lesions[measurement.metadata.lesion_id].size == 'b' ? "Benign" : "Malignant"} disabled />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>
                                                Imaging Modality
                                            </label>
                                            <input type="text" className="form-control form-control-lg mb-3" 
                                                value={`${measurement.metadata.modality}`} disabled />
                                        </div>
                                        <div className="col-lg-6">
                                            <label>
                                                Body Site
                                            </label>
                                            <input type="text" className="form-control form-control-lg mb-3" 
                                                value={ANATOMIC_SITES[this.props.parent.state.lesions[measurement.metadata.lesion_id].anatomic_site].name} disabled />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                    <div className="row">
                        <div className="col-lg-6">
                            <input 
                                type="submit"
                                className={`form-control form-control-lg btn btn-secondary btn-lg`}
                                id="upload_button" 
                                value="Edit" 
                                name="submit" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.parent.closeModal(e);
                                }}
                            />
                        </div>
                        <div className="col-lg-6">
                            <input 
                                type="submit"
                                className={`form-control form-control-lg btn btn-outline btn-primary btn-lg`}
                                id="upload_button" 
                                value="Upload" 
                                name="submit" 
                                onClick={this.props.parent.handleUpload.bind(this.props.parent)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}