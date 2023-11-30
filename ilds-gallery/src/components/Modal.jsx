import React from "react";
import { ANATOMIC_SITES } from "../utilities/Structures";

export default class Modal extends React.Component {
    render() {
        return (
            <div id={this.props.image.img_id} className="modal">
                <span className="mx-3 close" onClick={(e) => {
                    e.preventDefault();
                    this.props.closeModal(this.props.image.img_id);
                }}>&times;</span>
                <div className="modal-content">
                    <div className="row">
                        {/*
                        IMAGE PANEL
                        */}
                        <div className="col-lg-4 modal-img-panel text-center">
                            <img src={this.props.image.url} class="img-fluid modal-img"/>
                            <img src={this.props.image.url} class="img-fluid modal-img"/>
                        </div>
                        {/*
                        CONTENT PANEL
                        */}
                        <div className="col-lg-8 modal-content-panel">
                            <div className="mx-2 row">
                                <div className="col-lg-10">
                                    <p>
                                        ICD-11 Entity: <strong>http://id.who.int/icd/entity/{this.props.image.user_selected_entity}</strong>
                                    </p>
                                    <h1 className="mb-4"><u>{this.props.image.entity_title}</u></h1>
                                    {/* <h5 className="mb-2">Body site: {
                                        ANATOMIC_SITES[ANATOMIC_SITES.findIndex(site => site.index == parseInt(this.props.image.anatomic_site))].site
                                    }</h5> */}
                                    <h3 className="mb-2">Description</h3>
                                    <p className="mb-4">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget erat lorem. Praesent sodales erat hendrerit orci imperdiet egestas. In diam leo, auctor vitae malesuada vel, accumsan eget purus. Vivamus viverra iaculis nisl, ut interdum purus tincidunt at. Integer tristique velit non dui imperdiet, posuere dapibus arcu ultrices. Sed fermentum egestas libero nec venenatis. Sed ut sapien eleifend, placerat augue suscipit, efficitur quam. Curabitur placerat dui blandit scelerisque congue. Nunc et sapien accumsan, efficitur lectus ut, euismod sapien. Donec luctus felis quis commodo vehicula. Vivamus suscipit ultricies ex id aliquet. Sed in pulvinar metus. Donec lacinia augue eget turpis tempor dignissim. Aenean porttitor fringilla hendrerit. Aenean sit amet orci hendrerit, porttitor magna nec, lacinia tortor. Vivamus at mollis metus.
                                    </p>
                                    
                                    <h3 className="mb-2">Morphology</h3>
                                    <p className="mb-4">
                                    Aliquam erat volutpat. Mauris feugiat nisl nulla, sed viverra enim condimentum scelerisque. Praesent faucibus vulputate ultrices. Maecenas nunc ligula, ullamcorper id massa quis, mollis eleifend enim. Pellentesque aliquet pretium nulla ac sodales. Integer aliquam lorem ut lectus volutpat, sed viverra augue lacinia. Nam leo felis, ullamcorper eu justo quis, facilisis iaculis ex. Fusce faucibus risus non dictum rhoncus. Etiam eleifend volutpat nibh id pulvinar.   
                                    </p>

                                    <h3 className="mb-2">Details</h3>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <label>
                                                Lesion Size
                                            </label>
                                            <input type="text" className="form-control form-control-lg mb-3" value={this.props.image.modality} disabled />
                                        </div>
                                    
                                        <div className="col-lg-6">
                                            <label>
                                                Severity
                                            </label>
                                            <input type="text" className="form-control form-control-lg mb-3" value={this.props.image.modality} disabled />
                                        </div>
                                    </div>

                                    <label>
                                        Anatomic Site
                                    </label>
                                    <input type="text" className="form-control form-control-lg mb-3" value={
                                        ANATOMIC_SITES[ANATOMIC_SITES.findIndex(site => site.index == this.props.image.anatomic_site)].site
                                    } disabled />
                                        
                                    <div className="row mb-5">
                                        <img className="img-fluid" src={`${process.env.PUBLIC_URL}/amap.png`}/>
                                    </div>

                                    <span>
                                        Patient ID: <strong>{this.props.image.participant_id}</strong>
                                        <br/>
                                        Imaging Modality: {this.props.image.modality}
                                    </span>
                                    <div className="row">
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
                                    </div>
                                </div>
                                <div className="col-lg-2">
                                    <h5 className="mb-3 mt-4"><u>Related Entities</u></h5>
                                    <h6><a href="#">Other Entity</a></h6>
                                    <h6><a href="#">Other Entity</a></h6>
                                    <h6><a href="#">Other Entity</a></h6>
                                    <h6><a href="#">Other Entity</a></h6>
                                    <h6><a href="#">Other Entity</a></h6>
                                    <h6><a href="#">Other Entity</a></h6>
                                    <h6><a href="#">Other Entity</a></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}