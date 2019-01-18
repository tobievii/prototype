import React, { Component } from "react";

export class Widget extends React.Component {

  
    render() {
      return (
        <div style={{overflow:"hidden"}} style={{height:"100%"}}>
            {/* <div className="widgetLabel"> {this.props.label} </div> */}

            <div className="widgetContents" style={{height:"100%"}}>                
                {this.props.children } 
            </div>
            
            <div style={{clear:"both"}}></div>
        </div>
      )
    }
  
  }