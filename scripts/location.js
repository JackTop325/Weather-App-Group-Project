var latitude;
var longitude;
var mapBoxAccessToken =
  "pk.eyJ1IjoiamFja3RvcCIsImEiOiJjbGEzMDdkeHkwZXFvM3FvYzJyNnQ1cTY5In0.DF-KCqd2MVSkAcSGE1xS0A";

$(document).ready(function () {
  getLocation();

  $("#search").click(function (event) {
    event.preventDefault();
    $("#city-name").text($("#city").val());
    geoCoding();
  });

  $("#toggle").change(function () {
    updateWeather(data);
  });
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      // console.log("Latitude: " + latitude + ", Longitude: " + longitude);
      geolocation();
      getWeatherInfo(latitude, longitude)
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function geoCoding() {
  var address = $("#city").val();

  $.ajax({
    url:
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(address) +
      ".json?access_token=" +
      mapBoxAccessToken,
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

function geolocation() {
  $.ajax({
    url:
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      longitude +
      "," +
      latitude +
      ".json?access_token=" +
      mapBoxAccessToken,
    type: "GET",
    dataType: "json",
    success: function (data) {
      const city = data.features[0].context.filter((context) =>
        context.id.startsWith("place")
      )[0].text;
      // console.log("Current Location: " + city);
      $("#city-name").text(city);
    },
    error: function (error) {
      console.log("Geolocation error: " + error);
    },
  });
}

function getWeatherInfo(latitude, longitude) {
  var endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&hourly=weathercode,temperature_2m,precipitation_probability,precipitation,windspeed_10m&timezone=America%2FNew_York`;
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
  const tempInCelsius = data.hourly.temperature_2m[new Date().getHours()].toFixed(1);
  const tempInFahrenheit = ((tempInCelsius * 9) / 5 + 32).toFixed(1);
  const tempDisplay = $("#toggle").is(":checked")
    ? tempInFahrenheit + "°F"
    : tempInCelsius + "°C";
  // Update Temperature
  $("#current-temperature").text(tempDisplay);
  // Update Precipitation
  $("#precipitation-percentage").text(
    "Precipitation: " + data.hourly.precipitation_probability[new Date().getHours()] + "%"
  );
  // Update Windspeed
  $("#windspeed").text(
    "Windspeed: " + (data.hourly.windspeed_10m[new Date().getHours()] * 3.6).toFixed(1) + " km/h"
  );
  // Update Weather Icon
  const weatherCode = data.hourly.weathercode[new Date().getHours()];
  var weatherIcon = getWeatherIcon(weatherCode, data.daily.sunrise[new Date().getHours()], data.daily.sunset[new Date().getHours()]);
  $("#weather-icon").attr("src", 'images/icons/' + weatherIcon);
}

function getWeatherIcon(code, sunrise, sunset) {
  const currTime = new Date();
  const sunriseTime = new Date(sunrise * 1000);
  const sunsetTime = new Date(sunset * 1000);
  const isDay = currTime >= sunriseTime && currTime <= sunsetTime;

  if (code >= 0 && code <= 2 && isDay) {
    return "sun.png";
  }
  if (code >= 0 && code <= 2 && !isDay) {
    return "night.png";
  }
  if (code == 3 && isDay) {
    return "partly-cloudy.png";
  }
  if (code == 3 && !isDay) {
    return "cloudy-night.png";
  }
  if (code >= 4 && code <= 12 || code == 28 || code >= 40 && code <= 49) {
    return "fog.png";
  }
  if (code >= 13 && code <= 19){
    return "cloud.png";
  }
  if (code >= 20 && code <= 21 || code >= 60 && code <= 69 || code >= 80 && code <= 84 || code >= 91 && code <= 94) {
    return "rain.png";
  }
  if (code >= 22 && code <= 24 || code >= 26 && code <= 39 || code >= 70 && code <= 79 || code >= 85 && code <= 90) {
    return "snow.png";
  }
  if (code >= 25 && code <= 27) {
    return "storm.png";
  }
  if (code == 29 || code >= 95 && code <= 99) {
    return "lightning-storm.png";
  }
  if (code >= 50 && code <= 59) {
    return "drizzle.png";
  }
  else {
    return "unknown.png";
  }
}