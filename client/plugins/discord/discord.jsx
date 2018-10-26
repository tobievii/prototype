import React, { Component } from "react";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd } from '@fortawesome/free-solid-svg-icons'
library.add(faHdd)
import { gridstyle, cellstyle, gridHeadingStyle, blockstyle, formRowStyle, formLabelStyle, formInputStyle} from "../../styles.jsx"

export const name = "Discord";

export class SettingsPanel extends React.Component {
  state = { form : { token: "", channelId: ""} };

  changeInput = (name) => {
    return (evt) => {
        var form = { ...this.state.form }
        form[name] = evt.target.value
        this.setState({ form })
    }
}



saveBot = () => {
  console.log(this.state.form);
  fetch('/api/v3/discord/savebot', {
      method: 'POST',
      headers: {'Accept': 'application/json','Content-Type': 'application/json'},
      body: JSON.stringify(this.state.form)
  }).then(response => response.json()).then((data) => {
      console.log(data);
       //if (this.props.update) { this.props.update(); }
  }).catch(err => console.error(err.toString()))

}


  render() {
    return (
      <div style={blockstyle}>
        <h4>DISCORD</h4>


                <div className="row" style={formRowStyle} >
                    <div className="col-4" style={formLabelStyle} >
                        Token:
                    </div>
                    <div className="col-8" style={formInputStyle}>
                        <input
                            style={{ width: "100%" }}
                            placeholder={this.state.form.token}
                            onChange={this.changeInput("token")}
                            autoFocus={true}
                        />
                    </div>
                </div>

                <div className="row" style={formRowStyle} >
                    <div className="col-4" style={formLabelStyle} >
                        ChannelId:
              </div>
                    <div className="col-8" style={formInputStyle}>
                        <input
                            style={{ width: "100%" }}
                            value={this.state.form.channelId}
                            onChange={this.changeInput("channelId")}
                        />
                    </div>
                </div>

                <div className="row" style={formRowStyle} >
                        <div className="col-4" style={formLabelStyle} ></div>
                        <div className="col-8" style={formInputStyle}>
                        
                        <div className="commanderBgPanel commanderBgPanelClickable"
                            style={{ width: 160}}
                            onClick={this.saveBot}>
                            <FontAwesomeIcon icon="hdd" /> SAVE BOT</div>
                        
                        </div>
                </div>


      </div>
    );
  }
}
