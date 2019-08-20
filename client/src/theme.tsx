
export const prototypeTheme = {
    padding: "10px"
}

const colors = {
    spotA: "rgb(242, 53, 58)", // main colour
    spotB: "#0a203b", //gradientBot
    spotC: "#09111a", //gradientTop
    spotD: "#0d243d", //background
    spotE: "#fff",
    spotF: "#17232b", //panelbg
    panels: "#131E27"
}

// DEFINE COLOURS HERE:

const paddings = {
    default: 20
}

export const theme = {
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
        /////
        sidebar: {
            width: 400,
            background: colors.panels
        }

    },
    paddings,
    colors
};



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