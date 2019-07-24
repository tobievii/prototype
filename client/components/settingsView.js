import React, { Component } from "react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave } from '@fortawesome/free-solid-svg-icons'
library.add(faSave)
import Media from "react-media";
import { plugins } from "../plugins/config.ts"
import { Swipeable } from 'react-swipeable'

export default class SettingsView extends React.Component {
  state = { menuList: [] }

  componentDidMount = () => {
    this.getAccount();
  }

  getAccount = () => {
    fetch("/api/v3/account").then(res => res.json()).then(user => {
      if (user.settingsMenuTab) {
        this.setState({ activeMenu: user.settingsMenuTab })
      } else {
        this.setState({ activeMenu: 0 })
      }
    }).catch(err => console.error(err.toString()))
  }

  onClickMenuTab = function (num) {
    return (event) => {
      var activeMenu = num;
      this.setState({ activeMenu })

      fetch("/api/v3/account/update", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "settingsMenuTab": num })
      }).then(response => {
        response.json()
      }).then(data => {

      }).catch(err => console.error(err.toString()));
    }
  }

  getMenuClasses = function (num) {
    if (num == this.state.activeMenu) {
      return "settingsButton settingsButtonActive settingsMenu"
    } else {
      return "settingsButton settingsButtonInActive settingsMenu"
    }
  }

  genPage = () => {
    if (this.state.activeMenu !== undefined) {
      if (plugins[this.state.activeMenu]) {
        var SettingsPanel = plugins[this.state.activeMenu].SettingsPanel
        return <SettingsPanel {...this.props} updateAccount={this.props.updateAccount} />
      } else {
        //default to 0 
        this.setState({ activeMenu: 0 })
      }
    } else {
      return <div>none</div>
    }
  }

  genMenu = () => {
    return (
      <div id="settingsMenu" style={{ padding: 20, overflowX: "auto" }}>
        {
          plugins.map((item, i) => {
            return <div key={i} className={this.getMenuClasses(i)} onClick={this.onClickMenuTab(i)}>{item.name}</div>
          })
        }
      </div>
    )
  }

  render() {
    return (
      <div className="settingsPage" style={{ background: "rgba(0,0,0,0.2)", margin: 20, marginTop: 30, overflow: "hidden" }}>
        <Media query="(max-width: 599px)">
          {matches =>
            matches ? (
              <div>
                <div className="row">
                  <div className="col" style={{ background: "rgba(0,0,0,0.2)", padding: 20 }} >
                    {this.genMenu()}
                  </div>
                </div>
                <Swipeable
                  onSwipedLeft={() => { if (this.state.activeMenu > 0) { this.setState({ activeMenu: this.state.activeMenu - 1 }) } }}
                  onSwipedRight={() => { if (this.state.activeMenu < plugins.length) { this.setState({ activeMenu: this.state.activeMenu + 1 }) } }}>
                  <div className="row" style={{ marginTop: 5 }}>
                    <div className="col" style={{ display: "", padding: "0 20px 0 20px", boxSizing: "border-box" }}>
                      {this.genPage()}
                    </div>
                  </div>
                </Swipeable>
              </div>
            ) : (
                <div className="row">
                  <div className="col-2" style={{ background: "rgba(0,0,0,0.2)", padding: 20 }} >
                    {this.genMenu()}
                  </div>

                  <div className="col-10" style={{ display: "", padding: "0 20px 0 20px", boxSizing: "border-box" }}>
                    {this.genPage()}
                  </div>
                </div>
              )
          }
        </Media>
      </div>
    )
  }
}
