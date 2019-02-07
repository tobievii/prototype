import React, { Component } from "react";
import ReactDOM from 'react-dom'
import App from '../App.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export class Recovery extends Component {
  render() {

    return ( 

    <div className="bgpanel" ><center><h4>Reset Password</h4>
        
            
             <div className="col-5" style={{textAlign:"right", paddingTop: 10,paddingRight:160}} >Enter new password: <input type="password" placeholder="new password" style={{ width: "60%",marginBottom: 5 }} spellCheck="false" autoFocus /><br></br>
            Confirm password: <input type="password" placeholder="confirm password" style={{ width: "60%",marginBottom: 5 }} spellCheck="false"/>  </div> 
            <div className="col-5">
            <center>
        <button className="btn-spot" style={{ float: "center" }} onClick={this.register} >CHANGE Password</button></center>
         </div>
             </center>
    </div>
    )
 
  }
}