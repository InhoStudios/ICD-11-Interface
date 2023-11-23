import React from "react";
import './css/App.css';
import './css/index.css';
import './css/bootstrap.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Upload from "./pages/Upload"
import Verify from "./pages/Verify";
import Timecode from "./pages/Timecode";
import TimecodeOnLoad from "./pages/TimecodeOnLoad";
export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home/>} />
                    <Route path="/" element={<Layout />}>
                        <Route path="submit" element={<Submit/>} />
                        <Route path="upload" element={<Upload/>} />
                        <Route path="verify" element={<Verify/>} />
                        <Route path="timecode" element={<Timecode/>} />
                        <Route path="timecode2" element={<TimecodeOnLoad/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

