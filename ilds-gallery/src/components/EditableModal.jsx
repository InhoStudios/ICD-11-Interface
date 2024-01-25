import React from "react";
import { ANATOMIC_SITES } from "../utilities/Structures";

export default class EditableModal extends React.Component {
    render() {
        return (
            <div className="row mt-5">
                <div id={this.props.image.img_id} className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={(e) => {
                            e.preventDefault();
                            this.props.closeModal(this.props.image.img_id);
                        }}>&times;</span>
                        <div className="row">
                            <div className="col-lg-4">
                                <img src={this.props.image.url} class="img-fluid"/>
                            </div>
                            <div className="col-lg-8">
                                <span>
                                    Patient ID: {this.props.image.participant_id}
                                    <br/>ICD-11 Entity: http://id.who.int/icd/entity/{this.props.image.user_selected_entity}
                                </span>
                                <h3>{this.props.image.entity_title}</h3>
                                {/* <h5 className="mb-2">Body site: {
                                    ANATOMIC_SITES[ANATOMIC_SITES.findIndex(site => site.index == parseInt(this.props.image.anatomic_site))].site
                                }</h5> */}
                                <h5 className="mb-2">Image type: {this.props.image.modality}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}