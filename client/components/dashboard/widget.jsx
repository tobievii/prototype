import React, { Component } from "react";

export class OptionsInput extends React.Component {

  state = {
  }

  changeValue(e) {
    console.log("onchange!")
  }

  noDrag(e) {
    console.log("no drag!")
    //e.preventDefault(); e.stopPropagation()
  }

  render() {
    return (<div className="widgetMenuItem" onDrag={this.noDrag}
      onDragStart={this.noDrag} >
      {this.props.option.name}:
      <input type="value" defaultValue={this.props.option.value}
        onDrag={this.noDrag}
        onDragStart={this.noDrag}
        onSelect={evt => { console.log(evt) }}
        onChange={(evt) => this.changeValue(evt)}  ></input>
    </div>)
  }
}

export class Widget extends React.Component {

  state = {
    menuVisible: false,
    boundaryVisible: false
  }



  removeWidget = () => {
    if (this.props.remove) { this.props.remove() }
  }

  optionsPanel = () => {
    // console.log(this.props.children)
    // if (this.props.children.props.options) {
    //   console.log(this.props.children.props.options())
    // }
    if (this.state.options) {
      return (<div>{this.state.options.map((option, i) => {

        if (option.type == "input") {
          return (<OptionsInput key={i} option={option} />)
        }

        return (<div key={i}></div>)

      })}</div>)
    } else {
      return (<div className="widgetMenuItem">Widget has no options.</div>)
    }

  }

  menu() {
    if (this.state.menuVisible) {
      return (<div className="widgetMenu" style={{
        position: "absolute",
        zIndex: 100,
        width: 200,
        fontSize: 14
      }} >
        <div className="widgetMenuItem widgetMenuItemButton" onClick={this.removeWidget} >
          <i className="fas fa-trash-alt"></i> REMOVE</div>

        <div className="widgetMenuItem" >Change Type:
          <select onChange={(e) => {
            // console.log(e.target.value);
            this.props.change("type", e.target.value)
          }}>
            <option unselectable="true">select</option>
            <option>Calendar</option>
            <option>NivoLine</option>
            <option>ChartLine</option>
            <option>Blank</option>
            <option>ThreeDWidget</option>
            <option>Gauge</option>
            <option>map</option>
            <option>button</option>
          </select></div>

        {this.optionsPanel()}
      </div>)
    } else {
      return null;
    }
  }

  showMenu = () => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.menuVisible) {
        this.setState({ menuVisible: false })
      } else {
        this.setState({ menuVisible: true })
      }
    }
  }

  onDrag = () => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  showBoundary = () => {
    if (this.state.boundaryVisible == false) {
      this.props.showBoundary(true);
      this.setState({ boundaryVisible: true })
    } else if (this.state.boundaryVisible == true) {
      this.props.showBoundary(false);
      this.setState({ boundaryVisible: false })
    }
  }

  mapWidget = () => {
    var p = this.props.children.type;
    var color = "";

    if (this.props.children.type.name == "MapDevices") {
      if (this.state.boundaryVisible == true) {
        color = "white";
      } else {
        color = "grey";
      }
      return (
        <div className="widgetOptionsButton" style={{ padding: "4px 6px 4px 6px", color: color }} ><i className="fas fa-route" title="Show Boundary" onClick={this.showBoundary}></i></div>
      )
    } else {
      return;
    }
  }

  getWidgetOptions = (options) => {
    this.setState({ options })
  }

  render = () => {
    if (this.props.children) {
      var children = this.props.children;

      var childrenWithProps = React.Children.map(children, (child) => {
        return React.cloneElement(child, { getWidgetOptions: this.getWidgetOptions })
      })

      return (
        < div style={{ overflow: "hidden" }
        } style={{ height: "100%", position: "relative", paddingTop: 30 }}>
          <div className="widgetLabel" style={{ position: "absolute", top: 0, width: "100%" }}>

            <div style={{ float: "left", padding: "5px" }}>{this.props.label} </div>

            <div className="widgetOptions" style={{ float: "right" }}>
              <div className="widgetOptionsButton" style={{ padding: "4px 6px 4px 6px" }} ><i className="fas fa-wrench" onDrag={this.onDrag()} onClick={this.showMenu()}></i></div>
              {this.menu()}
            </div>

            <div className="widgetOptions" style={{ float: "right" }}>
              {this.mapWidget()}
            </div>

          </div>

          <div className="widgetContents" style={{ height: "100%" }}>
            {/* {this.props.children} */}
            {childrenWithProps}
          </div>

          <div style={{ clear: "both" }}></div>
        </div >
      )
    } else {
      return (<div>loading..</div>)
    }


  }

}