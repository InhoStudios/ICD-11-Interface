import React from "react";
import ImageCard from "../components/ImageCard";
import { SERVER_ENDPOINT } from "../utilities/Structures";
import FilterBar from "../components/FilterBar";
import DownloadBar from "../components/DownloadBar";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
        };
    }

    async getImagesFromDB() {
        let images = await fetch(`${SERVER_ENDPOINT}/image`)
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
                <div className="container-fluid col-md-11">
                    <div className="row justify-content-left">
                        <div className="col-md-3 mb-2 text-left">
                            <div className="row justify-content-left mt-5 mb-3 text-left">
                                <h1>The Gallery</h1>
                                <p>Research and educational database of dermatology images. Built by <a href="https://github.com/InhoStudios/ICD-11-Interface">@InhoStudios</a>.</p>
                            </div>
                            <div className="row mt-3">
                                {/* <a className="btn" href="/quiz">
                                    <div className="card card-shadow text-left">
                                        <div className="card-body">
                                            <span>/quiz</span>
                                            <h4>Quiz</h4>
                                            <p>Take a dermatology quiz!</p>
                                        </div>
                                    </div>
                                </a> */}
                                <a className="btn" href="/submit">
                                    <div className="card card-shadow text-left">
                                        <div className="card-body">
                                            <span>/submit</span>
                                            <h4>Submit an image</h4>
                                            <p>Want to contribute to the dataset? Click here to upload your images!</p>
                                        </div>
                                    </div>
                                </a>
                                <a className="btn" href="/verify">
                                    <div className="card card-shadow text-left">
                                        <div className="card-body">
                                            <span>/verify</span>
                                            <h4>Verify submitted images</h4>
                                            <p>Verify the diagnoses and metadata on submitted images. Requires login.</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-9 mb-2 text-left">
                            <div className="row justify-content-center mt-5 text-center">
                                <h3>Verified Images</h3>
                            </div>
                            <FilterBar />
                            <div className="row mt-2">
                                {
                                    this.state.images.map((image) => (
                                        <ImageCard
                                            image={image}
                                            colsize={"col-lg-4"}/>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* <DownloadBar /> */}
            </section>
        );
    }
}