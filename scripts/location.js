var latitude;
var longitude;
var mapBoxAccessToken =
  "pk.eyJ1IjoiamFja3RvcCIsImEiOiJjbGEzMDdkeHkwZXFvM3FvYzJyNnQ1cTY5In0.DF-KCqd2MVSkAcSGE1xS0A";
var data;

// Document Ready
// Handles click events onload
$(document).ready(function () {
  getLocation();
  initializeFavouritesList();

  $("#search").click(function (event) {
    // Prevent the default action of the click event (e.g., form submission) from executing
    event.preventDefault();
    // Get the value (city name) from the input field with the ID "city"
    const cityName = $("#city").val();
    // Check if the city name is not empty
    if (cityName) {
      // Get the selected city object, which was previously stored as data on the input field
      const selectedCity = $("#city").data("selectedCity");
      // Check if the selected city exists and its label matches the entered city name
      if (selectedCity && selectedCity.label === cityName) {
        // If true, set the latitude and longitude from the selected city object
        latitude = selectedCity.center[1];
        longitude = selectedCity.center[0];
      } else {
        // If false, call the geoCoding() function to fetch the latitude and longitude
        geoCoding();
      }
      // Call the getWeather() function to fetch weather information for the city
      getWeather(latitude, longitude);
      // Update the text content of the element with the ID "city-name" to display the entered city's name
      $("#city-name").text(cityName);
    }
  });


  $("#toggle").change(function () {
    updateWeather(data);
  });

  $("#advanced-toggle").change(function () {
    if ($(this).is(":checked")) {
      $("#advanced-info").removeClass("is-hidden");
    } else {
      $("#advanced-info").addClass("is-hidden");
    }
  });

  // Initialize the Autocomplete widget
  $("#city").autocomplete({
    // Set the source function to fetch city suggestions using the getCitySuggestions function
    source: getCitySuggestions,
    // Set the minimum number of characters required to trigger the Autocomplete suggestions
    minLength: 1,
    // Define a function to execute when a suggestion is selected from the list
    select: function (event, ui) {
      // Set the value of the input field to the selected city's name
      $("#city").val(ui.item.value);
      // Store the selected city object as data on the input field for future reference
      $("#city").data("selectedCity", ui.item);
      // Extract the latitude and longitude of the selected city
      latitude = ui.item.center[1];
      longitude = ui.item.center[0];
      // Call the getWeather function to fetch weather information for the selected city
      getWeather(latitude, longitude);
      // Update the text content of the element with the ID "city-name" to display the selected city's name
      $("#city-name").text(ui.item.value);
      // Prevent the default action of the select event from executing
      return false;
    },
  });

  $("#add-fav").click(function() {addFavouriteLocation($('#city-name').text());} );
  $("#rmv-fav").click(function() {removeFavouriteLocation($('#city-name').text());} );
  $(document).on('click', ".fav-city", function() {
    updateForecastWithFavouriteData($(this).attr('data-fullname'));
  } );
});

// getCitySuggestions Function
// Fetches city name suggestions based on the input query using Mapbox API
function getCitySuggestions(request, callback) {
  // Extract the search term from the request
  const query = request.term;
  // Construct the Mapbox Geocoding API URL with the search term and access token
  const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${mapBoxAccessToken}&limit=5`;

  // Make an AJAX request to the Mapbox Geocoding API
  $.ajax({
    url: mapboxGeocodingUrl,
    type: "GET",
    dataType: "json",
    // If the request is successful, process the data
    success: function (data) {
      // Filter out features that are not cities and create a list of suggestion objects
      const suggestions = data.features
        .filter(feature => feature.place_type.includes("place"))
        .map(function (feature) {
          // Create a suggestion object with label, value, and center properties
          return {
            label: feature.place_name,
            value: feature.place_name,
            center: feature.center,
          };
        });
      // Pass the list of suggestions to the callback function
      callback(suggestions);
    },
    // If the request fails, log the error
    error: function (error) {
      console.log("Error fetching city suggestions:", error);
    },
  });
}

// getLocation Function
// Geolocates the user's current position. Retreives their latitude and longitude
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      geolocation();
      getWeather(latitude, longitude)
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// updateSevenDayForecast Function
// Updates the 7-day forecast, displaying highs and lows for each day.
function updateSevenDayForecast(data) {
  const forecastDays = 7;
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const forecastDiv = $(".column.right .box");

  // Clear previous forecast
  forecastDiv.find(".forecast-day").remove();

  const today = new Date();

  for (let i = 0; i < forecastDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const day = daysOfWeek[date.getDay()];
    const tempMax = Math.round(data.daily.temperature_2m_max[i].toFixed(1));
    const tempMin = Math.round(data.daily.temperature_2m_min[i].toFixed(1));
    const dayDiv = $("<div>").addClass("forecast-day");
    const dayName = $("<h4>").text(day);
    const tempRange = $("<p>").text(`${tempMax}°C / ${tempMin}°C`);

    dayDiv.append(dayName, tempRange);
    forecastDiv.append(dayDiv);
  }
}

// geoCoding Function
// Uses the mapbox API to retreive the latitude and longitude of a given location.
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
      if (data.features.length != 0) {
        latitude = data.features[0].center[1];
        longitude = data.features[0].center[0];
        getWeather(latitude, longitude);
        $("#city-name").text($("#city").val());
      } else {
        console.log("Location not found");
      }
    },
    error: function (error) {
      console.log("Geocoding error: " + error);
    },
  });
}

// geoLocation Function
// Uses the mapbox API to retrieve the city name given longitude and latitude.
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

// getWeather Function
// Uses open-meteo's API to fetch weather information from a given latitude and longitude
// Result is stored in data
function getWeather(latitude, longitude) {
  var endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=apparent_temperature,relativehumidity_2m,weathercode,temperature_2m,precipitation_probability,precipitation,windspeed_10m,cloudcover,dewpoint_2m,uv_index&timezone=America%2FNew_York`;

  $.ajax({
    url: endpoint,
    type: "GET",
    dataType: "json",
    success: function (d) {
      data = d;
      console.log(data);
      updateWeather(data); // Update displayed weather using fetched data
      updateSevenDayForecast(data); // Update 7-day forecast using fetched data
      drawTemperatureChart(data); // Add this line
    },
    error: function (error) {
      console.log("Could not get weather information, Error:" + error);
    },
  });
}

// updateWeather Function
// Updates the displayed weather information with searched location
function updateWeather(data) {
  // Calculate temperature 
  const tempInCelsius = Math.round(data.hourly.temperature_2m[new Date().getHours()].toFixed(1));
  const tempInFahrenheit = Math.round(((tempInCelsius * 9) / 5 + 32).toFixed(1));
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
    "Windspeed: " + (data.hourly.windspeed_10m[new Date().getHours()]).toFixed(1) + " km/h"
  );
  // Update Humidity
  $("#humidity").text(
    "Humidity: " + Math.round((data.hourly.relativehumidity_2m[new Date().getHours()]).toFixed(1)) + "%"
  );
  // Update Weather Icon
  const weatherCode = data.hourly.weathercode[new Date().getHours()];
  //console.log(weatherCode);
  var weatherIcon = getWeatherIcon(weatherCode, data.daily.sunrise[new Date().getHours()], data.daily.sunset[new Date().getHours()]);
  $("#weather-icon").attr("src", 'images/icons/' + weatherIcon);
  // Update forecast
  const currentHour = new Date().getHours();
  const nextNineHoursTemperatures = [];
  for (let i = 0; i <= 8; i++) {
    const hourIndex = (currentHour + i) % 24;
    nextNineHoursTemperatures.push(data.hourly.temperature_2m[hourIndex]);
  }
  updateForecast(nextNineHoursTemperatures);

  // Update Advanced Information
  $("#cloud-cover").text(
    "Cloud Cover: " + data.hourly.cloudcover[new Date().getHours()] + "%"
  );
  $("#dewpoint").text(
    "Dewpoint: " + data.hourly.dewpoint_2m[new Date().getHours()].toFixed(1) + "°C"
  );
  $("#uv-index").text(
    "UV Index: " + data.hourly.uv_index[new Date().getHours()].toFixed(1)
  );
}

// updateForecast Function
// Updates the upcoming forecast. Displays the current hour and the next 8 hours after it.
function updateForecast(temperatures) {
  const forecast = $('#forecast-container');
  forecast.empty();
  // Iterate through temperatures
  for (let i = 0; i <= 8; i++) {
    // Convert time to 12hr time
    const hour = new Date().getHours() + i;
    const displayHour = hour % 12 || 12;
    const hourSuffix = hour < 12 || hour >= 24 ? "AM" : "PM";
    const temp = Math.round(temperatures[i].toFixed(1)) + "°C";
    // Add time + temp to container
    const forecastItem = $('<div>').addClass('forecast-item');
    const hourText = $('<p>').html('<strong>' + displayHour + ':00 ' + hourSuffix + '</strong>');
    const tempText = $('<p>').text(temp);
    forecastItem.append(hourText, tempText);
    forecast.append(forecastItem);
  }
}

// getWeatherIcon Function
// Using the WMO code from open-meteo's API, display the corresponding weather icon
function getWeatherIcon(code, sunrise, sunset) {
  // Code & Time Cases
  if (code >= 0 && code <= 2) {
    return "sun.png";
  }
  if (code == 3) {
    return "partly-cloudy.png";
  }
  if (code >= 4 && code <= 12 || code == 28 || code >= 40 && code <= 49) {
    return "fog.png";
  }
  if (code >= 13 && code <= 19) {
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

