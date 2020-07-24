//Declarations for Global
var cityList = [];
var cityname;

//Stored in Local Functions
initCityList();
initWeather();



function  renderActualCities(){
    $("#cityList").empty();
    $("#cityInput").val("");
    
    for (i=0; i<cityList.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityList[i]);
        a.text(cityList[i]);
        $("#cityList").prepend(a);
    } 
}

// This function pulls local storage city
function initCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (storedCities !== null) {
        cityList = storedCities;
    }
    
    renderActualCities();
    }

//Function pulls current city and puts into Local storage 
function initWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (storedWeather !== null) {
        cityname = storedWeather;

        displayWeather();
        displayForecastFiveDay();
    }
}


function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(cityList));
    console.log(cityList);
    }

function storeActualCity() {

    localStorage.setItem("currentCity", JSON.stringify(cityname));
    console.log(cityname);
}
      


$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    // If user tries to select search button with out typing in  city, alert will pop up
    cityname = $("#cityInput").val().trim();
    if(cityname === ""){
        alert("Please enter a city to look up")

    }else if (cityList.length >= 5){  
        cityList.shift();
        cityList.push(cityname);

    }else{
    cityList.push(cityname);
    }
    storeActualCity();
    storeCityArray();
    renderActualCities();
    displayWeather();
    displayForecastFiveDay();
});

// Handler for user to use in case other option is chosen 
$("#cityInput").keypress(function(e){
    if(e.which == 13){
        $("#citySearchBtn").click();
    }
})

// Function displays actual city and current weather 
async function displayWeather() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
        console.log(response);

        // Current weahter Div Variable

        var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");


        // Current city Variable


        var getCurrentCity = response.name;

         // Current date Variable & the new date is intiated by day

        var date = new Date();

        //  Variable pulls month, date , and full year to generate

        var val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();

         //  whether Icon Variable uses "response" to generate 

        var getWeatherIcon  = response.weather[0].icon;
        console.log(getWeatherIcon);

         //  whether Icon Variable display wheather  img from http://openweathermap.org/img/wn/ source

        var displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getWeatherIcon  + "@2x.png />");

        //  Actual city element Variable uses getCurrentCity generate value

        var currentCityEl = $("<h3 class = 'card-body'>").text(getCurrentCity+" ("+val+")");

        currentCityEl.append(displayCurrentWeatherIcon);

        currentWeatherDiv.append(currentCityEl);
        var grabTemp = response.main.temp.toFixed(1);


 
        var tempEl = $("<p class='card-text'>").text("Temperature: "+grabTemp +"° F");
        currentWeatherDiv.append(tempEl);

        var grabHumidity = response.main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+grabHumidity+"%");
        currentWeatherDiv.append(humidityEl);

           //  City humidity element Variable gets wind speed
        var getWindSpeed = response.wind.speed.toFixed(1);
        console.log(getWindSpeed);

        var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        currentWeatherDiv.append(windSpeedEl);

           //  long Variable get response 
        var getLong = response.coord.lon;

        var getLat = response.coord.lat;
        console.log(getLat);

        
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=d3b85d453bf90d469c82e650a0a3da26&lat="+getLat+"&lon="+getLong;
        var uvResponse = await $.ajax({
            url: uvURL,
            method: "GET"
        })

        // obtains UV index
        var getUVIndex = uvResponse.value;
        var uvIndex = $("<span>");
        if (getUVIndex > 0 && getUVIndex <= 2.99){
            uvIndex.addClass("low");
            console.log(getUVIndex);
        }else if(getUVIndex >= 3 && getUVIndex <= 5.99){
            uvIndex.addClass("moderate");
            console.log(getUVIndex);
        }else if(getUVIndex >= 6 && getUVIndex <= 7.99){
            uvIndex.addClass("high");
            console.log(getUVIndex);
        }else if(getUVIndex >= 8 && getUVIndex <= 10.99){
            uvIndex.addClass("vhigh");
            console.log(getUVIndex);
        }else{
            uvIndex.addClass("extreme");
        } 
        uvIndex.text(getUVIndex);
        var uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
        uvIndex.appendTo(uvIndexEl);
        currentWeatherDiv.append(uvIndexEl);
        $("#weatherContainer").html(currentWeatherDiv);
        console.log(currentWeatherDiv);
}

async function displayForecastFiveDay() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
      var forecastDiv = $("<div  id='fiveDayForecast'>");
      var forecastHead = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
      forecastDiv.append(forecastHead);
      var formDeck = $("<div  class='card-deck'>");
      forecastDiv.append(formDeck);
      console.log(formDeck);
      
      console.log(response);
      for (i=0; i<5;i++){
          var forecastForm = $("<div class='card mb-3 mt-3'>");
          var cardBody = $("<div class='card-body'>");
          var date = new Date();
          var val=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
          var forecastDate = $("<h5 class='card-title'>").text(val);
          
        cardBody.append(forecastDate);
        var getWeatherIcon  = response.list[i].weather[0].icon;
        console.log(getWeatherIcon );
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getWeatherIcon + ".png />");
        cardBody.append(displayWeatherIcon);

       //  Grabs temp Variable response from main list 
        var grabTemp = response.list[i].main.temp;
        var tempEl = $("<p class='card-text'>").text("Temp: "+grabTemp +"° F");
        cardBody.append(tempEl);
        var grabHumidity = response.list[i].main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+grabHumidity+"%");

        // will append form/card body to with humidity element
        cardBody.append(humidityEl);
        forecastForm.append(cardBody);
        formDeck.append(forecastForm);
        console.log(forecastDate);
      }
      $("#forecastContainer").html(forecastDiv);
    }

function showHistoryWeather(){
    cityname = $(this).attr("data-name");
    displayWeather();
    displayForecastFiveDay();
    console.log(cityname);
    
}

$(document).on("click", ".city", showHistoryWeather);