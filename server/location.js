const axios = require('axios');

const mapBoxAccessToken =
  "pk.eyJ1IjoiamFja3RvcCIsImEiOiJjbGEzMDdkeHkwZXFvM3FvYzJyNnQ1cTY5In0.DF-KCqd2MVSkAcSGE1xS0A";

// geoCoding Function
// Uses the mapbox API to retrieve the latitude and longitude of a given location.
async function geoCoding(address) {
  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapBoxAccessToken}`);
    if (response.data.features.length !== 0) {
      const latitude = response.data.features[0].center[1];
      const longitude = response.data.features[0].center[0];
      const cityName = address;
      console.log({latitude, longitude, cityName});
      return {latitude, longitude, cityName};
    } else {
      console.log("Location not found");
    }
  } catch (error) {
    console.log("Geocoding error: " + error);
    throw error;
  }
}

// getting location suggestion Function
// Uses the mapbox API to retrieve the latitude and longitude of a given location.
async function getSuggestion(address) {
  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapBoxAccessToken}&limit=5`);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error fetching city suggestions:", error);
    throw error;
  }
}

// geolocation Function
// Uses the mapbox API to retrieve the city name given longitude and latitude.
async function geolocation(latitude, longitude) {
  try {
    const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapBoxAccessToken}`);
    if (response.data.features.length !== 0) {
      const cityName = response.data.features[0].context.filter(function (context) {
        return context.id.startsWith("place");
      })[0].text;
      console.log(cityName);
      return cityName;
    } else {
      console.log("Location not found");
    }
  } catch (error) {
    console.log("Geocoding error: " + error);
    throw error;
  }
}

// getWeather Function
// Uses open-meteo's API to fetch weather information from a given latitude and longitude
// Result is stored in data
async function getWeather(latitude, longitude) {
  try {
    const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=apparent_temperature,relativehumidity_2m,weathercode,temperature_2m,precipitation_probability,precipitation,windspeed_10m,cloudcover,dewpoint_2m,uv_index&timezone=America%2FNew_York`;
    const response = await axios.get(endpoint);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log("Could not get weather information. Error:", error);
    throw error;
  }
}

module.exports = {
  geoCoding,
  getSuggestion,
  geolocation,
  getWeather
};
