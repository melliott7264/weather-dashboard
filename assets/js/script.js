
// function to retrieve weather data required for application
var fetchWeatherData = function(lat, lon, loc, units) {

    var apiKey = "12afd4d18f110d35ce3359c3e1919c84";
    var forecastUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&appid=" + apiKey;

    fetch(forecastUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){
            console.log(data);
            displayWeatherData(loc, data);
        });
        }  else {
            alert("Error: OpenWeather User Not Found");
        }
    })
    .catch(function(error){
        // notice this .catch() is getting chained on the end of the .then() method
        alert("Unable to connect to OpenWeather");
    });
};

// function to get location data for city entered in search box
var fetchLocationData = function(location) {

    if (!location) {
        var searchArray = [];
        var locationObj = {};

        // Search the saved city data for the last city added and use that for the search
        if (loadCityData()){
            searchArray = loadCityData();
            var lastSearchIndex = searchArray.length-1;
            location = searchArray[lastSearchIndex].loc;
        } else {
            // if there is no saved city data, default to my hometown
            location = "Mechanicsville,VA";
        }  

    }

    console.log("Passed location " + location);

    var apiKey =  "f3daf114f7ab984d1e977c7fa53afcf7";
    var locationUrl = "http://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + location + "&output=json";

    console.log("location URL " + locationUrl);

    fetch(locationUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){
            console.log(data);
            var lat =data.data[0].latitude;
            var lon =data.data[0].longitude;
            // var loc = data.data[0].name;
            var loc = location;

            // save city location data
            saveCityData(lat, lon, loc);

            // call fetch of weather data for current city
            fetchWeatherData(lat, lon, loc, "imperial");
        });
        }  else {
            alert("Error: positionstack User Not Found");
        }
    })
    .catch(function(error){
        console.log(error);
        // notice this .catch() is getting chained on the end of the .then() method
        alert("Unable to connect to positionstack");
    });
    
};

var displayWeatherData = function (loc, data) {

var currentWeatherEl = $(".current-weather");

// Start Clear Page
if ($(".search-btns")) {
    $(".search-btns").remove();
}
if ($(".current-weather-card")) {
    $(".current-weather-card").remove();
}
if ($(".forecast-header")) {
    $(".forecast-header").remove();
}
if ($(".forecast-weather")) {
    $(".forecast-weather").remove();
}
// End Clear Page

// Build Search Buttons
addSearchButtons();

// Build Current Weather Card
var currentWeatherCardEl = $("<div>").addClass("card current-weather-card");
currentWeatherEl.append(currentWeatherCardEl);

var currentWeatherHeaderEl = $("<h3>").addClass("card-header city-info text-center").text("Current Conditions ( " + dayjs(new Date()).format("MM/DD/YYYY") + " ) " + loc);
var currentWeatherIconEl = $("<img>").addClass("current-weather-icon").attr("src", "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png");
var currentWeatherTempEl = $("<p>").addClass("current-weather-data").text("Temperature: " + parseInt(data.current.temp) + " F" );
var currentWeatherWindEl = $("<p>").addClass("current-weather-data").text("Wind Speed: " + parseInt(data.current.wind_speed) + " MPH" );
var currentWeatherHumidityEl = $("<p>").addClass("current-weather-data").text("Humidity: " + data.current.humidity + " %" );
var currentWeatherUviEl = $("<p>").addClass("current-weather-data").text("UV Index: " + data.current.uvi);

currentWeatherCardEl.append(currentWeatherHeaderEl, currentWeatherIconEl, currentWeatherTempEl, currentWeatherWindEl, currentWeatherHumidityEl, currentWeatherUviEl);

var forecastWeatherHeaderEl = $("<h3>").addClass("card-header forecast-header col-12 col-xl-12 bg-info text-white").text("5 Day Forecast for " + loc);
var forecastWeatherCardEl = $("<div>").addClass("card row flex-row justify-content-around forecast-weather");
currentWeatherEl.append(forecastWeatherHeaderEl, forecastWeatherCardEl);

// Build Forecast Weather Cards
    for (i=0; i<5; i++){
        var forecastWeatherDayEl = $("<div>").addClass("card forecast-card-day col-12 col-xl-2");
        forecastWeatherCardEl.append(forecastWeatherDayEl);

        var forecastWeatherDayHeaderEl = $("<h4>").addClass("card-header text-center").text(dayjs(new Date(data.daily[i].dt*1000)).format("MM/DD/YY"));
        var forecastWeatherDayImgEl = $("<img>").addClass("forecast-weather-icon").attr("src", "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png");
        var forecastWeatherDayHiTempEl = $("<p>").addClass("forecast-weather-data").text("Hi: " + parseInt(data.daily[i].temp.max) + " F" );
        var forecastWeatherDayLoTempEl = $("<p>").addClass("forecast-weather-data").text("Lo: " + parseInt(data.daily[i].temp.min) + " F" );
        var forecastWeatherDayWindEl = $("<p>").addClass("forecast-weather-data").text("Wind: " + parseInt(data.daily[i].wind_speed) + " MPH" );
        var forecastWeatherDayHumidityEl = $("<p>").addClass("forecast-weather-data").text("Humidity: " + data.daily[i].humidity + " %" );
        var forecastWeatherDayUviEl = $("<p>").addClass("forecast-weather-data").text("UVI: " + data.daily[i].uvi);
        var forecastWeatherDaySunriseEl = $("<p>").addClass("forecast-weather-data").text("Sunrise: " + dayjs(new Date(data.daily[i].sunrise*1000)).format("h:mm A"));
        var forecastWeatherDaySunsetEl = $("<p>").addClass("forecast-weather-data").text("Sunset: " + dayjs(new Date(data.daily[i].sunset*1000)).format("h:mm A"));

        forecastWeatherDayEl.append(forecastWeatherDayHeaderEl, forecastWeatherDayImgEl, forecastWeatherDayHiTempEl, forecastWeatherDayLoTempEl, forecastWeatherDayWindEl, forecastWeatherDayHumidityEl, forecastWeatherDayUviEl, forecastWeatherDaySunriseEl, forecastWeatherDaySunsetEl);
    }
};

var addSearchButtons = function () {
    // add city search button
    var buttonContainerEl = $(".button-container");
    

    if (loadCityData()) {
        var buttonDivEl = $("<div>").addClass("search-btns");
        var searchArray = loadCityData();
        buttonContainerEl.append(buttonDivEl);

        for (i=0; i < searchArray.length; i++) {
            var searchCityButtonEl = $("<button>").addClass("btn search-btn bg-info text-white text-centered col-12 mt-3").text(searchArray[i].loc);
            buttonDivEl.append(searchCityButtonEl);
        }
    }
    return;
};

// function to save searched locations to localStorage
var saveCityData = function(lat, lon, loc) {
    // load the saved search data
    var searchArray = loadCityData();

    // check if location is already in the saved data.  If not, add it.
    if (searchArray) {
        // loop to interogate the saved location data
        for (i=0; i<searchArray.length; i++){
            // looking for the current location in the saved data.  If found, set a flag.
            if (searchArray[i].loc === loc) {
                var searchFlag = true;
            }
        }
        // check if current location is in saved data
        if (searchFlag) {
            return;  // if the current location is in saved date, return.
        } else { // if the current location is not in the saved data, add it.
            writeCityData(searchArray, lat, lon, loc);
        }

    } else {
        // A saved search data file did not exist,  save one.
        writeCityData(searchArray, lat, lon, loc);
    }     
    return;
};

var writeCityData = function (searchArray, lat, lon, loc) {
    var tempLocationObj = {
        lat: lat,
        lon: lon,
        loc: loc
    }
    if (!searchArray) {
        searchArray = []; // initialize a false searchArray
    }
    searchArray.push(tempLocationObj);
    localStorage.setItem("search", JSON.stringify(searchArray));
 
    return;
};
   
var loadCityData = function () {
    if (localStorage.getItem("search")) {
        var searchArray = JSON.parse(localStorage.getItem("search"));
        return searchArray;
    } else {
        return false;
    }
}

$("#submit-btn").on("submit", function (){
    console.log("clicked submit button");
    fetchLocationData($("#city-input").val().trim());
})

$(".button-container").on("click", function(event) {
    console.log("A search button was clicked");
    fetchLocationData(event.target.value);
});

fetchLocationData();
