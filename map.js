//create map object
const map = new maplibregl.Map({
    container: 'map',
    style:
        'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
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
            'fill-color': 'transparent',
            'fill-opacity': 1,
            "fill-outline-color": "#000000"
        }
    });
});
