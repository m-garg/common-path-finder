/*global google*/

var initialCenter = new google.maps.LatLng(30.36093378427712, 76.39173746109009);
var map;
var locationsA = [], locationsB = [], pathsA = [], pathsB = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplayA, directionsDisplayB, commonDisplay, commonPaths =[];

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
            removeMarkerListener()
            var requestA = {
                origin: locationsA[0],
                destination: locationsA[1],
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(requestA, function(result, status) {
                console.log('directions service route');
                console.log(result)
                console.log(status)
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplayA = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "green"
                    }
                });
                    directionsDisplayA.setDirections(result);
                    directionsDisplayA.setMap(map);
                    pathsA = result.routes[0].overview_path;
                    // pathsA = result.routes[0].legs[0].steps; //step[i].end_location, start_location

                    //routes are in: result.routes[0].overview_path <-- Array having latLng
                    //latlng1.equals(latlng2)
                } else {
                    alert("couldn't get directions:" + status);
                }
            });
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
            directionsService.route(requestB, function(result, status) {
                console.log('directions service route');
                console.log(result)
                console.log(status)
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplayB = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "blue"
                    }
                });
                    directionsDisplayB.setDirections(result);
                    directionsDisplayB.setMap(map);
                    pathsB = result.routes[0].overview_path;
                    // pathsB = result.routes[0].legs[0].steps; //step[i].end_location, start_location
                    //routes are in: result.routes[0].overview_path <-- Array having latLng
                    //latlng1.equals(latlng2)
                } else {
                    alert("couldn't get directions:" + status);
                }
            });
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
    console.log('getCommonPath called', pathsA, pathsB)
    if (pathsA.length === 0 || pathsB.length === 0) {
        alert('please choose paths first')
        return;
    }
    var idx, idxB;
    for (idx = 0; idx < pathsA.length; idx++) {
        for (idxB = 0; idxB < pathsB.length; idxB++) {
            if (pathsA[idx].equals(pathsB[idxB])) {
                console.log('something common')
                commonPaths.push(pathsA[idx]);
            }
        }
    }
    if (commonPaths.length !== 0) {
        // var poly;
        // var polyOptions = {
        //     strokeColor: '#000000',
        //     strokeOpacity: 1.0,
        //     strokeWeight: 3
        // }
        // poly = new google.maps.Polyline(polyOptions);
        // poly.setMap(map);
        // poly.setPath(commonPaths);
        getAddress(commonPaths[0],function (addr) {
            alert(addr)
        })
        getAddress(commonPaths[commonPaths.length-1],function (addr) {
            alert(addr)
        })
        var request = {
            origin: commonPaths[0],
            destination: commonPaths[commonPaths.length - 1],
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
            console.log('directions service route');
            console.log(result)
            console.log(status)
            if (status == google.maps.DirectionsStatus.OK) {
                commonDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "red"
                    }
                });
                commonDisplay.setDirections(result);
                commonDisplay.setMap(map);
            } else {
                alert("couldn't get directions:" + status);
            }
        })
    } else {
        alert('no common path found')
    }
}

function getAddress(latlng, cb) {
    var geocoder;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode(
        {'latLng': latlng}, 
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        var addr= results[0].formatted_address ;
                        cb(addr)
                    }
                    else  {
                        cb(null)
                    }
            }
            else {
                cb(null)
            }
        }
    );

}