const minZoom = 3
const maxZoom = 7
const tileSize = 256
const dataUrl = '/data.json'

const mapOptions = {
    crs                             : L.CRS.Simple,
    minZoom,
    maxZoom,
    zoomDelta                       : 0.25,
    zoomSnap                        : 0.25,
    attributionControl              : false,
    preferCanvas                    : true,
    fullscreenControl               : true
}

let backgroundSize = 16384
const extraBackgroundSize = 2048
let mappingBoundWest = -324698.832031;
let mappingBoundEast = 425301.832031;
let mappingBoundNorth = -375000;
let mappingBoundSouth = 375000;

const westEastLength   = Math.abs(mappingBoundWest) + Math.abs(mappingBoundEast);
const westEastRatio    = westEastLength / backgroundSize;
const northSouthLength = Math.abs(mappingBoundNorth) + Math.abs(mappingBoundSouth);
const northSouthRatio  = northSouthLength / backgroundSize;

const westOffset       = westEastRatio * extraBackgroundSize;
const northOffset      = northSouthRatio * extraBackgroundSize;

mappingBoundWest      -= westOffset;
mappingBoundEast      += westOffset;
mappingBoundNorth     -= northOffset;
mappingBoundSouth     += northOffset;
backgroundSize        += extraBackgroundSize * 2;

const zoom = Math.ceil(Math.log(backgroundSize / tileSize) / Math.log(2))

const map = L.map('mapid', mapOptions).setView([0, 0], zoom);

const southWest = map.unproject([0, backgroundSize], zoom);
const northEast = map.unproject([backgroundSize, 0], zoom);

const bounds = new L.LatLngBounds(southWest, northEast);
map.setMaxBounds(bounds);
map.fitBounds(bounds);

L.tileLayer('https://static.satisfactory-calculator.com/imgMap/gameLayer/Experimental/{z}/{x}/{y}.png?v=1623307417', {
    maxZoom,
    minZoom,
    tileSize,
    bounds
}).addTo(map);

///////////

const mapControls = {}

$.getJSON(dataUrl, function(data){
    console.log(data)

    for (const tab of data.options) {

        for (const resourceGroup of tab.options) {

            for (const resource of resourceGroup.options) {
                
                if(resource.purity !== undefined)
                {
                    const layerGroup = L.layerGroup().addTo(map)
                    mapControls[resource.layerId] = layerGroup

                    for (const marker of resource.markers) {

                        const icon = getMarkerIcon(resource.outsideColor, resource.insideColor, resource.icon)
                        L.marker(unproject([marker.x, marker.y]), { icon }).bindTooltip("my tooltip text").addTo(layerGroup);
                    }
                }
            }
        }
    }

    L.control.layers(mapControls).addTo(map);
})

////////////

const createTrainLineButton = $('#create-train-line-button')
const trainTrackLayerGroup = L.layerGroup().addTo(map)
let trainLine
let trainLineLayer
let createTrainTrackEnabled = false

createTrainLineButton.click(() => {
    if (!createTrainTrackEnabled) {
        trainLine = []
        trainLineLayer = L.polyline(trainLine, {color: 'red'}).addTo(trainTrackLayerGroup)
    }
    createTrainTrackEnabled = !createTrainTrackEnabled
})

function trainLineMapClick(e) {
    if (createTrainTrackEnabled) {
        trainLine.push(e.latlng)
        trainLineLayer.setLatLngs(trainLine)
    }
}

////////////

const createFactoryButton = $('#create-factory-button')
const factoryLayerGroup = L.layerGroup().addTo(map)
let createFactoryEnabled = true

createFactoryButton.click(() => {
    createFactoryEnabled = !createFactoryEnabled
})

function createFactoryMapClick(e) {
    if (createFactoryEnabled) {
        const icon = getMarkerIcon("purple", "cyan", "https://static.satisfactory-calculator.com/img/gameUpdate4/ConstructorMk1_256.png?v=1615800933")
        L.marker(e.latlng, { icon }).addTo(factoryLayerGroup)
        createFactoryEnabled = false
    }
}

////////////

function onMapClick(e) {
    trainLineMapClick(e)
    createFactoryMapClick(e)
}

map.on('click', onMapClick);

////////////

const svgIconMarker = `
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g>
            <circle cx="47" cy="77" r="24" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2" />
            <image x="29" y="59" width="36" height="36" xlink:href="{iconImage}" />
        </g>
    </svg>`

function getMarkerIcon(outsideColor, insideColor, iconImage) {

    const icon = svgIconMarker
        .replace(/{outsideColor}/g, outsideColor)
        .replace(/{insideColor}/g, insideColor)
        .replace(/{iconImage}/g, iconImage);

    return L.divIcon({
        className   : "leaflet-data-marker",
        html        : icon,
        iconAnchor  : [48, 78],
        iconSize    : [100, 120]
    })
}

////////////

function unproject(coordinates){
    return map.unproject(convertToRasterCoordinates(coordinates), zoom);
}

////////////

function convertToRasterCoordinates(coordinates) {
    let x               = parseFloat(coordinates[0]) || 0;
    let y               = parseFloat(coordinates[1]) || 0;

    let xMax            = Math.abs(mappingBoundWest) + Math.abs(mappingBoundEast);
    let yMax            = Math.abs(mappingBoundNorth) + Math.abs(mappingBoundSouth);

    let xRatio          = Math.abs(backgroundSize) / xMax;
    let yRatio          = Math.abs(backgroundSize) / yMax;

    x = ((xMax - mappingBoundEast) + x) * xRatio;
    y = (((yMax - mappingBoundNorth) + y) * yRatio) - backgroundSize;

    return [x, y];
}
