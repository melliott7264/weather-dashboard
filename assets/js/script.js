
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

    var apiKey =  "f3daf114f7ab984d1e977c7fa53afcf7";
    var locationUrl = "http://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + location + "&output=json";


    fetch(locationUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){
            console.log(data);
            var lat =data.data[0].latitude;
            var lon =data.data[0].longitude;
            var loc = data.data[0].name;

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
        // notice this .catch() is getting chained on the end of the .then() method
        alert("Unable to connect to positionstack");
    });
    
};

var displayWeatherData = function (loc, data) {
    console.log(loc);
    console.log(dayjs(new Date()).format("MM/DD/YYYY"));
    console.log(data.current.weather[0].icon);
    console.log("Current Temp: " + data.current.temp);
    console.log("Current Humidity: " + data.current.humidity);
    console.log("Wind speed: " + data.current.wind_speed);
    console.log("Current UVI: " + data.current.uvi);
    console.log("Sunrise " + dayjs(new Date(data.current.sunrise*1000)).format("hh:mm A"));
    for (i=0; i<5; i++){
        console.log(dayjs(new Date(data.daily[i].dt*1000)).format("MM/DD/YYYY"));
        console.log(data.daily[i].weather[0].icon);
        console.log("Daytime Temp: " + data.daily[i].temp.day);
        console.log("Wind speed: " + data.daily[i].wind_speed);
        console.log("Humidity: " + data.daily[i].humidity);
    }
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
        // if the current location is not in the saved data, add it.
        if (searchFlag) {
            return;
        }

    } else {
        // A saved search data file did not exist,  save one.
        var tempArray = [];
        var tempLocationObj = {
            lat: lat,
            lon: lon,
            loc: loc
        }
        tempArray.push(tempLocationObj);
        localStorage.setItem("search", JSON.stringify(tempArray));
    }           
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

fetchLocationData("Mechanicsville,VA");


