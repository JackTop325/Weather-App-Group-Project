var latitude;
var longitude;

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
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            // console.log("Latitude: " + latitude + ", Longitude: " + longitude);
            getWeatherInfo();
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
          // console.log("Latitude: " + latitude + ", Longitude: " + longitude);
          getWeatherInfo();
        },
        error: function(error) {
          console.log("Geocoding error: " + error);
        }
    });
}

function getWeatherInfo(){
    $.ajax({
        url: "https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m&timezone=America%2FNew_York",
        type: "GET",
        dataType: "json",
        success: function(data) {
          console.log(data);
        },
        error: function(error) {
          console.log("Could not get weather information, Error:" + error);
        }
    }); 
}

