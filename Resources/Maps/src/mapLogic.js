const maps = {
    spaceport: {
        name: "spaceport",
        center: [32.99020169835385, -106.97596734602624],
        minZoom: 11,
        maxZoom: 13
    },
    albans: {
        name: "albans",
        center: [44.823991, -73.165806],
        minZoom: 13,
        maxZoom: 15
    },
    wpi: {
        name: "wpi",
        center: [42.281849, -71.817541],
        minZoom: 13,
        maxZoom: 15
    },
}

let currentMap = maps["spaceport"]

const map = L.map("map").setView(currentMap.center, currentMap.maxZoom)

L.tileLayer(`qrc:/Maps/Maps/${currentMap.name}/{z}/{x}/{y}.jpg`, { maxZoom: currentMap.maxZoom, minZoom: currentMap.minZoom }).addTo(map)

// Create a line tracking the path of the payload
const pathConfig = {
    color: "#2222ff",
    // dashArray: [11,11],
    opacity: 0.6,
    smoothFactor: 1.0,
}
const path = L.polyline([], pathConfig)
path.addTo(map)

// Create the payload marker
const payloadConfig = {
    color: "#2222ff",
    radius: 10,
    fillOpacity: 0.3
}
const payloadPosition = [0, 0]
const payload = L.circleMarker(payloadPosition, payloadConfig)
payload.addTo(map)

function runPathTest() {
    setInterval(() => {
        const point = payload.getLatLng()
        path.addLatLng(point)
        const rand1 = Math.random() * 2 - 1
        const rand2 = Math.random() * 2 - 1
        payload.setLatLng(L.latLng(point.lat + 0.005 * rand1, point.lng + 0.005 * rand2))
    }, 200)
}

function addPayloadPoint(lat, lng) {
    if(payload.getLatLng().lat === 0) {
        payload.setLatLng(L.latLng(lat, lng))
        return
    }

    const currentPoint = payload.getLatLng()

    // Add the last payload point to the path, and update it
    path.addLatLng(currentPoint)

    const latLng = L.latLng(lat, lng)
    payload.setLatLng(latLng)
}

function reset() {
    // TODO
}

function centerMap(lat, lng) {
    if (map.getCenter().lat != lat && map.getCenter().lng != lng) {
        map.setView([lat, lng], map.zoom)
    }
}

// Initialize QT connection
if (typeof qt != 'undefined') new QWebChannel(qt.webChannelTransport, (channel) => {
    window.qtLeaflet = channel.objects.qtLeaflet

    // Connect to the payload point signal
    qtLeaflet.updatePayloadPoint.connect(function (latitude, longitude) {
        addPayloadPoint(latitude, longitude)
    })
})