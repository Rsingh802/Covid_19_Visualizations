// initialize basemmap
mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
zoom: 3, // starting zoom
center: [-100, 40] // starting center
});

// load data and add as layer
async function geojsonFetch() {
let response = await fetch('assets/us-covid-2020-rates.geojson');
let stateData = await response.json();

map.on('load', function loadingData() {
    map.addSource('stateData', {
        type: 'geojson',
        data: stateData
    });

    map.addLayer({
        'id': 'stateData-layer',
        'type': 'fill',
        'source': 'stateData',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                '#FFEDA0',   // stop_output_0
                20,          // stop_input_0
                '#FED976',   // stop_output_1
                40,          // stop_input_1
                '#FEB24C',   // stop_output_2
                60,          // stop_input_2
                '#FD8D3C',   // stop_output_3
                80,         // stop_input_3
                '#FC4E2A',   // stop_output_4
                100,         // stop_input_4
                '#E31A1C',   // stop_output_5
                120,         // stop_input_5
                '#BD0026',   // stop_output_6
                140,        // stop_input_6
                "#800026"    // stop_output_7
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });

    const layers = [
        '0-19',
        '20-39',
        '40-59',
        '60-79',
        '80-99',
        '100-119',
        '120-139',
        '140 and more'
    ];
    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670',
        '#80002670'
    ];

    // create legend
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>COVID-19 Rate<br>(cases/1k residents)</b><br><br>";


    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
});

map.on('mousemove', ({point}) => {
    const state = map.queryRenderedFeatures(point, {
        layers: ['stateData-layer']
    });
    document.getElementById('text-escription').innerHTML = state.length ?
        `<h3>${state[0].properties.county} County, ${state[0].properties.state}</h3><p><strong><em>${state[0].properties.rates}</strong> cases per 1,000 residents</em></p>` :
        `<p>Data is for 2020.
            Hover over a state!</p>
        <p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>`;
});
}

geojsonFetch();