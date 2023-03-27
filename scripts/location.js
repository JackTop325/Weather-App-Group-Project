var longitude;
var latitude;

$(document).ready(function() {
    getLocation();

    $('#search').click(function(event){
        event.preventDefault();
        geoCoding();
    });
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
}

function geoCoding() {
    var address = $("#city").val();
    var accessToken = "pk.eyJ1IjoiamFja3RvcCIsImEiOiJjbGEzMDdkeHkwZXFvM3FvYzJyNnQ1cTY5In0.DF-KCqd2MVSkAcSGE1xS0A";
    var endpoint = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=" + accessToken;

    $.ajax({
        url: endpoint,
        type: "GET",
        dataType: "json",
        success: function(data) {
          latitude = data.features[0].center[1];
          longitude = data.features[0].center[0];
          console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        },
        error: function(error) {
          console.log("Geocoding error: " + error);
        }
    });
}
  

