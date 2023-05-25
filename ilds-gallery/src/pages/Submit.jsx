import React from "react";
import ImageUploadField from "../components/submitComponents/ImageUploadField";
import PatientInfoField from "../components/submitComponents/PatientInfoField";
import DiagnosisField from "../components/submitComponents/DiagnosisField";
import axios from "axios";
import Case from "../utilities/Structures";

export default class Submit extends React.Component {
    searchQuery = "test";
    constructor(props) {
        super(props);
        // this.timeoutFunc = setTimeout(this.performSearch, 0);
        this.state = {
            hideclass: "hidden-passthrough",
            searchTimeout: setTimeout(this.performSearch, 0),
            query: "",
            entities: [
            ],
            selectedOption: {
                "@id":"",
                "title":{
                    "@value":"",
                },
                "definition":  "",
            },
            case: new Case(),
            image: '',
        }
    }

    handleQueryUpdate(event) {
        event.preventDefault();
        clearTimeout(this.state.searchTimeout);
        this.setState({ searchTimeout: setTimeout(() => this.performSearch(event.target.value, this), 300) });
    }

    async performSearch(input, caller) {
        let result = await fetch(`http://localhost:9000/search?query=${input}`)
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

    async handleSelectChange(entry, caller) {
        document.querySelectorAll(".diagnosis-list").forEach(a => a.style.display = "none");
        let id = entry.id.replace("http://id.who.int/icd/entity/","");
        let entity = await fetch(`http://localhost:9000/entity?entity_code=${id}`)
            .then((data) => data.json())
            .catch((err) => console.log("handleSelectChange()", err));
        let curCase = caller.state.case;
        let updateCase = {
            ...curCase
        };
        updateCase.title = entity.title["@value"].replace("<em class='found'>","").replace("</em>","");
        updateCase.userEntity = id;
        caller.setState({selectedOption: entity, case: updateCase});
    }

    nestedSort = (prop1) => (e1, e2) => {
        return (e1[prop1] < e2[prop1]) ? 1 : (e1[prop1] > e2[prop1]) ? -1 : 0;
    }

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
        this.setState({ image: e.target.files[0] });
        console.log(e.target.files[0])
    }

    handleUpdateImgtype() {
        console.log(`handleUpdateImgtype()`);
    }

    handleUpdateSite(index) {
        this.updateCase("anatomicSite", index);
        console.log(`handleUpdateSite(${index})`);
    }

    async handleUpload(e) {
        e.preventDefault();

        // TODO: Incorporate this image post into the upload functionality and wrap it into one endpoint

        await this.updateCase("caseID", `${new Date().getTime()}`);
        console.log(JSON.stringify(this.state.case));

        const formData = new FormData();
        formData.append("image", this.state.image);
        formData.append("case", JSON.stringify(this.state.case));
        let res = await axios.post("http://localhost:9000/upload", formData, {});
    }

    async updateCase(key, value) {
        let curCase = this.state.case;
        let newCase = {
            ...curCase
        };
        newCase[key] = value;
        return await this.setState({case: newCase});
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

                            <div className="row">

                                <form method="post" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
                                    <div className="row mb-3">
                                        <h4 className="mb-3">Search ICD-11 (ICDD) diagnosis</h4>
                                        <div className="form-group dropdown">
                                            {/* <Select options={{"":"Search Diagnosis"}} value={null} onChange={this.handleSelectChange} className="form-control form-control-lg" id="search" name="search"/> */}
                                            <input type="input" className="form-control form-control-lg" id="search"
                                                name="search" placeholder="Search Diagnosis" value={this.props.query}
                                                    onChange={this.handleQueryUpdate.bind(this)}
                                                    onFocus={(e) => {
                                                        e.preventDefault();
                                                        document.querySelectorAll(".diagnosis-list").forEach(a => a.style.display = "block");
                                                    }}/>
                                            <div className="search-content diagnosis-list">
                                                {
                                                    this.state.entities.map((entry) => (
                                                        <a onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handleSelectChange(entry, this);
                                                        }}
                                                        id={
                                                            entry.id.replace("https://id.who.int/icd/entity/")
                                                        } dangerouslySetInnerHTML={{__html: entry.title}} />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <form method="post" encType="multipart/form-data">
                                    <div className={`row ${this.hideclass} mb-5`}>
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
                                        <ImageUploadField 
                                            updateImage={this.handleUpdateImage.bind(this)}
                                            updateImgtype={this.handleUpdateImgtype.bind(this)}
                                            updateSite={this.handleUpdateSite.bind(this)}
                                        />
                                    </div>
                                    <div className="row mb-5">
                                        <div className="form-group mb-3">
                                            <input 
                                                type="submit"
                                                className={`form-control form-control-lg btn btn-outline-primary btn-lg ${this.hideclass}`}
                                                id="upload_button" 
                                                value="Upload" 
                                                name="submit" 
                                                onClick={this.handleUpload.bind(this)}
                                            />
                                        </div>
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