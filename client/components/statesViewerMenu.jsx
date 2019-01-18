import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';

export class StatesViewerMenu extends Component {
    state = { selectAll : false, sort : ""}

    selectBox = () => {
        if (this.state.selectAll) {
            return ( <i className="fas fa-check-square" onClick={this.selectBoxClickHandler(false)} title="Deselect All" ></i> )
        } else {
            return ( <i className="far fa-square" onClick={this.selectBoxClickHandler(true)} title="Select All" ></i> )
        }
    }

    selectBoxClickHandler = (action) => {
        return (e) => {
            this.setState({selectAll:action})
            this.props.selectAll(action)
        }
    }

    sortButtons = () => {
        if (this.state.sort == "") { return <i className="fas fa-sort-amount-down" title="latest created top"  onClick={this.sortClickHandler("timedesc")} ></i> }
        if (this.state.sort == "timedesc") { return <i className="fas fa-sort-numeric-down" title="last seen top" onClick={this.sortClickHandler("namedesc")} ></i> }
        if (this.state.sort == "namedesc") { return <i className="fas fa-sort-alpha-down" title="alphabetical" onClick={this.sortClickHandler("")} ></i> }
    }

    sortClickHandler = ( action ) => {
        return (e) => {
            this.setState({sort:action})
            this.props.sort(action);
        }
    }

    menuDeleteButton = () => {
        if (this.props.selectCount > 0) {
            return (
                <div className="protoButton protoButtonClickable" style={{ float: "left", marginRight: 10 }} title={ this.props.selectCount + " selected."}
                onClick={() => this.clickDeleteConfirmation()}> <i className="fas fa-trash" /> DELETE</div>
            )
        } else {
            return (
                <div className="protoButton" style={{ float: "left", marginRight: 10, opacity: 0.3, cursor: "not-allowed" }} title="Select some devices first..."> <i className="fas fa-trash" /> DELETE</div>
            )
        }
        
    }

    clickDeleteConfirmation = () => {
        // confirmAlert({
        // title: 'Are you sure?',
        // message: 'Deleting a device is irreversible',
        // buttons: [
        //     {
        //     label: 'Yes',
        //     onClick: () => this.props.deleteSelected()
        //     },
        //     {
        //     label: 'No',
        //     onClick: () => { }
        //     }
        // ]
        // })
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='protoPopup'>
                  <h1>Are you sure?</h1>
                  <p>Deleting a device is irreversible</p>
                  <button onClick={onClose}>No</button>
                  
                  <button onClick={() => {
                      //this.handleClickDelete()
                      this.props.deleteSelected()
                      onClose()
                  }}>Yes, Delete it!</button>
                </div>
              )
            }
          })
    };

    dialog() {
        if (this.state.dialog) {
          return (
            <div className="container" style={{ color: "red" }}>
            </div>
          );
        }
    }

    render() {
        return (
            <div className="container-fluid protoMenu" style={{  }}>
                <div className="row" style={{ padding: 5 }} >
                    <div className="col" style={{ flex: "0 0 35px", padding: "10px 0 0 10px" }}>
                        {this.selectBox() }
                    </div>

                    <div className="col" style={{ flex: "0 0 300px", padding: 0 }}>
                        <form id="search" style={{ textAlign: "left" }} style={{width: "100%"}}>
                            <input name="query" onChange={this.props.search} placeholder="filter" style={{width: "100%"}} />
                        </form>                        
                    </div>

                    <div className="col" style={{ }}>
                        { this.menuDeleteButton() }
                        {/* { this.props.selectCount} */}
                    </div>

                    <div className="col" style={{ flex: "0 0 120px", textAlign: "right" }}>
                        { this.sortButtons() }
                    </div>
                </div>
            </div>
        )
    }
}
