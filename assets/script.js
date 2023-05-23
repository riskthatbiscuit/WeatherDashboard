var APIKey = "ce2a80e4badc9c86136b1d15faae58b9";

// Move the queryURL inside the updateCity function
function updateCity() {
    const city = document.querySelector("#citySrch").value; // Use .value to get the input value
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
  
  console.log(city);
  fetch(queryURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(jsonData) {
      const pulledData = jsonData;
      console.log(pulledData);
    });

    logCity(city);
}


// LOCAL STORAGE
let cityList = JSON.parse(localStorage.getItem("cityList")) || [];
const history = document.querySelector("#history");

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

function reload(cityOld) {
    document.querySelector("#citySrch").value = cityOld;
    updateCity()
}





const searchBtn = document.querySelector("#searchBtn");
searchBtn.addEventListener("click", updateCity);
