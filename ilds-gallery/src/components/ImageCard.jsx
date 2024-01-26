import React from "react";
import Modal from "./Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons'

export default class ImageCard extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            show_modal: false,
        };
    }

    openModal(id) {
        this.setState({
            show_modal: true
        });
        document.getElementById(id).style.display="block";
    }

    closeModal(id) {
        this.setState({
            show_modal: false
        })
        document.getElementById(id).style.display="none";
    }

    render() {
        return (
            <div className={this.props.colsize + " mb-2"}>
                <button className="btn">
                    <label>
                    <div className="card card-shadow" onClick={null}>
                        <div className="overlay-wrapper">
                            <img src={this.props.image.url} className="img-fluid crop-img" alt={this.props.image.entity_title}/>
                            <div className="open-modal">
                                <a className="icon" onClick={(e) => {
                                    e.preventDefault();
                                    this.openModal(this.props.image.measurement_id);
                                }}>
                                    <FontAwesomeIcon icon={faExpandAlt} />
                                </a>
                            </div>
                        </div>
                        <div className="card-body">
                            <span>http://id.who.int/icd/entity/{this.props.image.entity_id}</span>
                            <h4>{this.props.image.entity_title}</h4>
                            <p></p>
                        </div>
                    </div>
                    <input type="checkbox" className="form-check-input mt-3" name="imgselect"
                        value="-select" />
                    </label>
                </button>
                <Modal image={this.props.image} closeModal={this.closeModal.bind(this)} show={this.state.show_modal}></Modal>
            </div>
        )
    }
}