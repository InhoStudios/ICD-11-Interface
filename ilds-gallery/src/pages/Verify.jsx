import React from "react";
import EditableImageCard from "../components/EditableImageCard";
import { SERVER_ENDPOINT } from "../utilities/Structures";
import FilterBar from "../components/FilterBar";

export default class Verify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
        };
    }

    async getImagesFromDB() {
        let images = await fetch(`${SERVER_ENDPOINT}/image?verified=true`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
        if (images !== undefined) {
            this.setState({images: images});
        }
    }

    componentDidMount() {
        this.getImagesFromDB();
        console.log(this.state.images);
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
                                        <EditableImageCard
                                            image={image}
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