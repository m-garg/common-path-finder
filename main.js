/*global google*/

var initialCenter = new google.maps.LatLng(30.36093378427712, 76.39173746109009);
var map;
var path= [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
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
    directionsDisplay = new google.maps.DirectionsRenderer();

    // var marker = new google.maps.Marker({
    //     position: initialCenter
    // });

    // marker.setMap(map);
    google.maps.event.addListener(map, 'click', function(event) {
        console.log(event);
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
        
        
        if(path.length === 2){
            var request = {
                origin: path[0],
                destination: path[1],
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(result, status) {
                console.log('directions service route');
                console.log(result)
                console.log(status)
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                    directionsDisplay.setMap(map);
                    //routes are in: result.routes[0].overview_path <-- Array having latLng
                    //latlng1.equals(latlng2)
                } else {
                    console.log("couldn't get directions:" + status);
                }
            });            
        }else if(path.length < 2){
            path.push(event.latLng)
            placeMarker(event.latLng);
        }
    });


}
google.maps.event.addDomListener(window, 'load', initialize);