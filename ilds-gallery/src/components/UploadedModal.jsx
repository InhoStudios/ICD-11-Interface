import React from "react";
import { ANATOMIC_SITES } from "../utilities/Structures";
import CopyComponent from "./CopyComponent";

export default class UploadedModal extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="upload-modal" className="modal">
                <div className="modal-content fill-modal">
                    <div className="text-center">
                        <h1 className="mb-5">Successfully uploaded</h1>
                        <img className="img-fluid mb-5" src={`${process.env.PUBLIC_URL}/tick.png`}/>
                        <a 
                            href="/"
                            className={`form-control form-control-lg btn btn-secondary btn-lg mb-3`}
                        >View Gallery</a>
                        <input 
                            type="submit"
                            className={`form-control form-control-lg btn btn-primary btn-lg mb-3`}
                            id="upload_button" 
                            value="Ok" 
                            name="success" 
                            onClick={(e) => {
                                this.props.parent.closeUploadModal(e);
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}