import React, { Component } from "react";
import moment from 'moment'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortNumericDown, faSortAlphaDown, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'


library.add(faSort)
library.add(faSortNumericDown);
library.add(faSortAlphaDown);
library.add(faSortAmountDown);

class StatesViewerItem extends Component {
  state = {
    timeago: "",
    timestamp: "",
    millisago : 0,
    deleted : false
  };

  intvalM = undefined;
  intvalT = undefined;

  



  componentWillUnmount = () => {

    clearInterval(this.intvalM)
    clearInterval(this.intvalT)
  }

  updateTime = () => {
    if (this.props.timestamp) {
      var timeago = moment(this.props.timestamp).fromNow()
      this.setState({ timeago })
    }
  }

  updateMillis = () => {
    // if (this.props.timestamp) {
    //   var lastChange = new Date(this.props.timestamp);     
    //   this.setState({ millisago : Date.now() - lastChange.getTime() })    
    // }
  }

  constructor(props) {
    super(props);

    this.intvalT = setInterval(() => {
      this.updateTime();
    }, 1000/60)

    this.intvalM = setInterval(()=>{
      this.updateMillis();
    },1000/60);
  }

  blendrgba(x,y,ratio) {

    if (ratio <= 0) {
      return "rgba("+Math.round(x.r)+","+Math.round(x.g)+","+Math.round(x.b)+","+x.a+")"
    } else if (ratio >= 1) {
      return "rgba("+Math.round(y.r)+","+Math.round(y.g)+","+Math.round(y.b)+","+y.a+")"
    } else {
      var blended = {
        r : (x.r*(1-ratio)) + (y.r*ratio),
        g : (x.g*(1-ratio)) + (y.g*ratio),
        b : (x.b*(1-ratio)) + (y.b*ratio),
        a : (x.a*(1-ratio)) + (y.a*ratio),
      }
      return "rgba("+Math.round(blended.r)+","+Math.round(blended.g)+","+Math.round(blended.b)+","+blended.a+")"
    }
    
    //return "rgba(255,255,255,1)"
  }


  calcStyle = () => {
    var timefade = 3000;

    var lastChange = new Date(this.props.timestamp);     
    var millisago = Date.now() - lastChange.getTime();    
    var ratio = (timefade-millisago)/timefade;

    //var ratio = (timefade-this.state.millisago)/timefade;
    if (ratio < 0) { ratio = 0 }
    if (ratio > 1) { ratio = 1 }
        
    return { marginBottom: 2, padding: "7px 0px 7px 0px", 
      backgroundImage: "linear-gradient(to right, rgba(3, 4, 5, 0.5),"+this.blendrgba({r:3, g:4, b:5, a:0.5}, {r:125, g:255, b:175, a: 0.75}, (ratio/1.5) - 0.35)+")",
      borderRight: "5px solid "+this.blendrgba( {r:60, g:19, b:25, a:0}, {r:125, g:255, b:175, a: 1.0}, ratio) }    
  }

  descIfExists = () => {
    if (this.props.item.desc) {
      return <span style={{ color: "rgba(125,255,175,0.5)"}}>{this.props.item.desc}</span>
    } else {
      return <span></span>
    }
  }

  clickDelete = (id) => {
    return (event) => {
      fetch("/api/v3/state/delete", {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
      }).then(response => response.json()).then(serverresponse => { 
        console.log(serverresponse);
        this.setState({deleted : true})
      }).catch(err => console.error(err.toString()));
    }    
  }

  goToDevice = (id) => {
    return (e) => {
      window.location = '/view/'+ id ;
    }
  }

  render() {

    if (this.state.deleted == true) {
      return ( <div style={{display:"none"}}></div>);
    } else {
      var dataPreview = JSON.stringify(this.props.data)
      var maxlength = 120;
      if (dataPreview.length > maxlength) { dataPreview = dataPreview.slice(0, maxlength) + "..." }
  
      return (
        
          <div className="row statesViewerItem" 
            key={this.props._id} 
            style={ this.calcStyle() }>
  
              
                <div className="col-7 statesViewerDeviceLink" style={{ overflow: "hidden" }} onClick={this.goToDevice(this.props.id)} >{this.props.id} {this.descIfExists() }<br />
                  <span className="faded" style={{ fontSize: 12 }} >{dataPreview}</span>
                </div>
                
                <div className="col-4" style={{textAlign:"right"}} >
                  <span style={{ fontSize: 12 }}>{ this.state.timeago}</span><br />
                  <span className="faded" style={{ fontSize: 12 }}>{ this.props.timestamp}</span>
                </div>
              
  
              <div className="col-1" style={{textAlign:"right"}}>
                <div onClick={ this.clickDelete(this.props.id) } >DELETE X</div>
              </div>
  
          </div>
        
      );
    }


  }
}



export class Pagination extends Component {

  onClick = (button) => {
    return evt => {
      
      this.props.onPageChange(button)
    }
  }

  calcClass = (button) => {
    if (button.active) {
      return "pagination paginationActive"
    } else {
      return "pagination"
    }
    
  }

  render() {
    if (this.props.pages.length > 1) {
      return (<div>
        {
          this.props.pages.map( (button, i) =>  <div key={i} onClick={this.onClick(button)} className={this.calcClass(button)} >{button.text}</div> )
        }
      </div>)
    } else {
      return ( <div></div>)
    }
    
    
  }
}


export class DeviceList extends Component {

  state = {
    activePage: 1
  }

  onPageChange = (data) => {
    console.log(data);
    this.setState( { activePage: data.text })
  }

  render() {
    var pagesNum = Math.ceil(this.props.devices.length / this.props.max);

    
    //if (pagesNum < this.state.activePage) { this.setState({activePage : 1 })}
    
    
    

    var pages = [];
    for (var a = 1; a <= pagesNum; a++) { 
      pages.push({text:a, active: (this.state.activePage == a) }); 
    }


    if (this.props.devices.length == 0) {
      return (
        <div className="row " style={{opacity:0.5}}>
          <div className="col-12" style={{ padding: "0 5px 0 5px" }}>
              <div className="commanderBgPanel" style={{ margin: 0}}>
                <center>No devices to display.</center>
              </div>            
          </div>          
        </div>
      )
    } else {

      var devicelist = _.clone(this.props.devices);

      if (this.props.max) {
        var start = this.props.max * (this.state.activePage-1)
        var end = this.props.max * this.state.activePage
        devicelist = devicelist.slice(start,end);
      }

      if (devicelist.length == 0) {
        if (this.state.activePage != 1) {
          this.setState({activePage : 1})
        }        
      }

      return ( 
          <div>
             { devicelist.map(item => <StatesViewerItem key={item.id} id={item.id} data={item.data} timestamp={item.timestamp} item={item} />)  }

             <div style={{marginLeft:-9}}> <Pagination pages={pages} className="row" onPageChange={this.onPageChange} /> </div>
          </div>
        )
    }
  }
}

export class StatesViewer extends Component {
  state = { search: "", sort: "" };

  search = evt => {
    this.setState({ search: evt.target.value })
  }

  sort = property => {
    return (evt) => {
      console.log(property);

      if (this.state.sort == "") {
        this.setState({sort:"timedesc"});
        return;
      }

      if (this.state.sort == "timedesc") {
        this.setState({sort:"namedesc"});
        return;
      }
      
      if (this.state.sort == "namedesc") {
        this.setState({sort:""});
        return;
      }

    }
  }

  sortButtons = () => {
    if (this.state.sort == "") { return <FontAwesomeIcon icon="sort-amount-down" /> } 
    if (this.state.sort == "timedesc") { return <FontAwesomeIcon icon="sort-numeric-down" /> }    
    if (this.state.sort == "namedesc") { return <FontAwesomeIcon icon="sort-alpha-down" /> }    
  }

  render() {
    var deviceStates = []

    

      for (var device of this.props.states) {
        if (this.state.search.length > 0) {
          if (device.id.includes(this.state.search)) {
            deviceStates.push(device)
          }
        } else {
          deviceStates.push(device)
        }
      } 

    

      if (this.state.sort == "timedesc") {
        deviceStates.sort( (a,b) => {          
          if (new Date(a.timestamp) > new Date(b.timestamp)) {
            return 1 } else {
              return -1
            }
          
        }).reverse();
      }
      if (this.state.sort == "namedesc") {
        deviceStates.sort( (a,b) => {
          if (a.id >= b.id ) {
            return 1 } else { return -1 }
        })
      }

      if (this.state.sort == "") {
        deviceStates.reverse();
      }

    
    

    return (
      <div className="" style={{ paddingTop: 25, margin: 30 }} >

        

        <div className="row">
          <div className="d-none d-md-block col-md-6" >
            <form id="search" style={{ textAlign: "left", marginLeft:-8, marginBottom: 10 }}>
              <input name="query" onChange={this.search} placeholder="filter"  />
            </form>
          </div>

          <div className="d-none d-md-block col-md-6" style={{ textAlign: "right" }} >
            <span className="headerClickable" onClick={this.sort("timestamp")}> 
              { this.sortButtons() }
            </span>
          </div>
        </div>

        <DeviceList devices={deviceStates} max={15} />


      </div>

    )
    // } else {
    //   return (
    //     <div className="container" style={{ paddingTop: 25 }} >
    //       <div className="row">            
    //         <div className="col-sm-12"> 
    //           <form id="search" style={{ paddingBottom: 10 , textAlign: "right" }}>
    //             Search <input name="query" onChange={this.search}/>
    //           </form> 
    //         </div>
    //         <div className="col-sm-12" style={{ textAlign: "center"}}> 
    //           <div>No devices yet.</div>
    //         </div>
    //       </div>
    //     </div>
    //   )
    // }
  }
}
