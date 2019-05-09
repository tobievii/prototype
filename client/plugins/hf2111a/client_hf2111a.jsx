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




  render() {
    const input = '# This is a header\n\nAnd this is a paragraph'

    return (
      <div className="blockstyle">
        <h4>{name}</h4>

        PORT: {this.state.info.port}

        <ReactMarkdown source={this.state.readme} renderers={{ code: CodeBlock }} />
      </div>
    );
  }
}
