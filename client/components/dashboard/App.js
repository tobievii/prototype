import React from 'react';

import ChartLine from './chart_line';

const createData = () => {
    const data = [];
    let price1 = 1000;
    let price2 = 1200;
    for (let i = 0; i < 10; i++) {
        price1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
        data.push({ date1: new Date(2015, 0, i), price1 });
    }
    for (let i = 0; i < 10; i++) {
        price2 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
        data.push({ date2: new Date(2017, 0, i), price2 });
    }

    return data;
}


const App = (props) => {
    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <ChartLine data={createData()} />
        </div>
    )
}

export default App;