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

  state = {
    dragging: false
  }

  dragging = false;

  renderData = (data, level, path) => {

    if (data == null) { }
    if (typeof data == "string") {
      return <span style={{ color: "rgb(212, 191, 128)" }}>{data.trim()}</span>
    }
    if (typeof data == "number") {
      return <span style={{ color: "rgb(128, 212, 136)" }}>{data}</span>
    }
    if (typeof data == "boolean") {
      return <span style={{ color: "#FF1493" }}>{data.toString()}</span>
    }
    if (typeof data == "object") {


      if (Array.isArray(data)) {
        //Arrays
        return <div style={{}}>{this.renderObject(data, level + 1, path)}</div>
      } else {
        //Objects

        if (Object.keys(data).length > 1) {
          return <div style={{}}>{this.renderObject(data, level + 1, path)}</div>
        } else {
          return <div style={{}}>{this.renderObject(data, level + 1, path)}</div>
        }


      }

    }

  }

  renderObject = (data, level, path) => {

    var columns = 0;

    if (level > 0) {
      if (Object.keys(data).length > 1) {
        //columns = Math.round(12 / Object.keys(data).length);
        columns = 1;
      }
    }

    if (columns > 0) {
      return (
        <div style={{ overflowY: 'hidden' }}>
          {Object.keys(data).map((name, i) => {
            return (
              <div key={i} className="dataView" style={{ float: "left", padding: 10, boxSizing: "border-box" }} draggable onDragStart={(e) => this.onDragStart(e, name, i, data[name], level, path + "." + name)}  >
                <div className="dataViewName">{name}:</div>
                <div className="dataViewValue" >{this.renderData(data[name], level, path + "." + name)}</div>
                <div style={{ clear: "both" }} />
              </div>)
          })}
        </div>
      )
    } else {
      return (
        <div style={{ overflowY: 'hidden' }}>
          {Object.keys(data).map((name, i) => {
            return (
              <div key={i} className="dataView" draggable onDragStart={(e) => this.onDragStart(e, name, i, data[name], level, path + "." + name)}  >
                <div className="dataViewName">{name}:</div>
                <div className="dataViewValue" >{this.renderData(data[name], level, path + "." + name)}</div>
                <div style={{ clear: "both" }} />
              </div>)
          })}
        </div>
      )
    }


  }

  onDragStart = (e, name, i, data, level, path) => {



    if (this.dragging == false) {
      console.log({ e, name, i, data, level, path })
      this.dragging = true;

      e.dataname = name;
      e.datapath = path;

      setTimeout(() => {
        this.dragging = false;
      }, 500)

    } else {
      //console.log("already dragging")
    }

  }

  render() {
    if (this.props.data) {
      if (this.props.data.payload) {
        return (
          <div>
            {this.renderObject(this.props.data.payload, 0, "root")}
          </div>
        );
      } else {
        return (
          <div>
            {this.renderObject(this.props.data, 0, "root")}
          </div>
        );
      }
    } else {
      return (<div>loading..</div>)
    }

  }

}