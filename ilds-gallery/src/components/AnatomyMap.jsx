import React from "react";
import ImageMapper from 'react-img-mapper';
import mapAreas from "../body_sites.json"

export default class AnatomyMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            map: {
                name: 'anatomy-map',
                areas: mapAreas
            },
            sitename: "[No body site selected]"
        }
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
    }

    render() {
        return (
            <div>
                <input type="input" className="form-control form-control-lg mb-3" id="sitename"
                    name="sitename" value={this.state.sitename} disabled/>
                <ImageMapper src={`${process.env.PUBLIC_URL}/amap.png`} 
                    map={this.state.map} 
                    responsive={true} 
                    parentWidth={800} 
                    onClick={this.handleChangeAnatomicSite.bind(this)}
                />
            </div>
        )
    }
}