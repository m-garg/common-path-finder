/*global google*/

var initialCenter = new google.maps.LatLng(30.36093378427712, 76.39173746109009);
var map;
var locationsA = [], locationsB = [], pathsA = [], pathsB = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplayA, directionsDisplayB, commonDisplay, commonPaths = [];

function placeMarker(location) {
    new google.maps.Marker({
        position: location,
        map: map
    });
}

function initialize() {
    var mapProp = {
        center: initialCenter,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

google.maps.event.addDomListener(window, 'load', initialize);
var currentUser;

function updateLoctions() {
    var event = this.event;
    if (event.target.id === 'userABtn') {
        currentUser = 0;
        addMarkerListener();
    } else if (event.target.id === 'userBBtn') {
        currentUser = 1;
        addMarkerListener();
    }
}
function markerListener(event) {
    if (currentUser === 0) {
        if (locationsA.length < 2) {
            locationsA.push(event.latLng)
            placeMarker(event.latLng);
        }
        if (locationsA.length === 2) {
            removeMarkerListener();
            var requestA = {
                origin: locationsA[0],
                destination: locationsA[1],
                travelMode: google.maps.TravelMode.DRIVING
            }
            directionsDisplayA = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "red"
                }
            });
            buildAndGetPath(requestA, directionsDisplayA, function(route) {
                pathsA = route.overview_path;
                document.getElementById('userALocation1').innerHTML = route.legs[0].start_address;
                document.getElementById('userALocation2').innerHTML = route.legs[0].end_address;
            })

        }
    } else if (currentUser === 1) {
        if (locationsB.length < 2) {
            locationsB.push(event.latLng)
            placeMarker(event.latLng);
        }
        if (locationsB.length === 2) {
            removeMarkerListener();
            var requestB = {
                origin: locationsB[0],
                destination: locationsB[1],
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsDisplayB = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "blue"
                }
            });
            buildAndGetPath(requestB, directionsDisplayB, function(route) {
                pathsB = route.overview_path;
                document.getElementById('userBLocation1').innerHTML = route.legs[0].start_address;
                document.getElementById('userBLocation2').innerHTML = route.legs[0].end_address;
            })
        }
    }
}
var listenHandler;
function addMarkerListener() {
    listenHandler = google.maps.event.addListener(map, 'click', markerListener)
}
function removeMarkerListener() {
    google.maps.event.removeListener(listenHandler)
}

function getCommonPath() {
    if (pathsA.length === 0 || pathsB.length === 0) {
        alert('please choose paths first')
        return;
    }
    var idx, idxB;
    for (idx = 0; idx < pathsA.length; idx++) {
        for (idxB = 0; idxB < pathsB.length; idxB++) {
            if (pathsA[idx].equals(pathsB[idxB])) {
                commonPaths.push(pathsA[idx]);
                break;
            }
        }
    }
    if (commonPaths.length !== 0) {
        var request = {
            origin: commonPaths[0],
            destination: commonPaths[commonPaths.length - 1],
            travelMode: google.maps.TravelMode.DRIVING
        };
        commonDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "black"
                    }
                });
        buildAndGetPath(request, commonDisplay, function(route) {
            document.getElementById('commonLocation1').innerHTML = route.legs[0].start_address;
            document.getElementById('commonLocation2').innerHTML = route.legs[0].end_address;
            alert('You could share path from ' + route.legs[0].start_address + ' to ' +route.legs[0].end_address);
        })
    } else {
        alert('no common path found')
    }
}

function buildAndGetPath(options, dd, cb) {
    directionsService.route(options, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            dd.setDirections(result);
            dd.setMap(map);
            return cb(result.routes[0]);
        }
        return cb([]);
    });
}