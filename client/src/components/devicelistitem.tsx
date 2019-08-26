import React from "react";
import { CorePacket } from "../../../server/shared/interfaces";
import { blendrgba } from "../utils/utils"
import { theme, colors } from "../theme"
import { Link } from "react-router-dom";

import { moment } from "../utils/momentalt"

interface MyState {
    [index: string]: any;
}

interface DeviceProps {
    device: CorePacket,
    action: Function
}

export class DeviceListItem extends React.Component<DeviceProps, MyState> {

    intervalupdater;

    constructor(props) {
        super(props);
        this.intervalupdater = setInterval(() => {
            this.forceUpdate();
        }, 1000)
    }

    componentWillUnmount = () => {
        if (this.intervalupdater) clearInterval(this.intervalupdater);
    }


    /* returns a ratio of how long ago something occurred between 0 and 1. Intended to be used as a time fade. */
    timeratio(timestamp, duration, options?: ({ clamp: boolean })): number {
        var activity = new Date(timestamp);
        var clock = new Date();
        var delta = clock.getTime() - activity.getTime();

        var ratio = (duration - delta) / duration
        if (options) {
            if (options.clamp == true) {
                if (ratio < 0) {
                    ratio = 0;
                }
                if (ratio > 1) {
                    ratio = 1;
                }
            }
        }

        return ratio
    }

    calcStyle = () => {
        var quickfade = this.timeratio(this.props.device["_last_seen"], 1000 * 60 * 60, { clamp: true });
        var slowfade = this.timeratio(this.props.device["_last_seen"], 1000 * 60 * 60 * 24, { clamp: true });

        return {
            marginBottom: 2, padding: "5px 0 5px 0",
            backgroundImage: "linear-gradient(to right, rgba(16, 26, 38, 0.5)," + blendrgba({ r: 3, g: 4, b: 5, a: 0.5 }, { r: 125, g: 255, b: 175, a: 0.75 }, (quickfade / 1.5) - 0.35) + ")",
            borderRight: "5px solid " + blendrgba({ r: 60, g: 19, b: 25, a: 0 }, { r: 125, g: 255, b: 175, a: 1.0 }, slowfade)
        }
    }

    render() {
        return (
            <div className="device" style={this.calcStyle()}>
                <div style={theme.global.devicelist.columns} >
                    {(this.props.device.selected)
                        ? <i
                            onClick={(e) => this.props.action({ select: false })}
                            style={{ color: colors.checkmark }} className="fas fa-check" />
                        : <i
                            onClick={(e) => this.props.action({ select: true })}
                            style={{ opacity: colors.transparent }} className="fas fa-square" />}
                </div>
                <div style={{ flex: 1 }}>
                    <Link to={"/u/" + this.props.device.username + "/view/" + this.props.device.id} >{this.props.device.id}</Link>
                </div>

                <div style={theme.global.devicelist.timecolumn}>
                    {moment(this.props.device["_last_seen"]).timeDelta()}
                </div>

                <div style={theme.global.devicelist.columns}>
                    {(this.props.device.alarm)
                        ? <i style={{ color: colors.alarm }} className="fas fa-bullhorn" />
                        : <i style={{ opacity: colors.transparent }} className="fas fa-bullhorn" />
                    }

                </div>

                <div style={theme.global.devicelist.columns}>
                    {(this.props.device.warning)
                        ? <i style={{ color: colors.warning }} className="fas fa-exclamation-triangle" />
                        : <i style={{ opacity: colors.transparent }} className="fas fa-exclamation-triangle" />}
                </div>

                <div style={theme.global.devicelist.columns}>
                    {(this.props.device.shared)
                        ? <i style={{ color: colors.share }} className="fas fa-share-alt" />
                        : <i style={{ opacity: colors.transparent }} className="fas fa-share-alt" />}

                </div>

                <div style={theme.global.devicelist.columns}>
                    {(this.props.device.public)
                        ? <i style={{ color: colors.public }} className="fas fa-globe-africa" />
                        : <i style={{ opacity: colors.transparent }} className="fas fa-globe-africa" />}
                </div>
            </div>
        )
    }
}