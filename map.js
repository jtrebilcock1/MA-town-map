const osm_style = {
    version: 8,
    sources: {
        osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
            maxzoom: 25,
        },
    },
    layers: [
        {
            id: "osm",
            type: "raster",
            source: "osm",
        },
    ],
};

//create map object
const map = new maplibregl.Map({
    container: 'map',
    style: osm_style,
    center: [-71.7665709, 42.0532775],
    zoom: 8
});

//add control for zoom, disable rotating
map.addControl(new maplibregl.NavigationControl());
map.dragRotate.disable();

//add data from geomjson
map.on('load', () => {
    map.addSource('ma_towns', {
        'type': 'geojson',
        'data': 'geojsons/CENSUS2020TOWN.geojson'
    });
    map.addLayer({
        'id': 'ma_towns',
        'type': 'fill',
        'source': 'ma_towns',
        'layout': {},
        'paint': {
            //for now we'll vary the fill color by pop2020 on arbitrary increments
            'fill-opacity': 1,
            "fill-outline-color": "#000000",
            "fill-color": [
                "case",
                ["==", ["get", "POP2020"], null],
                "white",
                ["step", ["get", "POP2020"], "#deebf7", 10000, "#9ecae1", 100000, "#3182bd"]
            ]

        }
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'ma_towns', (e) => {
        const town_name = e.features[0].properties.TOWN20;
        const population20 = e.features[0].properties.POP2020;
        const population10 = e.features[0].properties.POP2010;
        const pop_diff = population20 - population10;
        new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                `
                    <div class="card text-center">
                      <div class="card-body">
                        <p class="card-text"><strong>${town_name}</strong></p>
                        <p class="card-text">population in 2020: <strong>${population20}</strong></p>
                        <p class="card-text">population in 2010: <strong>${population10}</strong></p>
                        <p class="card-text">10 year population growth: <strong>${pop_diff}</strong></p>
                      </div>
                    </div>
                    `
            )
            .addTo(map);
    });
});
