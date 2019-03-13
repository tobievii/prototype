import React, { Component } from "react";
import moment from 'moment'



export class NotificationsView extends Component {
    constructor(props) {
        super(props);

        this.state = { notifications: [] };
    }

    componentDidMount() {
        this.NotificationList();
    }

    NotificationList = () => {

        fetch('/api/v3/u/notifications')
            .then(response => response.json())
            .then(data => this.setState({ notifications: data }));
    }

    render() {
        var notify = this.state.notifications.reverse().map((notification, i) => {
            if (notification.type == "CONNECTION DOWN 24HR WARNING") {
                return (

                    <div className="warningNotificationItem">
                        <i className="fas fa-bullhorn"></i>
                        <span className="newdevice" >{notification.type}</span><br />
                        <span className="devicename">{notification.device}</span><br />
                        <span className="lastseen">{moment(notification.created).fromNow()}</span>
                    </div>

                )
            }
            if (notification.type == "ALARM") {
                return (

                    <div className="alarmNotificationItem">
                        <i className="fas fa-bullhorn"></i>
                        <span className="newdevice" >{notification.type}</span><br />
                        <span className="devicename">{notification.device}</span><br />
                        <span className="lastseen">{moment(notification.created).fromNow()}</span>
                    </div>

                )
            }
            if (notification.type == "New Device Added") {
                notification.type = "NEW DEVICE ADDED"
            }
            if (notification.type == "NEW DEVICE ADDED") {
                return (

                    <div className="newNotificationItem">
                        <i className="fas fa-exclamation-circle"></i>
                        <span className="newdevice" >{notification.type}</span><br />
                        <span className="devicename">{notification.device} has been added</span><br />
                        <span className="lastseen">{moment(notification.created).fromNow()}</span>
                    </div>

                )
            }
            if (notification.type == "A DEVICE WAS SHARED WITH YOU") {
                return (

                    <div className="newNotificationItem">
                        <i className="fas fa-exclamation-circle"></i>
                        <span className="newdevice" >{notification.type}</span><br />
                        <span className="devicename">{notification.device} has been added</span><br />
                        <span className="lastseen">{moment(notification.created).fromNow()}</span>
                    </div>

                )
            }

        }

        );

        return (
            <div style={{ marginTop: "26px" }}>
                <div style={{ marginBottom: "15px", marginTop: "36px", textAlign: "center", fontSize: 30, color: "#f3353a" }}>
                    Notifications
                </div>
                <div>
                    {notify}
                </div>
            </div>
        );
    }
}
