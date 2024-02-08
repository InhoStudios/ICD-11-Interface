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
        let entities = await fetch(`${SERVER_ENDPOINT}/db_select?values=distinct e.entity_title as entity_title, e.entity_id as entity_id&from=ICD_Entity e, Lesion_Categories c&where=c.entity_id=e.entity_id`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        this.setState({icd_entities: entities});
        return;
    }

    handleUpdateImageType() {

    }

    handleUpdateSeverity() {

    }

    handleClearChecks() {
        var all_checks = document.getElementById("all_diagnoses");
        if (all_checks.checked) {
            document.querySelectorAll('input[name="diagnoses"]').forEach(dCheck => {
                dCheck.checked = false;
            });
            document.querySelectorAll(`.entity-card`).forEach(ec => {
                ec.style.display = "block";
            });
        }
    }

    handleUpdateSearch(e) {
        e.preventDefault();
        var all_checks = document.getElementById("all_diagnoses");
        all_checks.checked = true;
        this.handleClearChecks();

        let query = e.target.value;


        document.querySelectorAll(`.entity-card`).forEach(ec => {
            let title = ec.querySelector('h4').innerText || ec.querySelector('h4').textContent;
            let id = ec.querySelector('span').innerText || ec.querySelector('span').textContent;
            let classes = ec.classList;
            console.log(title, id, classes);
            if (title.toLowerCase().indexOf(query.toLowerCase()) > -1 || id.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                ec.style.display = "block";
            } else {
                ec.style.display = "none";
            }
        });
        
    }
    
    handleUpdateDiagnosisList(e) {
        var checks = document.getElementsByTagName("input");
        var all_checks = document.getElementById("all_diagnoses");
        var none_checked = true;
        var checkedList = [];
        for (var i = 0; i < checks.length; i++) {
            var check = checks[i];
            if (check.type === "checkbox" && check.name === "diagnoses" && check.checked) {
                none_checked = false;
                checkedList.push(check.value);
            }
        }

        all_checks.checked = none_checked;

        document.querySelectorAll(`.entity-card`).forEach(ec => {
            if (none_checked) {
                ec.style.display = "block";
            } else {
                ec.style.display = "none";
                for (var entity of checkedList) {
                    if (ec.classList.contains(entity) || none_checked) {
                        ec.style.display = "block";
                    }
                }
            }
        });

        console.log(none_checked);
        
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-3 mb-3">
                    <input type="input" className="form-control" placeholder="Search" onChange={this.handleUpdateSearch.bind(this)}/>
                </div>
                <div className="col-lg-9 mb-3">
                    <div className="dropdown px-2">
                        <button className="btn btn-outline-secondary">ICD Entity Classification ↓</button>
                        <div className="dropdown-content">
                            <a className="pe-3">
                                <label>
                                    <input type="checkbox" className="mx-2" id="all_diagnoses" value="all" onChange={this.handleClearChecks} checked></input>
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