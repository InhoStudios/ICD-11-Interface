import React from "react";
import ImageUploadField from "../components/submitComponents/ImageUploadField";
import PatientInfoField from "../components/submitComponents/PatientInfoField";
import axios from "axios";
import { Case, ImageMetadata, Lesion, Metadata, Participant, SERVER_ENDPOINT } from "../utilities/Structures";
import ConfirmModal from "../components/ConfirmModal";
import UploadedModal from "../components/UploadedModal";

export default class Submit extends React.Component {
    searchQuery = "test";
    constructor(props) {
        super(props);
        // this.timeoutFunc = setTimeout(this.performSearch, 0);
        this.state = {
            hideclass: "hidden-passthrough",
            searchTimeout: setTimeout(this.performSearch, 0),
            patientTimeout: setTimeout(this.getPatient, 0),
            query: "",
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
            case: new Case(),
            participant: new Participant(),
            image: '',
            image_file: "",
            metadata: new ImageMetadata(),
            attending_investigator: "",
            patient_id: "",
            measurements: {},
            measurement_metadata: {
                0: new Metadata(),
            },
            lesions: {
                'empty': new Lesion()
            },
        };
    }

    componentDidMount() {
        this.loadPatientID();
    }

    async loadPatientID() {    
        let entry = await fetch(`${SERVER_ENDPOINT}/patient_id?initials=${this.state.initials}`)
            .then((entry) => entry.json())
            .catch((err) => console.log(err));
        console.log(entry);
        this.updateParticipant("participant_id", entry.code);
    }
    
    // UNUSED

    async handleEnterInvestigator(event) {
        event.preventDefault();
        this.setState({ attending_investigator: event.target.value });
    }

    async handleUpdatePatientID(event) {
        event.preventDefault();
        this.setState({ patient_id: event.target.value });
        clearTimeout(this.state.patientTimeout);
        this.setState({ patientTimeout: setTimeout(() => this.getPatientResults(event.target.value), 300) });
    
    }

    async handleGetPatientID(event) {
        event.preventDefault();
        if (this.state.attending_investigator === "") {
            alert("Please input your initials");
            return;
        };
        let initials = "";
        for (let subname of this.state.attending_investigator.split(" ")) {
            initials = initials + subname[0].toUpperCase();
        }
        let entry = await fetch(`${SERVER_ENDPOINT}/patient_id?initials=${initials}`)
            .then((entry) => entry.json())
            .catch((err) => console.log(err));
        console.log(entry);
        this.setState({
            patient_id: entry.code
        });
        this.getLog();
    }

    handleQueryUpdate(event) {
        event.preventDefault();
        clearTimeout(this.state.searchTimeout);
        this.setState({ searchTimeout: setTimeout(() => this.getPatientResults(event.target.value), 300) });
    }

    async getPatientResults(query) {
        if (query !== undefined) {
            let res = await fetch(`${SERVER_ENDPOINT}/db_select?values=p.participant_id&from=Participant p&where=p.participant_id like '${query}%'`)
                .then((data) => data.json())
                .catch((err) => console.log(err));
            if (res.length > 0) {
                this.setState({
                    participants: res,
                });
            }
        }
    }

    async getPatient(id) {
        console.log(id);
        if (id !== undefined){
            let part = await fetch(`${SERVER_ENDPOINT}/db_select?values=*&from=Participant p&where=p.participant_id="${id}"`)
                .then((data) => data.json())
                .catch((err) => console.log(err));
            console.log(part);
            if (part.length > 0) {
                let part0 = part[0];
                let dob = new Date(part0.birth_date);
                let newPart = new Participant(
                    part0.participant_id,
                    `${dob.getFullYear()}-${String(dob.getMonth()).padStart(2, 0)}`,
                    part0.sex,
                    part0.skin_type,
                    part0.ethnicity
                )
                this.setState({
                    patient_id: id,
                    participant: newPart,
                });
            }
        }
    }

    // used

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

    async uploadICDEntities(entities) {
        let formData = new FormData();

        let entityPairs = [];
        
        for (let fullEntity of entities) {
            let entity = {
                entity_title: `'${fullEntity.title
                    .replaceAll("<em class='found'>","")
                    .replaceAll("</em>","")
                    .replaceAll(/\&nbsp;/g,"")}'`,
                entity_id: `'${fullEntity.id.replaceAll("http://id.who.int/icd/entity/","")}'`
            };
            entityPairs.push(entity)
        }
        console.log(entityPairs);

        formData.append("into", "ICD_Entity");
        formData.append("values", JSON.stringify(entityPairs));
        let data = {
            "into": "ICD_Entity",
            "values": entityPairs
        };

        console.log(data);

        return await axios.post(`${SERVER_ENDPOINT}/db_insert`, data, {});
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

    async handleSelectChange(entry, caller) {
        document.querySelectorAll(".diagnosis-list").forEach(a => a.style.display = "none");
        let id = entry.id.replace("http://id.who.int/icd/entity/","");
        let entity = await fetch(`${SERVER_ENDPOINT}/entity?entity_code=${id}&include=ancestor`)
            .then((data) => data.json())
            .catch((err) => console.log("handleSelectChange()", err));
        // TODO: Get ancestor IDs and append to case_categories
        console.log(entity);
        let curCase = caller.state.case;
        let updateCase = {
            ...curCase
        };
        updateCase.title = entity.title["@value"].replace("<em class='found'>","").replace("</em>","");
        updateCase.userEntity = id;
        updateCase.ancestors = entity.ancestor;
        console.log(entity.ancestor);
        caller.setState({selectedOption: entity, case: updateCase});

        let definitionField = document.getElementById("entityDefinition");
        definitionField.style.display = "block";
    }

    nestedSort = (prop1) => (e1, e2) => {
        return (e1[prop1] < e2[prop1]) ? 1 : (e1[prop1] > e2[prop1]) ? -1 : 0;
    }

    // TODO: UPDATE ALL HANDLERS TO INCLUDE ID

    // NEW HANDLERS:
    
    handleUpdateMOB(e) {
        console.log(`handleUpdateMOB(${e.target.value})`);
        let date = Date.parse(e.target.value);
        console.log(date);
        this.updateParticipant("mob", e.target.value);
    }
    
    handleUpdateSkinType(e) {
        this.updateParticipant("skin_type", e.target.value);
        console.log(`handleUpdateSkinType(${e.target.value})`);
    }
    
    handleUpdateEthnicity(e) {
        this.updateParticipant("ethnicity", e.target.value);
        console.log(`handleUpdateEthnicity(${e.target.value})`);
    }

    handleUpdateGender(e) {
        this.updateParticipant("gender", e.target.value);
        console.log(`handleUpdateGender(${e.target.value})`);
    }

    openModal(e) {
        e.preventDefault();
        if (!this.checkCase()) {
            alert("One or more fields are empty\n Please double check before resubmitting");
            return;
        }
        console.log(this.state);
        console.log(Object.values(this.state.measurements));
        document.getElementById("confirm-modal").style.display="block";
    }

    closeModal(e) {
        e.preventDefault();
        document.getElementById("confirm-modal").style.display="none";
    }

    closeUploadModal(e) {
        e.preventDefault();
        document.getElementById("upload-modal").style.display="none";
        window.location.reload();
    }

    // old handlers

    handleUpdateSize(e) {
        this.updateCase("size", e.target.value);
        console.log(`handleUpdateSize(${e.target.value})`);
    }

    handleUpdateAge(e) {
        this.updateCase("age", e.target.value);
        console.log(`handleUpdateAge()`);
    }

    handleUpdateSite(index) {
        this.updateImageMetadata("anatomicSite", index);
        console.log(`handleUpdateSite(${index})`);
    }

    async handleUpload(e) {
        e.preventDefault();
        console.log(this.state);
        await this.uploadICDEntities(this.state.entities);
        if (!this.checkCase()) {
            alert("One or more fields are empty\n Please double check before resubmitting");
            return;
        }
        
        const formData = new FormData();
        let meas_id = 0;
        let imageArr = Object.values(this.state.measurements).forEach((measurement) => {
            // TODO: Set fieldname to image ID
            formData.append(`${measurement.metadata.lesion_id}${meas_id}`, measurement.image);
            meas_id++;
        });
        let uploadLesions = this.state.lesions;
        console.log(uploadLesions);
        delete uploadLesions['empty'];
        formData.append("measurements", JSON.stringify(this.state.measurements));
        formData.append("participant", JSON.stringify(this.state.participant));
        formData.append("lesions", JSON.stringify(uploadLesions));
        formData.append("attendant", this.state.attending_investigator);

        await axios.post(`${SERVER_ENDPOINT}/upload`, formData, {});

        document.getElementById("confirm-modal").style.display="none";
        document.getElementById("upload-modal").style.display="block";
        return;
        // TODO: REMOVE TEMP TESTING

        console.log(this.checkCase());
        if (!this.checkCase()) {
            alert("One or more fields are empty\n Please double check before resubmitting");
            return;
        }
        formData.append("image", imageArr);
        formData.append("case", JSON.stringify(this.state.case));
        formData.append("imageMetadata", JSON.stringify(this.state.metadata));
        await this.uploadICDEntities(this.state.entities);
        await axios.post(`${SERVER_ENDPOINT}/upload`, formData, {});
        alert("Successfully uploaded");
        return;
    }

    checkCase() {
        try {
            if (
                this.state.participant.participant_id === undefined ||
                this.state.participant.mob === undefined ||
                this.state.participant.gender === undefined ||
                this.state.participant.skin_type === undefined ||
                this.state.participant.ethnicity === undefined ||
                this.state.attending_investigator === ""
            ) {
                console.log("Participant, ", this.state.participant);
                return false;
            }
            for (let lesion in Object.values(this.state.lesions)) {
                if (lesion.lesion_id === 'empty') {
                    continue;
                }
                if (
                    lesion.lesion_id === '' ||
                    lesion.diagnosis_entity === ''
                ) {
                    console.log("Lesion, ", lesion);
                    return false;
                }
            }
            console.log(Object.values(this.state.measurements));
            for (let measurementInd in Object.values(this.state.measurements)) {
                let measurement = this.state.measurements[`${measurementInd}`];
                if (
                    measurement.image === "" ||
                    measurement.metadata.measurement_id === undefined || 
                    measurement.metadata.lesion_id === "empty" ||
                    measurement.metadata.modality === undefined
                ) {
                    console.log("Measurement, ", measurement);
                    return false;
                }
            }
            return true;
        } catch (error) { 
            console.error(error);
            return false;
        }
    }

    async updateCase(key, value) {
        let curCase = this.state.case;
        let newCase = {
            ...curCase
        };
        newCase[key] = value;
        return await this.setState({case: newCase});
    }

    async updateParticipant(key, value) {
        let part = this.state.participant;
        let newPart = {
            ...part
        };
        newPart[key] = value;
        return await this.setState({participant: newPart});
    }

    render() {
        return (
            <section>
                <div className="container-fluid">
                    <div className="row justify-content-center mt-5 mb-3 text-center">
                        <h1>Submit image</h1>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-10 mb-2 text-left">
                            <div className="form-group row mb-4">
                                <h4 className="mb-4">Attending Investigator</h4>
                                <div className="col-lg-12">
                                    <input type="input" className="form-control form-control-lg" id="name"
                                        name="name" placeholder="Attending Investigator (Full Name)" value={this.state.attending_investigator}
                                            onChange={this.handleEnterInvestigator.bind(this)}/>
                                </div>
                            </div>
                            <PatientInfoField 
                                updateAge={this.handleUpdateAge.bind(this)}
                                updateMOB={this.handleUpdateMOB.bind(this)}
                                updateGender={this.handleUpdateGender.bind(this)}
                                updateSkinType={this.handleUpdateSkinType.bind(this)}
                                updateEthnicity={this.handleUpdateEthnicity.bind(this)}
                                participant={this.state.participant}
                            />
                            <ImageUploadField 
                                updateSite={this.handleUpdateSite.bind(this)}
                                updateQuery={this.handleQueryUpdate.bind(this)}
                                updateSize={this.handleUpdateSize.bind(this)}
                                parent={this}
                                measurements={this.state.measurements}
                            />

                            <div className="row mb-5">
                                <form method="post" encType="multipart/form-data">
                                    <div className="form-group mt-5 mb-3">
                                        <input 
                                            type="submit"
                                            className={`form-control form-control-lg btn btn-outline-primary btn-lg ${this.hideclass}`}
                                            id="upload_button" 
                                            value="Upload" 
                                            name="submit" 
                                            onClick={this.openModal.bind(this)}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmModal 
                    measurements={this.state.measurements}
                    participant={this.state.participant}
                    lesions={this.state.lesions}
                    attendant={this.state.attending_investigator}
                    parent={this}
                />
                <UploadedModal
                    parent={this}
                />
            </section>
        );
    }
}