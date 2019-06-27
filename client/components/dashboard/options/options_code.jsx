import React, { Component } from "react";

import MonacoEditor from "react-monaco-editor";

export class OptionsCode extends React.Component {

  state = {
    unsavedChanges: false
  }


  constructor(props) {
    super(props)
    this.state = { value: this.props.option.value }
    this.onChange = this.onChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  apply() {
    // console.log("code apply this.state.value")
    // console.log(this.state.value);
    var option = {}
    option[this.props.option.name] = this.state.value;

    this.props.setOptions(option, (err, result) => {

      if (err) { console.log(err); }
      if (result) {
        // console.log(result);
        this.setState({ unsavedChanges: false })
      }

    })

  }

  // onKeyPress = (e) => {
  //   console.log("code changed..")
  //   this.apply();
  // }

  editorDidMount(editor, monaco) {
    fetch("/themes/prototyp3.json")
      .then(data => data.json())
      .then(data => {
        monaco.editor.defineTheme("prototyp3", data);
        monaco.editor.setTheme("prototyp3");
      });

    editor.focus();
  }



  onChange(newValue, e) {
    this.setState({ value: newValue, unsavedChanges: true }, () => {

    });
  }

  onSet() {
    return (e) => {
      this.apply();
    }
  }

  boolMessage(a, b, c) {
    if (this.state[a]) {
      return <span>{b}</span>
    } else {
      return <span>{c}</span>
    }

  }

  render() {

    const options = {
      selectOnLineNumbers: false,
      minimap: { enabled: false },
      lineNumbers: 'off',
      glyphMargin: false,
      folding: false,
      // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0
    };

    return (<div className="widgetMenuItem" onDrag={this.noDrag}
      onDragStart={this.noDrag} >


      <div>
        <div style={{ float: "left", padding: "7px 7px 7px 0px" }}>{this.props.option.name}:</div>
        <div style={{ float: "right" }}>
          <button onClick={this.onSet()} style={{ float: "right" }}>save</button></div>
        <div style={{ padding: 7, float: "right" }}>
          {
            this.boolMessage("unsavedChanges", "unsaved changes", "")
          }
        </div>
        <div style={{ clear: "both" }} />
      </div>


      <MonacoEditor
        width="400"
        height="125"
        language="json"
        theme="vs-dark"
        value={this.state.value}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />

    </div>)
  }
}