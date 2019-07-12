import React from "react";

export class OptionsRadio extends React.Component {
    state = { value: this.props.option.value }
    update = undefined;
    constructor(props) {
        super(props)
        this.update = this.props.option.value;
    }

    apply() {
        var option = this.props.option;
        option["value"] = this.state.value;
        this.props.setOptions(option)
    }

    componentDidUpdate() {
        if (this.props.option.value != this.update) {
            this.update = this.props.option.value;
            this.setState({ value: this.props.option.value })
        }
    }

    onChange = (event) => {
        this.setState({ value: !this.state.value }, () => { this.update = this.state.value; this.apply(); })
    }

    render() {
        return (
            <div className="widgetMenuItem">
                <div className="row">
                    <div className="col-4">
                        {this.props.option.name}:
                    </div>
                    <div className="col-8">
                        <input
                            style={{ width: "100%" }}
                            type="radio"
                            value={this.state.value}
                            name={"zoomable"}
                            onChange={this.onChange}
                            checked={this.update}
                        />
                    </div>
                </div>
            </div>
        )
    }
}