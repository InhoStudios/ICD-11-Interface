import React from "react";

export default class SearchList extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            options: this.props.options,
        };
    }

    render() {
        return (
            <div className="col-lg-6 dropdown">
                <label htmlFor="sitetext">
                    Anatomic Site
                </label>
                <input type="input" className="form-control form-control-lg" 
                    id="sitetext" placeholder="Choose Anatomic Site ↓"
                    value={this.state.anatomic}
                    onChange={this.handleSiteSearchUpdate.bind(this)}
                    onFocus={(e) => {
                        e.preventDefault();
                        document.querySelectorAll(".asites").forEach(a => a.style.display = "block");
                    }}
                    onBlur={(e) => {
                        e.preventDefault();
                        document.querySelectorAll(".asites").forEach(a => a.style.display = "none");
                    }}
                />
                <div className="search-content asites">
                    {
                        this.state.options.map((option) => (
                            <a 
                                className="asite-element" 
                                id={`ICDST${site.index}`} 
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    this.handleUpdateSite(site);
                                }}>
                                {site.site}
                            </a>
                        ))
                    }
                </div>
            </div>
        )
    }

}