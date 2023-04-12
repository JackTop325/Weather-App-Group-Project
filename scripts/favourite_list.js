/// Functions for the favourites list

// Stores the addresses of favourited cities
var favouriteCities = [];



// Load favourite location cookie data and display it
function initializeFavouritesList() {
  var cookieVal = getCookie('favourites');

  if (cookieVal !== null) {
    // Remove brackets and split with pipe
    cookieVal = cookieVal.replace(/\[|]/g, '');
    favouriteCities = cookieVal.split('|');
  } else {
    favouriteCities = [];
  }

  updateFavouriteLocations();
}



// Update favourite locations
function updateFavouriteLocations() {
  // Remove all current buttons on favourite
  $favouriteDiv = $('#favourite-list');
  $favouriteDiv.empty();

  for (city of favouriteCities) {
    cityName = city.split(',')[0];
    $newCityButton = $(`<a class="button is-fullwidth fav-city" data-fullname="${city}">${cityName}</a>`);
    $favouriteDiv.append($newCityButton);
  }
}

// Favourite a location
function addFavouriteLocation(location) {
  if (location == '' || favouriteCities.includes(location)) return;
  favouriteCities.push(location);
  updateFavouriteLocations();
  updateLocationCookie();
}

// Unfavourite a location
function removeFavouriteLocation(location) {
  if (location == '') return;
  favouriteCities = favouriteCities.filter(x => x !== location);
  updateFavouriteLocations();
  updateLocationCookie();
}




// Populate page with data from given address
function updateForecastWithFavouriteData(address) {
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
        $("#city-name").text(address);
      } else {
        console.log("Location not found");
      }
    },
    error: function (error) {
      console.log("Geocoding error: " + error);
    },
  });
}

// Update cookie that holds favourite location data
function updateLocationCookie() {
  var output = '[';
  for (city of favouriteCities) {
    output += `${city}|`;
  }
  output = `${output.slice(0, -1)}]`;
  setCookie('favourites', output);
}