import React from "react";
import ImageCard from "../components/ImageCard";
import { SERVER_ENDPOINT } from "../utilities/Structures";
import FilterBar from "../components/FilterBar";

export default class Verify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
        };
        this.getImagesFromDB();
    }

    async getImagesFromDB() {
        let images = await fetch(`${SERVER_ENDPOINT}/db_select?values=i.img_id, i.case_id, i.url, i.modality, c.user_selected_entity, e.entity_title&from=Image i, Cases c, ICD_Entity e&where=c.case_id=i.case_id and e.entity_id=c.user_selected_entity`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        this.setState({images: images});
    }

    render() {
        return (

            <section>
                <div className="container-fluid">
                    <div className="row justify-content-center mt-5 mb-3 text-center">
                        <h1>Images</h1>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-10 mb-2 text-left">
                            <FilterBar />
                            <div className="row mt-2">
                                {
                                    this.state.images.map((image) => (
                                        <ImageCard
                                            filepath={image.url}
                                            uri={image.user_selected_entity}
                                            title={image.entity_title}
                                            colsize={"col-lg-3"}/>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}