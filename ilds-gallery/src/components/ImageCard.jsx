import React from "react";
import Modal from "./Modal";
import { SERVER_ENDPOINT } from "../utilities/Structures";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons'

export default class ImageCard extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            show_modal: false,
            parents_str: '',
            parents: [
                {
                    entity_title: 'abcde',
                    entity_id: '12345',
                },
            ]
        };
    }

    async componentDidMount() {
        let parents = await fetch(`${SERVER_ENDPOINT}/db_select?values=distinct e.entity_title as entity_title, c.entity_id as entity_id&from=ICD_Entity e, Lesion_Categories c&where=c.lesion_id='${this.props.image.lesion_id}' and e.entity_id=c.entity_id`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        let parent_ids = [];
        parents.forEach((parent) => {
            parent_ids.push(parent.entity_id);
        });
        let parents_str = parent_ids.join(" ");
        this.setState({
            parents_str: parents_str,
            parents: parents
        });
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
            <div className={`${this.props.colsize} mb-2 entity-card ${this.props.image.entity_id} ${this.state.parents_str}`}>
                <button className="btn">
                    <label>
                    <div className="card card-shadow" onClick={null}>
                        <div className="overlay-wrapper">
                            <img src={this.props.image.url} className="img-fluid crop-img" alt={this.props.image.entity_title}/>
                            <div className="open-modal">
                                <a className="icon" href="#" onClick={(e) => {
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
                <Modal image={this.props.image} categories={this.state.parents} closeModal={this.closeModal.bind(this)} show={this.state.show_modal}></Modal>
            </div>
        )
    }
}