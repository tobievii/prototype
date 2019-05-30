import React, { Component } from 'react';
import { Widget } from "./widget.jsx"

import moment from 'moment'

require('moment-countdown');
export class WidgetScheduler extends React.Component {

  state = {
    command: JSON.stringify({ "foo": true }),
    description: "SCHEDULER",
    startTime: undefined,
    nextTime: undefined,
    repeatAmount: 10,
    repeatEvery: "second",
    repeatEveryOptions: ["second", "minute", "hour", "day", "week", "month", "year"],
    repeatEveryOptionsMS: {
      "second": 1000,
      "minute": 1000 * 60,
      "hour": 1000 * 60 * 60,
      "day": 1000 * 60 * 60 * 24,
      "week": 1000 * 60 * 60 * 24 * 7,
      "month": 1000 * 60 * 60 * 24 * 30,
      "year": 1000 * 60 * 60 * 24 * 365
    },
    enabled: false,
    options: []
  }

  updateParent = (update) => {
    this.props.dash.setOptions(update);
  }


  scheduler = () => {
    console.log("scheduler update")
    fetch("/api/v3/scheduler/widget", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ props: this.props, state: this.state })
    }).then(response => response.json()).then(resp => {
      // console.log(resp);
    }).catch(err => console.error(err.toString()));
  }

  setOptions = (options, cb) => {
    //this.setState(options);

    console.log("options set");

    this.setState(_.merge(this.state, options), () => {
      this.updatedOptions();
      this.scheduler(); // force scheduler update serverside
    })

    // update dash and server
    this.props.dash.setOptions(options, cb);
    //this.scheduler();
  }

  updatedOptions = () => {
    var options = [
      { name: "description", type: "input", value: this.state.description },
      { name: "startTime", type: "time", value: this.state.startTime },
      { name: "command", type: "code", value: this.state.command },
      { name: "repeatAmount", type: "input", value: this.state.repeatAmount },
      { name: "repeatEvery", type: "dropdown", value: this.state.repeatEvery, options: this.state.repeatEveryOptions },

    ]
    this.setState({ options });
  }

  componentDidMount() {
    if (this.props.data.options) {
      this.setState(_.merge(this.state, this.props.data.options), () => {
        this.updatedOptions();
        //this.setOptions();
      });
    } else {
      //defaults
      console.log("NEW COMPONENT");
      var update = {
        startTime: new Date(),
        repeatAmount: 5,
        repeatEvery: "second",
        command: JSON.stringify({ "foo": true }),
      }
      this.update(update);
      //this.setState(update);
      //this.updateParent(update);
    }

    setInterval(() => {
      this.calculate_nextTime();
    }, 1000)
  }

  calculate_nextTime = () => {
    var start = new Date(this.state.startTime).getTime();
    var now = new Date().getTime();
    var diff = (now - start)


    var intervalMS = (this.state.repeatAmount * this.state.repeatEveryOptionsMS[this.state.repeatEvery]);
    var count = diff / intervalMS;
    var next = Math.ceil(count);


    var nextMS = start + (next * intervalMS)
    var nextTime = new Date(nextMS);

    //console.log(moment(this.state.startTime).unix());

    this.setState({ nextTime: nextTime.toUTCString() })
  }

  showEnabled = (enabled) => {
    if (enabled) {
      return (<span><i className="fas fa-power-off"></i> ENABLED</span>)
    } else {
      return (<span><i className="fas fa-power-off"></i> DISABLED</span>)
    }
  }

  update = (update) => {

    console.log("update run")
    this.setState(update, () => {
      this.updatedOptions();
      this.updateParent(update);
      this.scheduler();
    });
  }



  render() {
    if (this.state.startTime) {
      return (<Widget label={this.state.description} options={this.state.options} dash={this.props.dash} setOptions={this.setOptions}>

        <div style={{ padding: 5 }}>
          <div className={this.state.enabled ? "widget_button widget_toggleTrue" : "widget_button widget_toggleFalse"}
            style={{ float: "left", textAlign: "left", fontWeight: "bold" }}
            onClick={() => { this.update({ enabled: !this.state.enabled }) }}>
            {this.showEnabled(this.state.enabled)}
          </div>
          <div style={{ clear: "both" }} />
        </div>

        <div style={{ fontSize: "75%", fontWeight: "bold", padding: "0px 5px" }}>REPEATS EVERY {this.state.repeatAmount} {this.state.repeatEvery.toUpperCase() + "S"}</div>

        <div style={{ padding: "0px 5px" }}>

          <span style={{ fontSize: "75%" }}>
            {/* <b>{moment(this.state.nextTime).fromNow().toUpperCase()}</b><br /> */}
            <b>{moment(this.state.nextTime).countdown().toString()}</b><br />

            {this.state.nextTime}<br />
          </span>
        </div>

        {/* <div style={{ padding: 5 }}><b>START</b><br />
          <span style={{ fontSize: "85%" }}>{moment(this.state.startTime).fromNow()}<br /></span>
          <span style={{ fontSize: "85%" }}>{moment(this.state.startTime).format('HH:MMa dddd')} <br /></span>
          <span style={{ fontSize: "85%" }}>{moment(this.state.startTime).format('MMM D YYYY')}</span>
        </div> */}


      </Widget >
      );
    } else {
      return (<Widget label={this.props.data.dataname} options={this.state.options} dash={this.props.dash} setOptions={this.setOptions}>
        <div>click options to configure</div>
      </Widget>
      );
    }

  }
};

