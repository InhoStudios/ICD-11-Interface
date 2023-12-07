import React from "react";
import ImageUploadFragment from "./ImageUploadFragment";
import Measurement from "./Measurement";

export default class ImageUploadField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            measurements: [],
            idCounter: 0,
        };
    }

    async addImage() {
        await this.setState(prevState => ({
            measurements: [...prevState.measurements, 
                <Measurement 
                    id={prevState.idCounter} 
                    {...this.props} />
                ],
            idCounter: prevState.idCounter + 1,
        }));
        
        let curMeasurementFiles = this.props.parent.state.measurements;
        let newMeasurementFiles = {
            ...curMeasurementFiles,
        };
        newMeasurementFiles[`${this.state.idCounter - 1}`] = {
            image: '',
            image_file: '',
        }
        await this.props.parent.setState({
            measurements: newMeasurementFiles,
        });

        let curMeasurements = this.props.parent.state.measurement_metadata;
        let newMeasurements = {
            ...curMeasurements,
        };
        newMeasurements[`${this.state.idCounter - 1}`] = new Measurement();
        await this.props.parent.setState({
            measurement_metadata: newMeasurements,
        });
        
        let nextID = `imgUpload_${this.state.idCounter - 1}`;
        document.getElementById(nextID).click();
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