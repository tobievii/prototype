import React, { Component } from "react";
import protoGraphTheme from './theme.jsx'

// Nivo calendar http://nivo.rocks/calendar

import { ResponsiveLine } from '@nivo/line'
//import "./index.scss"

export class Line extends React.Component {
  state = {}




  render() {

    var linedata = [
      {
        "id": "japan",
        "color": "hsl(198, 70%, 50%)",
        "data": [
          {
            "x": "plane",
            "y": 181
          },
          {
            "x": "helicopter",
            "y": 262
          },
          {
            "x": "boat",
            "y": 112
          },
          {
            "x": "train",
            "y": 289
          },
          {
            "x": "subway",
            "y": 195
          },
          {
            "x": "bus",
            "y": 6
          },
          {
            "x": "car",
            "y": 75
          },
          {
            "x": "moto",
            "y": 121
          },
          {
            "x": "bicycle",
            "y": 29
          },
          {
            "x": "others",
            "y": 220
          }
        ]
      },
      {
        "id": "france",
        "color": "hsl(332, 70%, 50%)",
        "data": [
          {
            "x": "plane",
            "y": 140
          },
          {
            "x": "helicopter",
            "y": 191
          },
          {
            "x": "boat",
            "y": 175
          },
          {
            "x": "train",
            "y": 98
          },
          {
            "x": "subway",
            "y": 176
          },
          {
            "x": "bus",
            "y": 97
          },
          {
            "x": "car",
            "y": 181
          },
          {
            "x": "moto",
            "y": 171
          },
          {
            "x": "bicycle",
            "y": 145
          },
          {
            "x": "others",
            "y": 62
          }
        ]
      },
      {
        "id": "us",
        "color": "hsl(280, 70%, 50%)",
        "data": [
          {
            "x": "plane",
            "y": 146
          },
          {
            "x": "helicopter",
            "y": 212
          },
          {
            "x": "boat",
            "y": 217
          },
          {
            "x": "train",
            "y": 190
          },
          {
            "x": "subway",
            "y": 223
          },
          {
            "x": "bus",
            "y": 131
          },
          {
            "x": "car",
            "y": 67
          },
          {
            "x": "moto",
            "y": 47
          },
          {
            "x": "bicycle",
            "y": 236
          },
          {
            "x": "others",
            "y": 80
          }
        ]
      },
      {
        "id": "germany",
        "color": "hsl(160, 70%, 50%)",
        "data": [
          {
            "x": "plane",
            "y": 160
          },
          {
            "x": "helicopter",
            "y": 288
          },
          {
            "x": "boat",
            "y": 77
          },
          {
            "x": "train",
            "y": 214
          },
          {
            "x": "subway",
            "y": 7
          },
          {
            "x": "bus",
            "y": 198
          },
          {
            "x": "car",
            "y": 203
          },
          {
            "x": "moto",
            "y": 174
          },
          {
            "x": "bicycle",
            "y": 235
          },
          {
            "x": "others",
            "y": 86
          }
        ]
      },
      {
        "id": "norway",
        "color": "hsl(168, 70%, 50%)",
        "data": [
          {
            "x": "plane",
            "y": 219
          },
          {
            "x": "helicopter",
            "y": 84
          },
          {
            "x": "boat",
            "y": 204
          },
          {
            "x": "train",
            "y": 267
          },
          {
            "x": "subway",
            "y": 178
          },
          {
            "x": "bus",
            "y": 246
          },
          {
            "x": "car",
            "y": 299
          },
          {
            "x": "moto",
            "y": 268
          },
          {
            "x": "bicycle",
            "y": 99
          },
          {
            "x": "others",
            "y": 276
          }
        ]
      }
    ]


    return (


      <ResponsiveLine
        data={linedata}
        margin={{
          "top": 35,
          "right": 35,
          "bottom": 55,
          "left": 55
        }}
        xScale={{
          "type": "point"
        }}
        yScale={{
          "type": "linear",
          "stacked": true,
          "min": "auto",
          "max": "auto"
        }}
        minY="auto"
        maxY="auto"

        stacked={true}
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          "orient": "bottom",
          "tickSize": 5,
          "tickPadding": 5,
          "tickRotation": 0,
          "legend": "transportation",
          "legendOffset": 36,
          "legendPosition": "middle"
        }}
        axisLeft={{
          "orient": "left",
          "tickSize": 5,
          "tickPadding": 5,
          "tickRotation": 0,
          "legend": "count",
          "legendOffset": -40,
          "legendPosition": "middle"
        }}
        dotSize={10}
        dotColor="inherit:darker(0.3)"
        dotBorderWidth={2}
        dotBorderColor="rgba(0,0,0,0)"
        enableDotLabel={true}
        dotLabel="y"
        dotLabelYOffset={-12}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        theme={protoGraphTheme}

      />

    )
  }
}