const minZoom = 3
const maxZoom = 7
const tileSize = 256

const svgIconMarker = `
    <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g>
            <circle cx="25" cy="25" r="24" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2" />
            <image x="7" y="7" width="36" height="36" xlink:href="{iconImage}" />
        </g>
    </svg>`

const constructorIcon = getMarkerIcon("purple", "cyan", "https://static.satisfactory-calculator.com/img/gameUpdate4/ConstructorMk1_256.png?v=1615800933")

const mapOptions = {
    crs: L.CRS.Simple,
    minZoom,
    maxZoom,
    zoomDelta: 0.25,
    zoomSnap: 0.25,
    attributionControl: false,
    preferCanvas: true,
    fullscreenControl: true
}

let backgroundSize = 16384
const extraBackgroundSize = 2048
let mappingBoundWest = -324698.832031;
let mappingBoundEast = 425301.832031;
let mappingBoundNorth = -375000;
let mappingBoundSouth = 375000;

const westEastLength = Math.abs(mappingBoundWest) + Math.abs(mappingBoundEast);
const westEastRatio = westEastLength / backgroundSize;
const northSouthLength = Math.abs(mappingBoundNorth) + Math.abs(mappingBoundSouth);
const northSouthRatio = northSouthLength / backgroundSize;

const westOffset = westEastRatio * extraBackgroundSize;
const northOffset = northSouthRatio * extraBackgroundSize;

mappingBoundWest -= westOffset;
mappingBoundEast += westOffset;
mappingBoundNorth -= northOffset;
mappingBoundSouth += northOffset;
backgroundSize += extraBackgroundSize * 2;

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

let allFactoriesData = JSON.parse(localStorage.getItem('allFactoriesData'))

if (!allFactoriesData) {
    allFactoriesData = []
    localStorage.setItem('allFactoriesData', JSON.stringify(allFactoriesData))
}

let usedResources = JSON.parse(localStorage.getItem('usedResources'))

if (!usedResources) {
    usedResources = {}
    localStorage.setItem('usedResources', JSON.stringify(usedResources))
}

// Add resource markers

const mapControls = {}

for (const tab of window.mapData.options) {
    for (const resourceGroup of tab.options) {

        if (!['Desc_SAM_C', 'Desc_Geyser_C'].includes(resourceGroup.type)) {

            for (const resourceData of resourceGroup.options) {

                if (resourceData.purity !== undefined) {
                    const layerGroup = L.layerGroup().addTo(map)
                    mapControls[resourceData.layerId] = layerGroup

                    for (const markerData of resourceData.markers) {

                        const icon = getMarkerIcon(resourceData.outsideColor, resourceData.insideColor, resourceData.icon)
                        const marker = L.marker(unproject([markerData.x, markerData.y]), { icon }).addTo(layerGroup)
                        marker.on('click', resourceMarkerClick(marker, markerData, resourceGroup))
                        if (usedResources[markerData.pathName]) {
                            marker.setOpacity(0.6)
                        }
                    }
                }
            }
        }
    }
}

const LIQUIDS = [
    'Desc_Water_C', 'Desc_LiquidOilWell_C', 'Desc_NitrogenGas_C'
]
const liquidPurityMap = {
    impure: 150, normal: 300, pure: 600
}
const solidPurityMap = {
    impure: 300, normal: 600, pure: 780
}

function resourceMarkerClick(marker, markerData, resourceGroup) {
    return function () {
        if (usedResources[markerData.pathName]) {
            delete usedResources[markerData.pathName]
            marker.setOpacity(1)
        }
        else {
            const yield = LIQUIDS.includes(resourceGroup.type) ? liquidPurityMap[markerData.purity] : solidPurityMap[markerData.purity]
            usedResources[markerData.pathName] = { yield, resource: resourceGroup.type }
            marker.setOpacity(0.6)
        }
        localStorage.setItem('usedResources', JSON.stringify(usedResources))
        window.updateMapSidebar()
    }
}

L.control.layers(mapControls).addTo(map);

// Create train line

const createTrainLineButton = $('#create-train-line-button')
const trainTrackLayerGroup = L.layerGroup().addTo(map)
let trainLine
let trainLineLayer
let createTrainTrackEnabled = false

createTrainLineButton.click(() => {
    if (!createTrainTrackEnabled) {
        trainLine = []
        trainLineLayer = L.polyline(trainLine, { color: 'red' }).addTo(trainTrackLayerGroup)
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

const factoryLayerGroup = L.layerGroup().addTo(map)

// add factories to map

for (const factoryData of allFactoriesData) {
    createFactoryMarker(allFactoriesData, factoryData, factoryLayerGroup)
}

// Create factory button

const createFactoryButton = $('#create-factory-button')
let createFactoryEnabled = false

createFactoryButton.click(() => {
    createFactoryEnabled = !createFactoryEnabled
})

function createFactoryMapClick(e) {
    if (createFactoryEnabled) {
        const factoryData = {
            inputs: {},
            outputs: {},
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            blocks: []
        }
        allFactoriesData.push(factoryData)
        localStorage.setItem('allFactoriesData', JSON.stringify(allFactoriesData))
        createFactoryMarker(allFactoriesData, factoryData, factoryLayerGroup)
        createFactoryEnabled = false
    }
}

// Sidebar

window.updateMapSidebar = () => {

    // Calc input / output

    const itemAmounts = {}
    for (const factoryData of allFactoriesData) {
        for (const itemCode in factoryData.inputs) {
            itemAmounts[itemCode] = (itemAmounts[itemCode] || 0) + factoryData.inputs[itemCode]
        }
        for (const itemCode in factoryData.outputs) {
            itemAmounts[itemCode] = (itemAmounts[itemCode] || 0) - factoryData.outputs[itemCode]
        }
    }

    for (const nodeCode in usedResources) {
        const nodeInfo = usedResources[nodeCode]
        itemAmounts[nodeInfo.resource] = (itemAmounts[nodeInfo.resource] || 0) - nodeInfo.yield
    }

    const calcInputs = {}
    const calcOutputs = {}

    for (const recipeCode in itemAmounts) {
        if (itemAmounts[recipeCode] > 0.05) {
            calcInputs[recipeCode] = itemAmounts[recipeCode]
        }
        else if (itemAmounts[recipeCode] < -0.05) {
            calcOutputs[recipeCode] = -itemAmounts[recipeCode]
        }
    }

    // update ui

    const inputsBlock = $('[data-all-factories-io-items-inputs]')
    const ingredientRows = inputsBlock.find('div')

    let i = 0
    for (let recipeCode in calcInputs) {
        let row = ingredientRows[i]
        if (!row) {
            row = $('<div><span></span><span></span></div>').appendTo(inputsBlock)
        }
        const spans = $(row).find('span')
        $(spans[0]).text(window.itemData.items[recipeCode].name)
        $(spans[1]).text(calcInputs[recipeCode])

        i++
    }

    for (; i < ingredientRows.length; i++) {
        $(ingredientRows[i]).remove()
    }

    const outputsBlock = $('[data-all-factories-io-items-outputs]')
    const productRows = outputsBlock.find('div')

    i = 0
    for (let recipeCode in calcOutputs) {
        let row = productRows[i]
        if (!row) {
            row = $('<div><span></span><span></span></div>').appendTo(outputsBlock)
        }
        const spans = $(row).find('span')
        $(spans[0]).text(window.itemData.items[recipeCode].name)
        $(spans[1]).text(calcOutputs[recipeCode])

        i++
    }

    for (; i < productRows.length; i++) {
        $(productRows[i]).remove()
    }
}

window.updateMapSidebar()

////////////

function onMapClick(e) {
    trainLineMapClick(e)
    createFactoryMapClick(e)
}

map.on('click', onMapClick);

// Create factory marker

function createFactoryMarker(allFactoriesData, factoryData, factoryLayerGroup) {
    const marker = L.marker([factoryData.lat, factoryData.lng], { icon: constructorIcon, draggable: true }).addTo(factoryLayerGroup).on('click', (e) => window.buildFactory(allFactoriesData, factoryData))
    marker.on('dragend', function () {
        var position = marker.getLatLng();
        factoryData.lat = position.lat
        factoryData.lng = position.lng
        localStorage.setItem('allFactoriesData', JSON.stringify(allFactoriesData))
    });
}

////////////

function getMarkerIcon(outsideColor, insideColor, iconImage) {

    const icon = svgIconMarker
        .replace(/{outsideColor}/g, outsideColor)
        .replace(/{insideColor}/g, insideColor)
        .replace(/{iconImage}/g, iconImage);

    return L.divIcon({
        className: "leaflet-data-marker",
        html: icon,
        iconAnchor: [24, 24],
        iconSize: [48, 48]
    })
}

////////////

function unproject(coordinates) {
    return map.unproject(convertToRasterCoordinates(coordinates), zoom);
}

////////////

function convertToRasterCoordinates(coordinates) {
    let x = parseFloat(coordinates[0]) || 0;
    let y = parseFloat(coordinates[1]) || 0;

    let xMax = Math.abs(mappingBoundWest) + Math.abs(mappingBoundEast);
    let yMax = Math.abs(mappingBoundNorth) + Math.abs(mappingBoundSouth);

    let xRatio = Math.abs(backgroundSize) / xMax;
    let yRatio = Math.abs(backgroundSize) / yMax;

    x = ((xMax - mappingBoundEast) + x) * xRatio;
    y = (((yMax - mappingBoundNorth) + y) * yRatio) - backgroundSize;

    return [x, y];
}
