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

// Update cookie that holds favourite location data
function updateLocationCookie() {
  var output = '[';
  for (city of favouriteCities) {
    output += `${city}|`;
  }
  output = `${output.slice(0, -1)}]`;
  setCookie('favourites', output);
}