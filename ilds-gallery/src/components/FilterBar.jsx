import React from "react";
import { SERVER_ENDPOINT } from "../utilities/Structures";

export default class FilterBar extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            image_types: [],
            icd_entities: [
                {
                    entity_id: "",
                    entity_title: "",
                },
            ],
        };
        this.getEntitiesFromDB();
    }

    async getEntitiesFromDB() {
        return;
        let entities = await fetch(`${SERVER_ENDPOINT}/db_select?values=distinct e.entity_title, e.entity_id&from=ICD_Entity e, Lesion_Categories c&where=c.entity_id=e.entity_id`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        this.setState({icd_entities: entities});
    }

    handleUpdateImageType() {

    }

    handleUpdateSeverity() {

    }
    
    handleUpdateDiagnosisList(e) {
        console.log(e.target.value);
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-3 mb-3">
                    <input type="input" className="form-control" placeholder="Search" />
                </div>
                <div className="col-lg-9 mb-3">
                    <div className="dropdown px-2">
                        <button className="btn btn-outline-secondary">ICD Entity Classification ↓</button>
                        <div className="dropdown-content">
                            <a className="pe-3">
                                <label>
                                    <input type="checkbox" className="mx-2" value="Clinical"></input>
                                    All diagnoses
                                </label>
                            </a>
                            {
                                this.state.icd_entities.map((entity) => (
                                <a className="pe-3">
                                    <label>
                                        <input type="checkbox" className="mx-2" value={entity.entity_id} name="diagnoses" onChange={this.handleUpdateDiagnosisList}></input>
                                        {entity.entity_title}
                                    </label>
                                </a>
                                ))
                            }
                            {/*{% for key in categories.keys() %}*/}
                            {/*<a href="#{{ key }}">{{categories[key]}}</a>*/}
                            {/*{% endfor %}*/}
                        </div>
                    </div>
                    <div className="dropdown px-2">
                        <button className="btn btn-outline-secondary">Severity ↓</button>
                        <div className="dropdown-content">
                            <a className="pe-3">
                                <label>
                                    <input type="radio" name="severity" className="mx-2" value="All"></input>
                                    All
                                </label>
                            </a>
                            <a className="pe-3">
                                <label>
                                    <input type="radio" name="severity" className="mx-2" value="Benign"></input>
                                    Benign
                                </label>
                            </a>
                            <a className="pe-3">
                                <label>
                                    <input type="radio" name="severity" className="mx-2" value="Malignant"></input>
                                    Malignant
                                </label>
                            </a>
                        </div>
                    </div>
                    <div className="dropdown px-2">
                        <button className="btn btn-outline-secondary">Image Capture Method ↓</button>
                        <div className="dropdown-content">
                            <a className="pe-3">
                                <label>
                                    <input type="checkbox" className="mx-2" value="Clinical"></input>
                                    Clinical
                                </label>
                            </a>
                            <a className="pe-3">
                                <label>
                                    <input type="checkbox" className="mx-2" value="Clinical"></input>
                                    Dermoscopy
                                </label>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}