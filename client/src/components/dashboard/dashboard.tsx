import React from "react";
import { CorePacket } from "../../../../server/shared/interfaces";
import GridLayout from 'react-grid-layout';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css"
import { Widget } from "./widget"
import { generateDifficult } from "../../../../server/utils/utils"
import { clone } from "../../utils/lodash_alt"
import { api } from "../../api"
import { colors } from "../../theme";

import { Button } from "../button"
import { Menu } from "../menu";

interface MyProps {
    //account: User;
    state: CorePacket;
}

interface MyState {
    grid: { width: number, cols: number, rowHeight: number }
    [index: string]: any;
    layout: any
}

export class Dashboard extends React.Component<MyProps, MyState> {
    state = {
        grid: {
            width: 4000,
            cols: 40,
            rowHeight: 30
        },
        layout: [],
        showB: false
    }

    updatesource = "props";
    settingLayout = false;
    draggingUnique = "";

    onDragOver = (e, f?) => {
        e.stopPropagation();
        e.preventDefault();
    }

    onDrop = (e, f) => {
        console.log("...")
        e.preventDefault();
        var typel = undefined;
        // pixel location
        var droplocation = {
            x: e.pageX - e.target.getBoundingClientRect().x,
            y: e.pageY - e.target.getBoundingClientRect().y
        }

        // calculate row/column location for widget
        var location = {
            x: Math.max(0, Math.round(droplocation.x / (this.state.grid.width / this.state.grid.cols) - 0.5)),
            y: Math.max(0, Math.round(droplocation.y / this.state.grid.rowHeight / 2) - 1)
        }

        // add widget to layout

        if (e.dataname == "lat" || e.dataname == "lon" || e.dataname == "gps") {
            typel = "map"
            // } else if (typeof e.data == "boolean") {
            //   if (e.data == true) {
            //     typel = "booleanButtonTrue"
            //   } else {
            //     typel = "booleanButtonFalse"
            //   }
        } else if (typeof e.data == "string" || typeof e.data == "boolean") {
            typel = "basic"
        } else {
            //typel = "Gauge"
            typel = "basic"
        }
        var layout = clone(this.state.layout)
        layout.push({
            i: generateDifficult(32),
            x: location.x, y: location.y, w: 2, h: 5,
            type: typel,
            datapath: e.datapath,
            dataname: e.dataname
        })
        this.updatesource = "user";
        this.setState({ layout: layout }, () => {
            this.updateServer();
        })
    }

    gridOnDragStart = (evt) => {
        console.log("DRAG")
        //evt.preventDefault();
        //evt.stopPropagation();
    }
    gridOnDrag = (evt) => {
        //console.log("drag start"); 
        //evt.preventDefault();
        //evt.stopPropagation();
    }
    gridOnDragStop = () => {
        console.log("drag stop");
        this.updatesource = "user";
    }
    gridOnResizeStart = () => {
        //console.log("resize start"); 
    }
    gridOnResize = () => {
        //console.log("resize "); 
    }
    gridOnResizeStop = () => {
        //console.log("resize stop");
        this.updatesource = "user"
    }

    componentDidMount = () => {
        if (!this.props.state) { return; }
        if (!this.props.state.layout) {
            this.setState({ layout: [] })
        } else {
            this.setState({ layout: this.props.state.layout })
        }

    }

    UNSAFE_componentWillReceiveProps = (props) => {
        // console.log("recieveProps", this.props.state.layout)

        var statelayout = JSON.stringify(this.state.layout);

        if (statelayout == undefined) { statelayout = "[]" }

        var propslayout = JSON.stringify(this.props.state.layout);

        if (statelayout != propslayout) {
            // console.log("Updating Layout state")
            // update if not the same as what we had.
            this.updatesource = "props"

            var layout = this.props.state.layout
            if (layout == undefined) { layout = [] }
            this.setState({ layout })
        }
    }

    gridOnLayoutChange = (layout) => {
        var updated = false; //should we update the server? default false.

        var newlayout = clone(this.state.layout)
        for (var widgetup of layout) {
            for (var widget of newlayout) {
                if (widget.i == widgetup.i) {
                    // update on location/size changes
                    if (widget.x != widgetup.x) { widget.x = widgetup.x; updated = true; }
                    if (widget.y != widgetup.y) { widget.y = widgetup.y; updated = true; }
                    if (widget.w != widgetup.w) { widget.w = widgetup.w; updated = true; }
                    if (widget.h != widgetup.h) { widget.h = widgetup.h; updated = true; }
                }
            }
        }

        //if there are fewer or more widgets then we update the server
        if (layout.length != this.state.layout) {
            updated = true;
        }

        if (updated) {
            // update the server
            this.setState({ layout: newlayout }, () => {
                this.updateServer();
            })
        }
    }

    updateServer = () => {
        //console.log("updateServer ?", this.updatesource)
        if (this.updatesource == "props") {
            //console.log("NOT UPDATING SERVER"); 
            return;
        } else {
            //console.log("UPDATE SERVER!")
            this.updatesource = "props"; //debounce
            api.post({
                key: this.props.state.key,
                layout: this.state.layout
            })
            return;
        }
    }

    handleWidgetActions = (widget) => {
        return (action) => {
            console.log("dashboard.handleWidgetActions", widget, action)
            if (action.remove) { this.removeWidget(widget) }
            if (action.type) { this.changeWidgetType(widget, action.type) }
            if (action.option) { this.changeWidgetOption(widget, action.option); }
            if (action.save) {
                this.updatesource = "user";
                this.updateServer()
            }
        }
    }

    /** sets a widget option non permanently */
    changeWidgetOption(widget: { i: string }, option) {
        var layout = clone(this.state.layout);
        layout = layout.map((w) => {
            if (w.i == widget.i) {
                if (!w.options) { w.options = option; } else {
                    w.options = { ...w.options, ...option }
                }
            }
            return w
        })
        this.setState({ layout })
    }

    /** change the type of a widget */
    changeWidgetType(widget: { i: string }, type: string) {
        api.stateupdate({
            query: { key: this.props.state.key, "layout.i": widget.i },
            update: { $set: { "layout.$.type": type } }
        }, (err, result) => {
            if (err) { console.log(err); }
            if (result) {
                if (result.nModified == 1) {
                    /** successfully changed in db*/
                    // - - - - 
                    var layout = clone(this.state.layout)
                    for (var w of layout) { if (w.i == widget.i) { w.type = type } }
                    this.updatesource = "user"; // if updatesource == user then server will be updated
                    this.setState({ layout }, () => { this.updateServer() })
                    // - - - - 
                }
            }
        })
    }

    /** removes a widget from the dashboard (and db)*/
    removeWidget(widget: { i: string }) {
        api.stateupdate({
            query: { key: this.props.state.key },
            update: { $pull: { layout: { i: widget.i } } }
        }, (err, result) => {
            if (err) { console.log(err); }
            if (result) {
                //console.log(result);
                if (result.nModified == 1) {
                    /** successfully removed in db */
                    // - - - - 
                    var layout = clone(this.state.layout)
                    layout = layout.filter((w) => { return (w.i != widget.i) })
                    this.updatesource = "user"; // if updatesource == user then server will be updated
                    this.setState({ layout })
                    // - - - - 
                }
            }
        })
    }

    addWidget = () => {
        var layout = clone(this.state.layout)
        layout.push({ i: generateDifficult(32), x: 0, y: 0, w: 2, h: 5, type: "basic", datapath: "", dataname: "" })
        this.updatesource = "user"
        this.setState({ layout }, () => { })
    }

    render() {
        if (!this.props.state) { return <div>loading...</div> }
        if (this.state.layout == undefined) {
            console.log(this.state.layout)
            return <div>no layout</div>
        }

        return (
            <div>

                <div style={{
                    borderTopRightRadius: "12px",
                    background: "rgba(0,0,0,0.1)",
                    display: "flex", flexDirection: "row"
                }}>
                    <div style={{ flex: "5", paddingTop: colors.padding, textAlign: "center" }}>Dashboard</div>
                    <div style={{ flex: "1" }}>
                        <Menu align="right" config={{ menuitems: [{ responsive: true, icon: "plus-square", text: "New widget", onClick: () => { this.addWidget() } }] }} />
                    </div>
                </div>

                <div style={{ width: "100%", background: "#181818", border: colors.borders }}

                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e, "complete")} >

                    <GridLayout
                        onDragStart={this.gridOnDragStart}
                        onDrag={this.gridOnDrag}
                        onDragStop={this.gridOnDragStop}
                        onResizeStart={this.gridOnResizeStart}
                        onResize={this.gridOnResize}
                        onLayoutChange={this.gridOnLayoutChange}
                        useCSSTransforms={false}
                        onResizeStop={this.gridOnResizeStop}
                        layout={this.state.layout}
                        cols={this.state.grid.cols}
                        draggableHandle=".widgetGrab"   // drag handle class
                        rowHeight={this.state.grid.rowHeight}
                        width={this.state.grid.width}>

                        {this.state.layout.map((widget, i) => {
                            return (<div key={widget.i} onDrag={e => { e.preventDefault(); e.stopPropagation(); }}>
                                <Widget widget={widget} state={this.props.state} action={this.handleWidgetActions(widget)} />
                            </div>)
                        })}
                    </GridLayout>
                </div></div>
        )
    }
}
