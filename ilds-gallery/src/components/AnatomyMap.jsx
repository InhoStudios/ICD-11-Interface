import React from "react";
import ImageMapper from 'react-img-mapper';
import mapAreas from "../body_sites.json"

export default class AnatomyMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            map: {
                name: 'anatomy-map',
                areas: JSON.parse(JSON.stringify(mapAreas))
            },
            sitename: "[No body site selected]",
            show_modal: false,
        }
        this.ref = React.createRef();
    }

    handleChangeAnatomicSite(area, index, e) {
        console.log(area)
        let currentLesions = this.props.parent.state.lesions;
        let updatedLesions = {
            ...currentLesions
        };
        updatedLesions[`${this.props.les_id}`].anatomic_site = area.name;
        console.log(`handleChangeAnatomicSite(${area.name})`);
        this.props.parent.setState({
            lesions: updatedLesions,
        });
        this.setState({
            sitename: area.title
        });

        let newMap = [
            ...this.state.map.areas
        ];

        newMap.map((mapArea) => {
            mapArea.strokeColor = "#00000000";
            if (mapArea.name === area.name) {
                mapArea.strokeColor = "#5b7fb3ff";
                mapArea.preFillColor = "#81aae64f";
            } else {
                mapArea.preFillColor = "#00000000";
            }
        })
        this.setState({
            map: {
                name: 'anatomy-map',
                areas: JSON.parse(JSON.stringify(newMap))
            },
        });
    }
    
    openModal(e) {
        e.preventDefault();
        this.setState({
            show_modal: true
        });
        document.getElementById(this.props.id).style.display="block";
    }

    closeModal(e) {
        e.preventDefault();
        this.setState({
            show_modal: false
        })
        document.getElementById(this.props.id).style.display="none";
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-8">
                        <input type="input" className="form-control form-control-lg mb-3" id="sitename"
                            name="sitename" value={this.state.sitename} disabled/>
                    </div>
                    <div className="col-lg-4">
                        <input type="submit" className="form-control form-control-lg mb-3 btn-primary" id="sitename"
                            name="sitename" onClick={this.openModal.bind(this)} value="Choose body site"/>
                    </div>
                </div>
                <div id={this.props.id} className="modal">
                    <span className="mx-3 close" onClick={this.closeModal.bind(this)}>&times;</span>
                    <div className="modal-content" style={{height: "83%"}}>
                        <div className="row text-center">
                            <div className="col-lg-9">
                                {
                                    this.state.show_modal ? 
                                    <ImageMapper src={`${process.env.PUBLIC_URL}/amap.png`} 
                                        map={this.state.map} 
                                        areaKeyName={this.props.id}
                                        responsive={true} 
                                        parentWidth={900} 
                                        onClick={this.handleChangeAnatomicSite.bind(this)}
                                    /> :
                                    <></>
                                }
                            </div>
                            <div className="col-lg-3">
                                <input type="input" className="form-control form-control-lg mb-3" id="sitename"
                                    name="sitename" value={this.state.sitename} disabled/>
                                <input 
                                    type="submit"
                                    className={`form-control form-control-lg btn btn-outline btn-primary btn-lg`}
                                    value="Okay" 
                                    onClick={this.closeModal.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}