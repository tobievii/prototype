import React, { Component } from "react";

import "../prototype.scss"


export class RenderObject extends Component {

  renderObject = (data) => {
    // return (
    //   <div className="dataView" >
    //     <div className="dataName"> {this.props.name} </div>
    //     {Object.keys(this.props.datain).map((name,i) => {
    //       return <RenderObject name={name} key={i} datain={this.props.datain[name]} />
    //     })}                  
    //   </div>
  }

  render() {

    // if (typeof this.props.datain == "object" ) {
    //   return this.renderObject(this.props.datain);
    // }

    // try {
    //   switch (typeof this.props.datain) {
    //     case "string":
    //       {
    //         return ( <div className="dataView" >{this.props.name}: {this.props.datain}</div>)
    //       }
    //       break;
    //     case "object":
    //       {
    //         return (
    //           <div className="dataView" >
    //             <div className="dataName"> {this.props.name} </div>
    //             {Object.keys(this.props.datain).map((name,i) => {
    //               return <RenderObject name={name} key={i} datain={this.props.datain[name]} />
    //             })}                  
    //           </div>
    //         );
    //       }
    //       break;
    //     default:
    //       {
    //         return ( <div className="dataView" >{this.props.name}: {JSON.stringify(this.props.datain)}</div> )
    //       }
    //   }
    // }  catch (err) {
    //   return ( <div>err</div>)
    // }
   
  }
}


export class DataView extends React.Component {

  renderData = (data) => {
    
    if (data == null) {}
    if (typeof data == "string") {
      return <span>{data}</span>
    }
    if (typeof data == "number") {
      return <span>{data}</span>
    }
    if (typeof data == "object") {
      return <div>{ this.renderObject(data)}</div>
    }

  }

  renderObject = (data) => {    
    try {
      return (
        <div>
          {Object.keys(data).map((name,i) => {
            return (
              <div key={i} className="dataView" draggable onDragStart={(e)=>this.onDragStart(e, name, i, data[name])}  >
                <div className="dataViewName">{name}:</div> 
                <div className="dataViewValue" >{this.renderData(data[name])}</div>
                <div style={{clear:"both"}}/>
              </div>)
          })}                  
        </div>
      )
    } catch(err) {}
  }

  onDragStart = (e, name, i, data) => {
    console.log( { e, name, i, data } )
  }

  render() {

      return (
        <div>
          { this.renderObject(this.props.data)}
        </div>
      );
    } 

}