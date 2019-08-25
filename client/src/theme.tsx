export const prototypeTheme = {
    padding: "10px"
}

export const colors = {
    spotA: "rgb(242, 53, 58)", // main colour
    spotB: "#0a203b", //gradientBot
    spotC: "#09111a", //gradientTop
    spotD: "#0d243d", //background
    spotE: "#fff",
    spotF: "#17232b", //panelbg
    panels: "#131E27",
    good: "#119752",    //green buttons
    public: "#1fb6d1", //blue planet
    share: "#18d66d", // green share
    warning: "#ecb81f",
    alarm: "#d9283a",
    checkmark: "#16d271",   //green
    transparent: 0.15,
    borders: "1px solid #2b4255"
}

// DEFINE COLOURS HERE:

const paddings = {
    default: 10
}

export const theme: any = {
    global: {
        colors: {
            "brand": '#f00',
            'light-2': '#0f0',
            'text': {
                'light': 'rgba(0, 0, 0, 0.87)',
            },
            'primary': '#0f0',
            'neutral-2': "#f00",
            "panelbg": colors.panels
        },
        edgeSize: {
            small: '14px',
        },
        elevation: {
            light: {
                medium: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
            },
        },
        font: {
            size: '14px',
            height: '20px',
        },
        // NAVBAR
        navbar: {
            background: colors.panels
        },
        navbarlogo: {
            padding: paddings.default,
            float: "right"
        },
        navlinksmall: {
            float: "right",
            padding: paddings.default
        },
        navlinklarge: {
            float: "right",
            padding: paddings.default
        },
        searchresults: {
            background: colors.panels,
            border: "1px solid"
        },
        //////
        devicelist: {
            addevice: {
                borderRadius: 0,
                margin: 0,
                padding: paddings.default,
                background: colors.good
            },
            columns: {
                width: "30px",
                textAlign: "center",
            },
            timecolumn: {
                flex: 1,
                textAlign: "right",
                paddingRight: "20px"
            }
        },
        titlebars: {
            background: colors.panels
        },
        menubars: {
            background: shadeColor(colors.panels, 15)
        },
        menuoptions: {
            padding: paddings.default,
            float: "left"
        },
        sortbuttons: {
            textAlign: "center",
            float: "left"
        }
    },
    paddings,
    colors
};

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors

export function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = Math.round(R * (100 + percent) / 100);
    G = Math.round(G * (100 + percent) / 100);
    B = Math.round(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}

export var icons = [];


/*
 ,
    extend: props => `
     text-transform: uppercase;
     font-size: 0.875rem;
     font-weight: 500;
     line-height: normal;

    ${!props.primary && `
      border-color: ${rgba(normalizeColor(props.colorValue, props.theme), 0.5)};
      color: ${normalizeColor(props.colorValue, props.theme)};
      :hover {
         box-shadow: none;
         background-color: ${rgba(normalizeColor(props.colorValue, props.theme), 0.08)};
       }
     `}
   `,
   */