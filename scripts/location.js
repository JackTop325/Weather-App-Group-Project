var latitude;
var longitude;

$(document).ready(function () {
  getLocation();

  $("#search").click(function (event) {
    event.preventDefault();
    geoCoding();
  });

  $("#toggle").change(function () {
    updateWeather(data);
  });
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        getWeatherInfo(latitude, longitude);
      },
      function (error) {
        console.warn("Error(" + error.code + "): " + error.message);
        latitude = 43.898594;
        longitude = -78.85666;
        getWeatherInfo(latitude, longitude);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    latitude = 43.898594;
    longitude = -78.85666;
    getWeatherInfo(latitude, longitude);
  }
}

function geoCoding() {
  var address = $("#city").val();
  var accessToken =
    "pk.eyJ1IjoiamFja3RvcCIsImEiOiJjbGEzMDdkeHkwZXFvM3FvYzJyNnQ1cTY5In0.DF-KCqd2MVSkAcSGE1xS0A";
  var endpoint =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=" +
    accessToken;

  $.ajax({
    url: endpoint,
    type: "GET",
    dataType: "json",
    success: function (data) {
      latitude = data.features[0].center[1];
      longitude = data.features[0].center[0];
      getWeatherInfo(latitude, longitude);
    },
    error: function (error) {
      console.log("Geocoding error: " + error);
    },
  });
}

function getWeatherInfo(latitude, longitude) {
  var endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m&timezone=America%2FNew_York`;
  $.ajax({
    url: endpoint,
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      updateWeather(data);
    },
    error: function (error) {
      console.log("Could not get weather information, Error:" + error);
    },
  });
}

function updateWeather(data) {
  $("#city-name").text($("#city").val());
  const tempInCelsius = data.hourly.temperature_2m[0].toFixed(1);
  const tempInFahrenheit = ((tempInCelsius * 9) / 5 + 32).toFixed(1);
  const tempDisplay = $("#toggle").is(":checked")
    ? tempInFahrenheit + "°F"
    : tempInCelsius + "°C";

  $("#current-temperature").text(tempDisplay);
  $("#precipitation-percentage").text(
    "Precipitation: " + data.hourly.precipitation_probability[0] + "%"
  );
  $("#windspeed").text(
    "Windspeed: " + (data.hourly.windspeed_10m[0] * 3.6).toFixed(1) + " km/h"
  );
}
