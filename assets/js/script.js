
var weatherArray =[];
var locationArray =[];


var fetchWeatherData = function(lat, lon, loc, units) {

    var apiKey = "12afd4d18f110d35ce3359c3e1919c84";
    var forecastUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + units + "&appid=" + apiKey;

    fetch(forecastUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){
            weatherArray = data;
            console.log(weatherArray);
            console.log("Today's sunrise in " + loc + " is " + dayjs(new Date(weatherArray.current.sunrise*1000)).format("hh:mm A"));
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

var fetchLocationData = function(location) {

    var apiKey =  "f3daf114f7ab984d1e977c7fa53afcf7";
    var locationUrl = "http://api.positionstack.com/v1/forward?access_key=" + apiKey + "&query=" + location + "&output=json";


    fetch(locationUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data){
            locationArray = data;    
            console.log(locationArray);
            var lat =locationArray.data[0].latitude;
            var lon =locationArray.data[0].longitude;
            var loc = locationArray.data[0].name;
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

fetchLocationData("Mechanicsville,VA");


