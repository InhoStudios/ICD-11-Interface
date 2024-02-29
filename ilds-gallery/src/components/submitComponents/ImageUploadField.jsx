import React from "react";
import ImageUploadFragment from "./ImageUploadFragment";
import Measurement from "./Measurement";
import { Metadata } from "../../utilities/Structures";

export default class ImageUploadField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            measurements: [],
            correspondingLesions: {},
            idCounter: 0,
            activeID: 0,
        };
    }

    toggleShow(id) {
        this.setState({
            activeID: id,
        });
    }

    async addImage() {
        let prevMeasurements = [
            ...this.state.measurements,
            <Measurement 
                id={this.state.idCounter} 
                toggleShow={this.toggleShow.bind(this)}
                activeID={this.state.activeID}
                container={this}
                {...this.props} />
        ];
        await this.setState({
            measurements: prevMeasurements,
            idCounter: this.state.idCounter + 1,
        });
        console.log(this.state.idCounter);
        
        let curMeasurementFiles = this.props.parent.state.measurements;
        let newMeasurementFiles = {
            ...curMeasurementFiles,
        };
        newMeasurementFiles[`${this.state.idCounter - 1}`] = {
            image: '',
            image_file: '',
            metadata: new Metadata(),
        };
        await this.props.parent.setState({
            measurements: newMeasurementFiles,
        });

        // let curMeasurements = this.props.parent.state.measurement_metadata;
        // let newMeasurements = {
        //     ...curMeasurements,
        // };
        // newMeasurements[`${this.state.idCounter - 1}`] = new Measurement();
        // await this.props.parent.setState({
        //     measurement_metadata: newMeasurements,
        // });
        
        let nextID = `imgUpload_${this.state.idCounter - 1}`;
        this.setState({
            activeID: nextID
        });
        document.getElementById(nextID).click();
        console.log(this.props.parent.state);
    }

    render() {
        return (
            <div className="mb-4">
                <h4 className="mb-4">Add Measurements</h4>
                <div id="measurements-sect">
                    {this.state.measurements}
                </div>
                <div className="form-group mb-3">
                    <input type="button"
                           className="form-control form-control-lg btn btn-primary btn-lg {{ hideclass }}"
                           id="newimg" value="+   Add Measurement" name="newimg" data-id="0"
                           onClick={this.addImage.bind(this)} />
                </div>
            </div>
        );
    }
}