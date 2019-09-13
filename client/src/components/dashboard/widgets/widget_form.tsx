import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"

import { api } from "../../../api"

import Form from "react-jsonschema-form";

export default class WidgetForm extends WidgetComponent {
    state = {
        options: {
            color: { type: "color", default: "#ffffff", value: undefined },
            schema: {
                type: "json", default: JSON.stringify({
                    title: "Todo",
                    type: "object",
                    required: ["title"],
                    properties: {
                        title: { type: "string", title: "Title", default: "A new task" },
                        done: { type: "boolean", title: "Done?", default: false }
                    }
                }, null, 2), value: undefined
            },
            uischema: { type: "json", default: JSON.stringify({}), value: undefined }
        },
        formData: {},
        buttonText: "SEND",
        error: ""
    }

    onChange = (data) => {
        this.setState({ formData: data.formData })
    }

    onSubmit = () => {
        //var data = JSON.parse(this.state.formData);

        api.post({ key: this.props.state.key, data: { form: this.state.formData } })
    }

    onError(error) {
        console.log(error)
        //api.post({})
    }

    render() {

        var schema = {}
        var uischema = {}

        var error = ""

        // try {
        //     schema = JSON.parse(this.state.options.schema.value)
        //     uischema = JSON.parse(this.state.options.uischema.value)
        // } catch (err) { 
        //     error = err            
        // }

        var errSchema = ""
        try {
            schema = JSON.parse(this.state.options.schema.value)
        } catch (err) {
            console.log(err);
            errSchema = err.toString();
            schema = {}
        }

        var erruischema = ""
        try {
            uischema = JSON.parse(this.state.options.uischema.value)
        } catch (err) {
            console.log(err);
            erruischema = err.toString();
            uischema = {}
        }

        return (
            <div style={{ color: this.state.options.color.value, wordBreak: "break-all" }}>

                <span>{errSchema}</span>
                <span>{erruischema}</span>

                <Form schema={schema}
                    uiSchema={uischema}
                    formData={this.state.formData}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                    onError={this.onError} />
            </div>
        );
    }
};

