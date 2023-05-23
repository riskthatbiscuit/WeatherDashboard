const APIKey = "4c40bc90efb07222ff1d873fc634eb67";
const searchForm = document.querySelector("#searchForm");
const currentLoc = document.querySelector("#currentLoc");
const currentDateElement = document.querySelector("#currentDate");
const currentSymb = document.querySelector("#currentSymb");
const currentTemp = document.querySelector("#currentTemp");
const currentWind = document.querySelector("#currentWind");
const currentHum = document.querySelector("#currentHum");
const history = document.querySelector("#history");
const forecast = document.querySelector("#forecast");
let cityList = JSON.parse(localStorage.getItem("cityList")) || [];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


searchForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    console.log("Get this started");
    currentCity();
});

// Move the queryURL inside the forecastCity function
function currentCity () {
    const city = document.querySelector("#citySrch").value;
    const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";
    
    fetch(queryURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonData) {
        const pulledData = jsonData;
        loadWeather(pulledData);
    });
    
    forecastCity();
}


function forecastCity() {
    const city = document.querySelector("#citySrch").value;
    const queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=metric";
    
    fetch(queryURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonData) {
        const pulledData = jsonData;
        loadForecast(pulledData);
    });
    
    logCity(city);
}

function reload(cityOld) {
    document.querySelector("#citySrch").value = cityOld;
    currentCity()
}

// LOCAL STORAGE

function logCity(city){
    // Check if the city already exists in the cityList
    const existingIndex = cityList.indexOf(city);
    if (existingIndex !== -1) {
        // If the city exists, remove it from its current position
        cityList.splice(existingIndex, 1);
    }
    
    cityList.unshift(city);
    cityList = cityList.slice(0, 5);
    
    // Remove all children of history element
    while (history.firstChild) {
        history.removeChild(history.firstChild);
    }
    
    for (let i = 0; i < cityList.length; i++) {
        (function(eachCity) {
            var cityHist = document.createElement("p");
            cityHist.textContent = eachCity;
            history.appendChild(cityHist);
            cityHist.addEventListener("click", function() {
                reload(eachCity);
            });
        })(cityList[i]);
    }
}

// Load Current Weather
const currentDate = new Date().toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true });

function loadWeather(pulledData) {
    currentLoc.innerHTML = pulledData.name;
    currentDateElement.innerHTML = currentDate;
    currentSymb.src = "http://openweathermap.org/img/w/" + pulledData.weather[0].icon + ".png";
    currentSymb.alt = pulledData.weather[0].description;
    currentTemp.innerHTML = "Temp: " + pulledData.main.temp + "°C";
    currentWind.innerHTML = "Wind: " + pulledData.wind.speed + "m/s";
    currentHum.innerHTML = "Humidity: " + pulledData.main.humidity + "%";
}

// Load Forecast Weather

function loadForecast(pulledData) {

    // Remove existing forecast
    while (forecast.firstChild) {
        forecast.removeChild(forecast.firstChild);
    }

    // Array to store the reference points for midday of the next 5 days
    // Required as API is limited to forecast every 3 hours, not daily. Assumption made that midday sufficient
    const days5 = []; 
    var currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0);

    // Iterate through the forecast data and find the next 5 midday reference points
    for (let i = 1; i <= 5; i++) {
        // Calculate the target date by adding 'i' days to the current date
        var targetDate = new Date(currentDate);
        targetDate.setDate(targetDate.getDate() + i);
        targetDate.setHours(12, 0, 0, 0);

        // Find the index of the forecast data that matches the target date and time
        var targetIndex = pulledData.list.findIndex(item => {
            var itemDate = new Date(item.dt_txt);
            return itemDate.getTime() === targetDate.getTime();
        });

        // If the index is found, add it to the days5 array
        if (targetIndex !== -1) {
            days5.push(targetIndex);
        }
    }

    // Iterate through each of the midday points to populate dayCards
    for (let i =0; i < 5; i++) {
        var dayCard = document.createElement("div");
        dayCard.className = "dayCard";

        var dayCardName = document.createElement("p");
        dayCardName.className = "dayName"
        var dayCardDate = document.createElement("p");
        var dayCardSymb = document.createElement("img");
        var dayCardTemp = document.createElement("p");
        var dayCardWind = document.createElement("p");
        var dayCardHum = document.createElement("p");

        forecast.appendChild(dayCard);
        dayCard.appendChild(dayCardName);
        dayCard.appendChild(dayCardDate);
        dayCard.appendChild(dayCardSymb);
        dayCard.appendChild(dayCardTemp);
        dayCard.appendChild(dayCardWind);
        dayCard.appendChild(dayCardHum);

        // Parse the date from the response
        var date = new Date(pulledData.list[days5[i]].dt_txt);
        // Get the day of the week
        var dayOfWeek = days[date.getDay()];
        // Get the date in the format "MM/DD"
        var formattedDate = (date.getMonth() + 1) + "/" + date.getDate();


        // Update each of the card elements with values
        dayCardDate.innerHTML = formattedDate;
        dayCardName.innerHTML = dayOfWeek;
        dayCardSymb.src = "http://openweathermap.org/img/wn/" + pulledData.list[days5[i]].weather[0].icon + ".png";
        dayCardSymb.alt = pulledData.list[days5[i]].weather[0].description;
        dayCardTemp.innerHTML = "Temp: " + pulledData.list[days5[i]].main.temp + "°C";
        dayCardWind.innerHTML = "Wind: " + pulledData.list[days5[i]].wind.speed + "m/s";
        dayCardHum.innerHTML = "Humidity: " + pulledData.list[days5[i]].main.humidity+ "%";
    }
}