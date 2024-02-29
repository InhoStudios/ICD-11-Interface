import React, { version } from "react";
import { ANATOMIC_SITES, SERVER_ENDPOINT } from "../utilities/Structures";
import mapAreas from "../body_sites.json"
import CopyComponent from "./CopyComponent";
import ImageMapper from 'react-img-mapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

export default class EditableModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            map: {
                name: 'anatomy-map',
                areas: mapAreas,
            },
            // TEMP
            original_visible: this.props.image.verified,
            diagnosis_visible: false,
            edit_anatomy_map: false,

            searchTimeout: null,
            entities: [
            ],
            selectedOption: {
                "@id":"",
                "title":{
                    "@value":"",
                },
                "definition":  {
                    "@value": ""
                },
            },
            query: "",
            fetched_versions: [
                // {
                //     url: '',
                //     version_number: '',
                //     verified: false,
                // },
            ],
            new_versions: [
                // {
                //     image: '',
                //     url: '',
                // },
            ],
        }
        this.ref = React.createRef();
    }

    componentDidMount() {
        console.log(this.props.image.anatomic_site);
        mapAreas.map((mapArea) => {
            mapArea.strokeColor = "#00000000";
            if (mapArea.name === this.props.image.anatomic_site) {
                mapArea.strokeColor = "#5b7fb3ff";
                mapArea.preFillColor = "#81aae64f";
            } else {
                mapArea.preFillColor = "#00000000";
            }
        });
        this.setState({
            map: {
                name: 'anatomy-map',
                areas: JSON.parse(JSON.stringify(mapAreas))
            },
        });
        this.getVersionImages();
    }

    async getVersionImages() {
        let versions = await fetch(`${SERVER_ENDPOINT}/db_select?values=distinct version_number, CONCAT('${SERVER_ENDPOINT}/', filepath) as url, verified&from=VersionFile&where=measurement_id='${this.props.image.measurement_id}'`)
            .then((imgs) => imgs.json())
            .catch((err) => console.log(err));
        this.setState({fetched_versions: versions});
        console.log(versions);
        return;
    }

    toggleVisibility(e) {
        this.setState({
            original_visible: !this.state.original_visible
        });
    }

    editDiagnosis(e) {
        this.setState({
            diagnosis_visible: !this.state.diagnosis_visible
        });
    }

    makeEditable(id) {
        document.getElementById(id).disabled = false;
    }

    handleQueryUpdate(e) {
        e.preventDefault();
        clearTimeout(this.state.searchTimeout);
        this.setState({ searchTimeout: setTimeout(() => this.performSearch(e.target.value, this), 300) });
    }

    async performSearch(input, caller) {
        let result = await fetch(`${SERVER_ENDPOINT}/search?query=${input}`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        let sortedEntities = result.destinationEntities.sort(this.nestedSort("score"));
        let hierarchicalEntities = []
        for (let entity of sortedEntities) {
            hierarchicalEntities = hierarchicalEntities.concat(this.DFSEntities(entity, 0));
        }
        caller.setState({entities: hierarchicalEntities, query: input});
    }

    DFSEntities(entity, depth) {
        let entities = [];
        entity.title = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".repeat(depth) + entity.title;
        entities.push(entity);

        for (let descendant of entity.descendants) {
            entities = entities.concat(this.DFSEntities(descendant, depth + 1));
        }
        return entities;
    }

    nestedSort = (prop1) => (e1, e2) => {
        return (e1[prop1] < e2[prop1]) ? 1 : (e1[prop1] > e2[prop1]) ? -1 : 0;
    }

    async handleSelectChange(entry, caller) {
        document.querySelectorAll(`.diagnosis-list-${this.props.image.measurement_id}`).forEach(a => a.style.display = "none");
        let id = entry.id.replace("http://id.who.int/icd/entity/","");
        let entity = await fetch(`${SERVER_ENDPOINT}/entity?entity_code=${id}&include=ancestor`)
            .then((data) => data.json())
            .catch((err) => console.log("handleSelectChange()", err));
        // TODO: Get ancestor IDs and append to case_categories
        console.log(entity);
    }

    handleClickImage(e) {
        e.preventDefault();
        let selectFieldID = `imgSelectField_${this.props.image.measurement_id}`;
        document.getElementById(selectFieldID).click();
    }

    handleAddImage(e) {
        let newURL = URL.createObjectURL(e.target.files[0]);
        let updated_versions = [
            ...this.state.new_versions,
            {
                image: e.target.files[0],
                url: newURL,
            },
        ];
        this.setState({
            new_versions: updated_versions
        });
        console.log(`handleAddImage(e)`);
    }

    handleDeleteImage(index, caller) {
        let new_vers = caller.state.new_versions;
        new_vers.splice(index, 1);
        caller.setState({
            new_versions: new_vers,
        });
        console.log(`handleDeleteImage(e)`);
    }

    async handleUpdateMeasurement() {
        //

        if (window.confirm("Any updates will overwrite the previous metadata. Are you sure you want to update this image?")) {
            const formData = new FormData();
            let vers = 1;
            this.state.new_versions.forEach((version_image) => {
                formData.append(`${this.props.image.measurement_id}_v${vers}`, version_image.image);
                vers++;
            });
            formData.append("measurement_id", this.props.image.measurement_id);
    
            await axios.post(`${SERVER_ENDPOINT}/update`, formData, {});
            window.location.reload();
        }
        // add other update details
    }

    render() {
        return (
            <div id={this.props.image.measurement_id} className="modal">
                <span className="mx-3 close" onClick={(e) => {
                    e.preventDefault();
                    this.props.closeModal(this.props.image.measurement_id);
                }}>&times;</span>
                <div className="modal-content">
                    <div className="row">
                        {/*
                        IMAGE PANEL
                        */}
                        <div className="col-lg-4 modal-img-panel text-center">
                            <div className="overlay-wrapper modal-img">
                                <img src={this.props.image.url} class="img-fluid"/>
                                <div className="hoverable-icon">
                                    <a className="edit-icon" onClick={this.toggleVisibility.bind(this)}>
                                        <FontAwesomeIcon icon={ this.state.original_visible ? faEye : faEyeSlash } />
                                    </a>
                                </div>
                            </div>
                            {
                                this.state.fetched_versions.length > 0 ?
                                this.state.fetched_versions.map((version) => (
                                    <div className="modal-img mb-3">
                                        <img src={version.url} class="img-fluid"/>
                                    </div>
                                )) : 
                                <></>
                            }
                            {
                                this.state.new_versions.length > 0 ?
                                this.state.new_versions.map((version, index) => (
                                    <div className="overlay-wrapper modal-img">
                                        <div className="modal-img mb-3">
                                            <img src={version.url} class="img-fluid"/>
                                            <div className="hoverable-icon">
                                                <a className="dlt-icon" onClick={(e) => {
                                                    e.preventDefault();
                                                    this.handleDeleteImage(index, this)
                                                }}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )) : 
                                <></>
                            }
                            <button className="btn btn-large btn-secondary form-control form-control-lg"
                                onClick={this.handleClickImage.bind(this)}>
                                    + Add new version
                            </button>
                            <input type="file" className="hidden-passthrough"
                                id={`imgSelectField_${this.props.image.measurement_id}`} name="newVersion" accept="image/*" 
                                onChange={(e) => {
                                        this.handleAddImage(e)
                                    }
                                }/>
                        </div>
                        {/*
                        CONTENT PANEL
                        */}
                        <div className="col-lg-8 modal-content-panel">
                            <div className="mx-2 mb-4 row">
                                <div className="col-lg-10">
                                    <p>
                                        ICD-11 Entity: <a href={`https://icd.who.int/dev11/l-derma/en#/http%3a%2f%2fid.who.int%2ficd%2fentity%2f${this.props.image.entity_id}`} target="_blank"><strong>http://id.who.int/icd/entity/{this.props.image.entity_id}</strong></a>
                                    </p>
                                    <div className="overlay-wrapper">
                                        <h1 className="mb-4"><u>{this.props.image.entity_title}</u></h1>
                                        <div className="hoverable-icon">
                                            <a className="edit-icon" onClick={ this.editDiagnosis.bind(this) } >
                                                <FontAwesomeIcon icon={ faEdit } />
                                            </a>
                                        </div>
                                    </div>
                                    {
                                        this.state.diagnosis_visible ?
                                        
                                        <div className="col-lg-12 mb-3 dropdown">
                                            <input type="input" className="form-control form-control-lg" id="search"
                                                name="search" placeholder="Search Diagnosis ↓"
                                                    // value={this.state.query}
                                                    onChange={this.handleQueryUpdate.bind(this)}
                                                    onFocus={(e) => {
                                                        e.preventDefault();
                                                        document.querySelectorAll(`.diagnosis-list-${this.props.image.measurement_id}`).forEach(a => a.style.display = "block");
                                                    }}/>
                                            <div className={`search-content diagnosis-list-${this.props.image.measurement_id}`}>
                                                {
                                                    this.state.entities.map((entry) => (
                                                        <a onClick={(e) => {
                                                            e.preventDefault();
                                                            //this.handleSelectChange(entry, this);
                                                        }}
                                                        id={
                                                            entry.id.replace("https://id.who.int/icd/entity/")
                                                        } dangerouslySetInnerHTML={{__html: entry.title}} />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        :
                                        <></>
                                    }
                                    {/* <h5 className="mb-2">Body site: {
                                        ANATOMIC_SITES[ANATOMIC_SITES.findIndex(site => site.index == parseInt(this.props.image.anatomic_site))].site
                                    }</h5> */}
                                    <h3 className="mb-2">Description</h3>
                                    <p className="mb-4">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget erat lorem. Praesent sodales erat hendrerit orci imperdiet egestas. In diam leo, auctor vitae malesuada vel, accumsan eget purus. Vivamus viverra iaculis nisl, ut interdum purus tincidunt at. Integer tristique velit non dui imperdiet, posuere dapibus arcu ultrices. Sed fermentum egestas libero nec venenatis. Sed ut sapien eleifend, placerat augue suscipit, efficitur quam. Curabitur placerat dui blandit scelerisque congue. Nunc et sapien accumsan, efficitur lectus ut, euismod sapien. Donec luctus felis quis commodo vehicula. Vivamus suscipit ultricies ex id aliquet. Sed in pulvinar metus. Donec lacinia augue eget turpis tempor dignissim. Aenean porttitor fringilla hendrerit. Aenean sit amet orci hendrerit, porttitor magna nec, lacinia tortor. Vivamus at mollis metus.
                                    </p>
                                    
                                    <h3 className="mb-2">Morphology</h3>
                                    <p className="mb-4">
                                        {this.props.image.morphology}
                                    </p>

                                    <h3 className="mb-2">Details</h3>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <label>
                                                Lesion Size (in mm)
                                            </label>
                                            <input type="number" id={`lesion-size${this.props.image.measurement_id}`} className="form-control form-control-lg mb-3" value={`${this.props.image.lesion_size}`} />
                                        </div>
                                    
                                        <div className="col-lg-6">
                                            <label>
                                                Severity
                                            </label>
                                            <select class="form-control form-control-lg" name="severity" id="severity">
                                                <option value={this.props.image.severity} selected disabled hidden>{this.props.image.severity == 'b' ? "Benign" : "Malignant"}</option>
                                                <option value="b">Benign</option>
                                                <option value="m">Malignant</option>
                                            </select>
                                            {/* <input type="text" id={`severity${this.props.image.measurement_id}`} className="form-control form-control-lg mb-3" value={this.props.image.severity == 'b' ? "Benign" : "Malignant"} disabled /> */}
                                        </div>
                                    </div>

                                    <label>
                                        Anatomic Site
                                    </label>
                                    <div className="overlay-wrapper">
                                        <input type="text" className="form-control form-control-lg mb-3" 
                                            value={ANATOMIC_SITES[this.props.image.anatomic_site].name} disabled />
                                        <div className="hoverable-icon">
                                            <a className="edit-icon" href="#" onClick={(e) => {
                                                e.preventDefault();
                                                
                                            }}>
                                                <FontAwesomeIcon icon={ faEdit } />
                                            </a>
                                        </div>
                                    </div>
                                    {/* <input type="text" className="form-control form-control-lg mb-3" value={
                                        ANATOMIC_SITES[ANATOMIC_SITES.findIndex(site => site.index == this.props.image.anatomic_site)].site
                                    } disabled /> */}
                                    {
                                        this.props.show ?
                                        <ImageMapper src={`${process.env.PUBLIC_URL}/amap.png`} 
                                            map={this.state.map} 
                                            responsive={true} 
                                            parentWidth={800}
                                            disabled={true} 
                                        /> :
                                        <></>
                                    }
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="overlay-wrapper">
                                                <span>
                                                    Imaging Modality: {this.props.image.modality}
                                                </span>
                                                <div className="hoverable-icon">
                                                    <a className="edit-icon" href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                    }}>
                                                        <FontAwesomeIcon icon={ faEdit } />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <span>
                                                Patient ID: <CopyComponent value={this.props.image.participant_id} />
                                            </span>
                                        </div>
                                        <div className="col-lg-6">
                                            <span>
                                                Submitted by {this.props.image.attendant}
                                            </span>
                                        </div>
                                    </div>
                                    {/* <div className="row">
                                        <div className="col-lg-4">
                                            <span>
                                                ISO: 400
                                            </span>
                                        </div>
                                        <div className="col-lg-4">
                                            <span>
                                                Shutterspeed: 1/4000
                                            </span>
                                        </div>
                                        <div className="col-lg-4">
                                            <span>
                                                Aperture: f/5.6
                                            </span>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-lg-2">
                                    <h5 className="mb-3 mt-4"><u>Related Entities</u></h5>
                                    {
                                        this.props.categories.map((category) => (
                                            <h6>
                                                <a href={`https://icd.who.int/dev11/l-derma/en#/http%3a%2f%2fid.who.int%2ficd%2fentity%2f${category.entity_id}`} target="_blank">{category.entity_title}</a>
                                            </h6>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="mx-2 row">
                                <div className="col-lg-6">
                                    <button className="btn btn-large btn-primary form-control form-control-lg"
                                    onClick={this.handleUpdateMeasurement.bind(this)}>Save</button>
                                </div>
                                <div className="col-lg-6">
                                    <button className="btn btn-large btn-danger form-control form-control-lg">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}