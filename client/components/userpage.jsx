import React, { Component } from "react";

import moment from 'moment'




export class UserProfile extends Component {
    render() {
        var timeago = moment(this.props.user["_created_on"]).fromNow()
        console.log(timeago)

        var avatar = "/avatar.jpg"

        if (this.props.user.github) {
            avatar = this.props.user.github.avatar_url
        }

        return (
            <div className="panel">
                <div className="avatarProfile"> <img src={avatar} /></div>
                <h3> {this.props.user.username} </h3>
                Created: {this.props.user["_created_on"]} ( {moment(this.props.user["_created_on"]).fromNow()}) <br />
                Last Seen: {this.props.user["_last_seen"]} ( {moment(this.props.user["_last_seen"]).fromNow()}) <br />

                Device Count: {this.props.user["devicecount"]}
            </div>)
    }
}





export class UserPage extends Component {

    state = {
        username: undefined
    }

    componentDidMount = () => {
        if (this.props.username) {
            this.setState({ username: this.props.username }, () => {
                this.getUserDetails();
            });
        }

    }

    getUserDetails = () => {
        fetch('/api/v3/user/' + this.state.username, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()).then((user) => {
            //console.log(user);
            this.setState({ user })
        }).catch(err => console.error(err.toString()))
    }

    render() {

        if (this.state.user) {
            return (<UserProfile user={this.state.user} />)
        } else {
            return (<div></div>)
        }

    }
}
