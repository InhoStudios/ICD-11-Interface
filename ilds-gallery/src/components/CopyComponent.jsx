import React from "react";

export default class CopyComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            copy_id: ''
        };
    }

    componentDidMount() {
        let new_copy_id = Math.round(Math.random() * 25565).toString(16);
        this.setState({
            copy_id: new_copy_id
        });
    }

    async copyText(e) {
        e.preventDefault();
        console.log(e.target.value);
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(e.target.value);
        } else {
            // Use the 'out of viewport hidden text area' trick
            const textArea = document.createElement("textarea");
            textArea.value = e.target.value;
                
            // Move textarea out of the viewport so it's not visible
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";
                
            document.body.prepend(textArea);
            textArea.select();
    
            try {
                document.execCommand('copy');
            } catch (error) {
                console.error(error);
            } finally {
                textArea.remove();
            }
        }
        let tooltip = document.getElementById(this.state.copy_id);
        tooltip.innerHTML = "Copied: " + e.target.value;
    }

    navigateOut() {
        var tooltip = document.getElementById(this.state.copy_id);
        tooltip.innerHTML = "Copy to clipboard";
    }

    render() {
        return (
            <div className="copy-tooltip">
                <input 
                    type="text" 
                    className="mx-2 form-control-sm copy-tooltip-button" 
                    value={this.props.value} 
                    onClick={this.copyText.bind(this)}
                    onMouseLeave={this.navigateOut.bind(this)}
                    readOnly
                />
                <span class="tooltiptext" id={this.state.copy_id}>Copy to clipboard</span>
            </div>
        )
    }
}