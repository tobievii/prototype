import React, { Component } from "react";
const ReactMarkdown = require('react-markdown')
import { CodeBlock } from "./code-block.jsx"

export const name = "hf2111a"

export class SettingsPanel extends React.Component {

  state = {
    port: undefined,
    info: {},
    readme: ""
  }

  componentWillMount = () => {

    // get readme.md and set it to state
    fetch("/plugins/hf2111a/readme.md")
      .then(res => res.text())
      .then(readme => this.setState({ readme }))

    // get readme.md and set it to state
    fetch("/api/v3/plugins/hf2111a/info")
      .then(res => res.json())
      .then(info => this.setState({ info }))

    //this.updateFromServer();

  }

  runTest() {
    return (e) => {
      // console.log("test")

      fetch("/api/v3/plugins/hf2111a/test")
        .then(res => res.json())
        .then(test => this.setState({ test }))
    }
  }


  render() {
    const input = '# This is a header\n\nAnd this is a paragraph'

    return (
      <div className="blockstyle">
        <h4>{name}</h4>

        <div style={{ background: "#333" }}>
          <button onClick={this.runTest()} style={{ float: "right" }}>test</button>
          <div>{JSON.stringify(this.state.test)}</div>
          <div style={{ clear: "both" }}></div>
        </div>


        PORT: {this.state.info.port}

        <ReactMarkdown source={this.state.readme} renderers={{ code: CodeBlock }} />
      </div>
    );
  }
}
