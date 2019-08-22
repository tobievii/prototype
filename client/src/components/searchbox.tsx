import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'

import "../prototype.scss"

import { api } from "../api"
import { emit } from "cluster";
import { theme, colors } from "../theme";

interface MyProps {
}

interface MyState {
    searchtext: string;
    result: any[];
    //[index: string]: any
}

export class SearchBox extends React.Component<MyProps, MyState> {

    state = {
        searchtext: "",
        result: []
    }

    onChange = (e) => {
        console.log(e.target.value)
        var searchtext = e.target.value
        this.setState({ searchtext }, () => { })
    }

    onKeyPress = (event) => {
        if (event.key === "Enter") {
            console.log("searching...")
            api.search({ searchtext: this.state.searchtext }, (err, result) => {
                if (err) console.log(err);
                if (result) { console.log(result); this.setState({ result }) }
            })
        }
    }

    render() {
        return (
            <div style={{ float: "left", padding: "5px 5px 5px 15px", position: "relative" }}>
                <i className="fas fa-search" style={{ opacity: 0.5, paddingRight: "10px" }} ></i>
                <input
                    style={{ zIndex: 100 }}
                    type="text"
                    placeholder="Search for user"
                    onKeyPress={this.onKeyPress}
                    onChange={this.onChange}
                    value={this.state.searchtext} />

                {(this.state.result.length > 0) ? <div> <div style={{
                    left: "40px",
                    width: "300px",
                    position: "absolute",
                    maxHeight: "400px",
                    overflowY: "scroll",
                    overflowX: "hidden",
                    zIndex: 200,
                    background: colors.panels,
                    border: colors.borders
                }}>
                    {this.state.result.map((user, i) => {
                        return <div
                            key={i}
                            style={{ padding: "5px", borderBottom: "1px solid #333" }}>
                            <a href={"/u/" + user.username} >{user.username}</a>
                        </div>
                    })}
                </div>

                    <div style={{
                        zIndex: 100,
                        width: "100%",
                        height: "100%",
                        background: "none",
                        position: "fixed",
                        top: 0, left: 0
                    }} onClick={() => { this.setState({ searchtext: "", result: [] }) }} />

                </div> : <div></div>}


            </div>
        );
    }
}

