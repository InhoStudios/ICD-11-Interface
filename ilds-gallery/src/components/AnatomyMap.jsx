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
            sitename: "[No body site selected]"
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

    render() {
        return (
            <div>
                <input type="input" className="form-control form-control-lg mb-3" id="sitename"
                    name="sitename" value={this.state.sitename} disabled/>
                {
                    this.props.show ? 
                    <ImageMapper src={`${process.env.PUBLIC_URL}/amap.png`} 
                        map={this.state.map} 
                        areaKeyName={this.props.id}
                        responsive={true} 
                        parentWidth={800} 
                        onClick={this.handleChangeAnatomicSite.bind(this)}
                    /> :
                    <></>
                }
            </div>
        )
    }
}