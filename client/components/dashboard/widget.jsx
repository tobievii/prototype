import React, { Component } from "react";

export class Widget extends React.Component {

  
    render() {
      return (
        <div style={{overflow:"hidden"}}>
            <div className="widgetLabel">
                {this.props.label}
            </div>

            <div className="widgetContents">
                {this.props.children }
            </div>
            
            <div style={{clear:"both"}}></div>
        </div>
      )
    }
  
  }