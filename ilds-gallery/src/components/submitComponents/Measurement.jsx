import React from "react";
import { ANATOMIC_SITES } from "../../utilities/Structures";

export default class Measurement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anatomic: null,
            modality: null,
            lesion: null
        }
    }

    handleSiteSearchUpdate(e) {
        e.preventDefault();
        document.querySelectorAll(".asites").forEach(a => a.style.display = "block");
        let val = e.target.value;
        this.setState({anatomic:val});
        document.querySelectorAll(".asite-element").forEach(a => {
            let txt = a.textContent || a.innerText;
            if (txt.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                a.style.display = "block";
            } else {
                a.style.display = "none";
            }
        })
    }

    handleUpdateSite(site) {
        this.setState({anatomic: site.site});
        document.querySelectorAll(".asites").forEach(a => a.style.display = "none");
        this.props.updateSite(site.index);
    }

    handleImageTypeInput(e) {
        e.preventDefault();
        let val = e.target.value;
        this.setState({modality: val})
        document.querySelectorAll(".std-type").forEach(a => {
            let txt = a.textContent || a.innerText;
            if (txt.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                a.style.display = "block";
            } else {
                a.style.display = "none";
            }
        })
        this.props.updateImgtype(val);
    }

    handleUpdateImgType(val) {
        this.setState({modality: val});
        document.querySelectorAll(".itype").forEach(a => a.style.display = "none");
        this.props.updateImgtype(val);
    }

    render() {
        return (
            <>
                <div className="text-center mb-3">
                    <img src={this.props.imageFile}/>
                </div>
                <div className="row mb-3">
                    <div className="form-group">
                            <input type="file" className="form-control form-control-lg"
                                id="imgUpload" name="filename" accept="image/*" 
                                onChange={this.props.updateImage}/>
                    </div>
                </div>
                <div className="form-group mb-5 row">
                    <div className="dropdown">
                        <input type="input" className="form-control form-control-lg" 
                            id="imgtype" placeholder="Imaging Modality ↓"
                            value={this.state.modality}
                            onChange={this.handleImageTypeInput.bind(this)}
                            onFocus={(e) => {
                                e.preventDefault();
                                document.querySelectorAll(".imodality").forEach(a => a.style.display = "block");
                            }}
                            onBlur={(e) => {
                                e.preventDefault();
                                document.querySelectorAll(".imodality").forEach(a => a.style.display = "none");
                            }}
                        />
                        <div className="search-content imodality">
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("PTG");
                            }}>
                                    Clinical Photography (PTG)
                            </a>
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("MDM");
                            }}>
                                    Multispectral Dermoscopy (MDM)
                            </a>
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("CLR");
                            }}>
                                    Colorimetry (CLR)
                            </a>
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("DRS");
                            }}>
                                    Diffuse Reflectance Spectroscopy (DRS)
                            </a>
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("SPK");
                            }}>
                                    Polarization Speckle (SPK)
                            </a>
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("POL");
                            }}>
                                    Stokes Polarimetry (POL)
                            </a>
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("MMS");
                            }}>
                                    Multimodal Microscopy (MMS)
                            </a>
                            <a className="itype std-type"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.handleUpdateImgType("RAM");
                            }}>
                                    Raman Spectroscopy (RAM)
                            </a>
                            <a className="itype">Other</a>
                        </div>
                    </div>
                </div>
                <form method="post" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
                    <div className="row mb-3">
                        {/* <h4 className="mb-3">Search ICD-11 (ICDD) diagnosis</h4> */}
                        <h5 className="mb-4">Lesion Information</h5>
                        <div className="dropdown col-lg-10 mb-3">
                            <input type="input" className="form-control form-control-lg" 
                                id="imgtype" placeholder="Lesion ↓"
                                value={this.state.lesion}
                                onChange={this.handleImageTypeInput.bind(this)}
                                onFocus={(e) => {
                                    e.preventDefault();
                                    document.querySelectorAll(".lesions").forEach(a => a.style.display = "block");
                                }}
                                onBlur={(e) => {
                                    e.preventDefault();
                                    document.querySelectorAll(".lesions").forEach(a => a.style.display = "none");
                                }}
                            />
                            <div className="search-content lesions">
                                <a className="les"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    // this.handleUpdateImgType("Clinical");
                                }}>
                                        230928A4a92
                                </a>
                                <a className="les"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    // this.handleUpdateImgType("Dermoscopy");
                                }}>
                                        230928A2H57
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-2 mb-3">
                            <input type="submit" className="form-control form-control-lg btn btn-outline-primary btn-lg" value="New Lesion"/>
                        </div>
                        <div className="col-lg-6 dropdown">
                            <label htmlFor="search">
                                Search diagnosis
                            </label>
                                <input type="input" className="form-control form-control-lg" id="search"
                                    name="search" placeholder="Search Diagnosis ↓" value={this.props.query}
                                        onChange={this.props.updateQuery}
                                        onFocus={(e) => {
                                            e.preventDefault();
                                            document.querySelectorAll(".diagnosis-list").forEach(a => a.style.display = "block");
                                        }}/>
                                <div className="search-content diagnosis-list">
                                    {
                                        this.props.parent.state.entities.map((entry) => (
                                            <a onClick={(e) => {
                                                e.preventDefault();
                                                this.props.selectChange(entry, this.props.parent);
                                            }}
                                            id={
                                                entry.id.replace("https://id.who.int/icd/entity/")
                                            } dangerouslySetInnerHTML={{__html: entry.title}} />
                                        ))
                                    }
                                </div>
                        </div>
                        
                        <div className="col-lg-6 dropdown">
                            <label htmlFor="sitetext">
                                Anatomic Site
                            </label>
                            <input type="input" className="form-control form-control-lg" 
                                id="sitetext" placeholder="Choose Anatomic Site ↓"
                                value={this.state.anatomic}
                                onChange={this.handleSiteSearchUpdate.bind(this)}
                                onFocus={(e) => {
                                    e.preventDefault();
                                    document.querySelectorAll(".asites").forEach(a => a.style.display = "block");
                                }}
                                onBlur={(e) => {
                                    e.preventDefault();
                                    document.querySelectorAll(".asites").forEach(a => a.style.display = "none");
                                }}
                            />
                            <div className="search-content asites">
                                {
                                    ANATOMIC_SITES.map((site) => (
                                        <a 
                                            className="asite-element" 
                                            id={`ICDST${site.index}`} 
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                this.handleUpdateSite(site);
                                            }}>
                                            {site.site}
                                        </a>
                                    ))
                                }
                            </div>
                            {/* <input type="button" className="form-control form-control-lg"
                                id="sitetext" name="sitetext" value="Choose anatomic site ↓"
                                onClick="showBodyMap()" />
                            <input type="input" className="hidden-passthrough" id="anatomicsite"
                                name="anatomicsite" value="" /> */}
                        </div>
                    </div>
                </form>
                <div className="row mb-3">
                    <div class="hidden-passthrough" id="entityDefinition">
                        <h5>{this.props.parent.state.selectedOption.title["@value"]}</h5>
                        <h6>{this.props.parent.state.selectedOption["@id"]}</h6>
                        <p>{
                            this.props.parent.state.selectedOption?.definition ? this.props.parent.state.selectedOption.definition["@value"] : ""
                        }</p>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-lg-6 dropdown">
                        <div className="row mb-3">
                            <label>
                                Disease Severity
                                    <div className="form-group">
                                        <select class="form-control form-control-lg" name="severity" id="severity"
                                            onChange={this.props.updateSeverity}
                                            required>
                                            <option value="" selected disabled hidden>Benign or Malignant ↓</option>
                                            <option value="b">Benign</option>
                                            <option value="m">Malignant</option>
                                        </select>
                                    </div>
                            </label>
                        </div>
                        {/* <label>
                            DIfficulty of Diagnosis
                            <div className="form-group mb-3 row">
                                <div className="form-control-lg">
                                    <input className="form-control-lg col-lg-12" type="range" min="1"
                                            max="5" defaultValue="3" id="easeofdiag" name="easeofdiag" 
                                            onChange={this.props.updateDod}/>
                                </div>
                            </div>
                        </label> */}
                    </div>
                    <div className="col-lg-6 dropdown">
                        <div className="mb-3 row">
                            <label htmlFor="size">
                                Lesion Size (mm)
                                    <div className="form-group">
                                        <input type="number" className="form-control form-control-lg" id="size"
                                                name="size" placeholder="Lesion size (mm)" min="0"
                                                onChange={this.props.updateSize}/>
                                    </div>
                            </label>
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <div className="form-group">
                            <label>
                                Morphology
                            </label>
                            <textarea className="form-control form-control-lg"></textarea>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}