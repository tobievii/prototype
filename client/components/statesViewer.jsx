import React, { Component } from "react";
import moment from 'moment'

class StatesViewerItem extends Component {
  state = { 
    timeago : "",
    timestamp : ""
  };

  componentDidMount() {
    this.updateTime();
  }

  updateTime = () => {
    if (this.props.timestamp) {
      var timeago = moment(this.props.timestamp).fromNow()
      this.setState({timeago})
    }
    
  }

  constructor (props) {
    super(props);
    setInterval( () => {
      this.updateTime();
    },500)
    
  }

  render() {

    var dataPreview = JSON.stringify(this.props.data)

    var maxlength = 40;
    if (dataPreview.length > 40) { dataPreview = dataPreview.slice(0, maxlength) + "..." }

    return (
      <a className="statesViewerItem" href={"/view/" + this.props.id}>
        <div className="row commanderBgPanel commanderBgPanelClickable" key={this.props.id}>
          <div className="col-md-3">{this.props.id}</div>
          <div className="d-none d-md-block col-md-5">{dataPreview}</div>
          <div className="col-md-4 faded" style={{ textAlign: "right" }}>  { this.state.timeago } </div>
        </div>
      </a>
    );
  }
}

export class StatesViewer extends Component {
  state = {};


  render() {
    if (this.props.states.length > 0) {
      return (
        <div className="container" style={{ paddingTop: 25 }} >
        
          <div className="row">
            
            <div className="col-sm-12"> 
              {/* <form id="search" style={{ paddingBottom: 10 , textAlign: "right" }}>
                Search <input name="query" />
              </form> */}
            </div>
          </div>
  
          <div className="row">
            <div className="d-none d-md-block col-md-3"><h6>ID</h6></div>
            <div className="d-none d-md-block col-md-5"><h6>DATA</h6></div>
            <div className="d-none d-md-block col-md-4" style={{ textAlign: "right" }}>timestamp</div>
          </div>
  
          {this.props.states.map(item => <StatesViewerItem key={item.id} id={item.id} data={item.data} timestamp={item.timestamp} />)}
  
        </div>
  
      )
    } else {
      return (
        <div className="container" style={{ paddingTop: 25 }} >
          <div className="row">            
            <div className="col-sm-12" style={{ textAlign: "center"}}> 
              <div>No devices yet.</div>
            </div>
          </div>
        </div>
      )
    }
  }
}
