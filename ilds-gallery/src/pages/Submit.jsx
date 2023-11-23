import React from "react";
import ImageUploadField from "../components/submitComponents/ImageUploadField";
import PatientInfoField from "../components/submitComponents/PatientInfoField";
import axios from "axios";
import { Case, ImageMetadata, Participant, SERVER_ENDPOINT } from "../utilities/Structures";

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
            image: '',
            image_file: "",
            metadata: new ImageMetadata(),
            attending_investigator: "",
            patient_id: "",
            measurements: {
                0: {
                    image: '',
                    image_file: ''
                }
            },
            participant: new Participant(),
            participants: [],
        };
    }

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
        if (query != undefined) {
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
        if (id != undefined){
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
                    part0.eye_colour,
                    part0.skin_type,
                    part0.ethnicity,
                    part0.hair_colour
                )
                this.setState({
                    patient_id: id,
                    participant: newPart,
                });
            }
        }
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

    async uploadICDEntities(entities) {
        let formData = new FormData();

        let entityPairs = [];
        
        for (let fullEntity of entities) {
            let entity = {
                entity_title: `'${fullEntity.title
                    .replace("<em class='found'>","")
                    .replace("</em>","")
                    .replace(/\&nbsp;/g,"")}'`,
                entity_id: `'${fullEntity.id.replace("http://id.who.int/icd/entity/","")}'`
            };
            entityPairs.push(entity)
        }

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

    handleUpdateSeverity(e) {
        this.updateCase("severity", e.target.value);
        console.log(`handleUpdateSeverity(${e.target.value})`);
    }

    handleUpdateDod(e) {
        console.log(`handleUpdateDod(${e.target.value})`);
    }

    handleUpdateSize(e) {
        this.updateCase("size", e.target.value);
        console.log(`handleUpdateSize(${e.target.value})`);
    }

    handleUpdateAge(e) {
        this.updateCase("age", e.target.value);
        console.log(`handleUpdateAge()`);
    }

    handleUpdateSex(e) {
        this.updateCase("sex", e.target.value);
        console.log(`handleUpdateSex()`);
    }

    handleUpdateHist(e) {
        this.updateCase("history", e.target.value);
        console.log(`handleUpdateHist()`);
    }

    handleUpdateImage(e) {
        console.log(`handleUpdateImage()`);
        let fileURL = URL.createObjectURL(e.target.files[0]);
        this.setState({ image: e.target.files[0], image_file: fileURL });
        console.log(e.target.files[0]);
    }

    handleUpdateImgtype(type) {
        console.log(`handleUpdateImgtype()`);
        this.updateImageMetadata("modality", type);
    }

    handleUpdateSite(index) {
        this.updateImageMetadata("anatomicSite", index);
        console.log(`handleUpdateSite(${index})`);
    }

    async handleUpload(e) {
        e.preventDefault();
        console.log(this.checkCase());
        if (!this.checkCase()) {
            alert("One or more fields are empty\n Please double check before resubmitting");
            return;
        }
        const formData = new FormData();
        formData.append("image", this.state.image);
        formData.append("case", JSON.stringify(this.state.case));
        formData.append("imageMetadata", JSON.stringify(this.state.metadata));
        await this.uploadICDEntities(this.state.entities);
        await axios.post(`${SERVER_ENDPOINT}/upload`, formData, {});
        alert("Successfully uploaded");
        return;
    }

    checkCase() {
        try {
            return (
                this.state.case.age !== undefined &&
                this.state.case.sex !== undefined &&
                this.state.case.history !== undefined &&
                this.state.case.userEntity !== undefined &&
                this.state.case.severity !== undefined
            )
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

    async updateImageMetadata(key, value) {
        let curImgMetadata = this.state.metadata;
        let newImgMetadata = {
            ...curImgMetadata
        };
        newImgMetadata[key] = value;
        return await this.setState({metadata: newImgMetadata})
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
                                <div className="col-lg-4">
                                    <input type="input" className="form-control form-control-lg" id="name"
                                        name="name" placeholder="Attending Investigator (Full Name)" value={this.state.attending_investigator}
                                            onChange={this.handleEnterInvestigator.bind(this)}/>
                                </div>
                                <div className="col-lg-6">
                                    <input type="input" className="form-control form-control-lg" id="patient_id"
                                        name="patient_id" placeholder="Patient ID" value={this.state.patient_id}
                                            onChange={this.handleUpdatePatientID.bind(this)}
                                            onFocus={(e) => {
                                                e.preventDefault();
                                                document.querySelectorAll(`.participant-list`).forEach(a => a.style.display = "block");
                                            }}
                                            onBlur={(e) => {
                                                e.preventDefault();
                                                document.querySelectorAll(`.participant-list`).forEach(a => a.style.display = "none");
                                            }}/>
                                    <div className={`search-content participant-list`}>
                                        {
                                            this.state.participants.map((participant) => (
                                                <a onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    this.getPatient(participant.participant_id);
                                                }}
                                                id={
                                                    participant.participant_id
                                                }
                                                dangerouslySetInnerHTML={{__html: participant.participant_id}} />
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-2">
                                    <input type="submit" className="form-control form-control-lg btn btn-outline-primary btn-lg" value="Generate New ID" onClick={this.handleGetPatientID.bind(this)}/>
                                </div>
                            </div>
                            <PatientInfoField 
                                updateAge={this.handleUpdateAge.bind(this)}
                                updateSex={this.handleUpdateSex.bind(this)}
                                updateHist={this.handleUpdateHist.bind(this)}
                                participant={this.state.participant}
                            />
                            <ImageUploadField 
                                updateImage={this.handleUpdateImage.bind(this)}
                                updateImgtype={this.handleUpdateImgtype.bind(this)}
                                updateSite={this.handleUpdateSite.bind(this)}
                                updateQuery={this.handleQueryUpdate.bind(this)}
                                updateSeverity={this.handleUpdateSeverity.bind(this)} 
                                updateDod={this.handleUpdateDod.bind(this)}
                                updateSize={this.handleUpdateSize.bind(this)}
                                selectChange={this.handleSelectChange}
                                query={this.props.query}
                                parent={this}
                                measurements={this.state.measurements}
                            />

                            <div className="row mb-5">
                                <form method="post" encType="multipart/form-data">
                                    {/* <div className={`row ${this.hideclass} mb-5`}>
                                        <DiagnosisField 
                                            entity={this.state.selectedOption} 
                                            updateSeverity={this.handleUpdateSeverity.bind(this)} 
                                            updateDod={this.handleUpdateDod.bind(this)}
                                            updateSize={this.handleUpdateSize.bind(this)}
                                        />
                                        <PatientInfoField 
                                            updateAge={this.handleUpdateAge.bind(this)}
                                            updateSex={this.handleUpdateSex.bind(this)}
                                            updateHist={this.handleUpdateHist.bind(this)}
                                        />
                                    </div> */}
                                        <div className="form-group mt-5 mb-3">
                                            <input 
                                                type="submit"
                                                className={`form-control form-control-lg btn btn-outline-primary btn-lg ${this.hideclass}`}
                                                id="upload_button" 
                                                value="Upload" 
                                                name="submit" 
                                                onClick={this.handleUpload.bind(this)}
                                            />
                                        </div>
                                    </form>
                                </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}