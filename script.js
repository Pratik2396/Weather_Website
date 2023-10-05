//Get all necessary elements from the DOM
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const countryOutput = document.querySelector('.country');
const regionOutput = document.querySelector('.region');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');



// Default city when the page Loads
let cityInput = "Pune";

// Fetch the user's location using Geolocation API
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    // Use the latitude and longitude to fetch the city name from a reverse geocoding service
    // In this example, I'm using OpenCage Geocoding API.
    const apiKey = '7f8fad8b660d4731962a4752810e0d0b';
    const reverseGeocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    fetch(reverseGeocodingUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('Reverse geocoding data:',data);
        if (data.results && data.results.length > 0) {
            const components = data.results[0].components;
            console.log('Components:', components);
  
            // Check if the components object has a city property
            //It has village property
            const city = components.village || components.city ;

            //print the city name on console for debugging purpose
            console.log('Extracted City:', city);
          cityInput = city || "Pune";
        }

        // Fetch weather data using the default city
        fetchWeatherData();
      })
      .catch((error) => {
        console.error('Error fetching location:', error);

        // Fetch weather data using the default city if there's an error fetching location
        fetchWeatherData();
      });
  }, (error) => {
    console.error('Error getting current position:', error);

    // Fetch weather data using the default city if there's an error getting the current position
    fetchWeatherData();
  });
} else {
  // Browser doesn't support Geolocation API
  console.error('Geolocation is not supported by your browser');

  // Fetch weather data using the default city if geolocation is not supported
  fetchWeatherData();
}

// ...

//Add click event to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        //Change from default city to the clicked one
        cityInput = e.target.innerHTML;
        /*Function that fetches and displays
        all the data from the Weather API
         */
        fetchWeatherData();
        //Fade out the app(simple animation)
        app.style.opacity = "0";
    });
})

//Add submit event to the form
form.addEventListener('submit', (e) => {
    /*If the input field (search bar)
    is empty, throw an alert*/
    if (search.value.length == 0) {
        alert('Please type in a city name');
    } else {
        /*Change from default city to the
        one written in the input field*/
        cityInput = search.value;
        /*Function that fetches and displays all the data from the weather API */

        fetchWeatherData();

        //Remove all text from the input field
        search.value = "";

        //Fade out the app

        app.style.opacity = "0";
    }
    //Prevents the default behaviour of the form
    e.preventDefault();
});
/*Function that returns a day of the week from a date for eg (13 12 2023)*/

function dayOfTheWeek(day, month, year) {
    const weekday = [
        
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
        

    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};
/*Function that fetches and displays the data from the weather from the weather API*/

function  fetchWeatherData() {
    /* Fetch the data and dynamically add the city name which template literals */
    fetch(`http://api.weatherapi.com/v1/current.json?key=5e0b59c1832a46c4b2d144701230410&q=${cityInput}`)
    

        /* Take the data in the JSON format and convert it to a regular JS object */
        .then(response => response.json())
        .then(data => {
            console.log(data);
          
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;
            /* Get the date and time from the city and extract the day,month,year and time into individuals variables */

            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4)); const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);
            /* Reformatting the date  from 2023-10-09 17:53 to 17:53 - Friday 9, 10 2023*/

            dateOutput.innerHTML = `${dayOfTheWeek(d,m,y)} ${d},${m}, ${y}`;
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;

            /* For corresponding icons*/
            const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
            /*reformatting the icon url to your local folder path and add it to the page*/
            icon.src = `./icons/${iconId}`;
            //icons\weather\64x64\day\113.png
            //icon.src = "./icons/ + iconId";

            //Adding the weather details to the page
            countryOutput.innerHTML = data.location.country;
            regionOutput.innerHTML = data.location.region;

            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "Km/hr";

            //Setting default time of the day

            let timeOfDay = "day";
            //Getting the unique id for each weather condition

            const code = data.current.condition.code;

            //Changing to night if there is night time in the city

            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            if (code == 1000) {
        /*setting the background image to clear if the weather is clear*/
        app.style.backgroundImage = `url("./imges/${timeOfDay}/clear.jpg")`

        //Changing the bg of button on day/light

        btn.style.background = "#e5ba92";
        if (timeOfDay == "night"){
            btn.style.background = "#181e27";
        }
    }
    //same for cloudy weather
        else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282 
        ){
            app.style.backgroundImage =`url("./imges/${timeOfDay}/cloud.jpg")`;
            btn.style.background = "#fa6d1b";
            if(timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        }else if (
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252 
        ){
            app.style.backgroundImage = `url(./imges/${timeOfDay}/rain.jpg)`;
            btn.style.background = "#647d75";
            if (timeOfDay == "night") {
                btn.style.background = "#325c80";
            }
            //For snow
        }else {
        app.style.backgroundImage =`url(./images/${timeOfDay}/snow.jpg)`;
        btn.style.background = "#4d72aa";
        if(timeOfDay == "night"){
            btn.style.background = "#1b1b1b";
        }
    }
    app.style.opacity = "1";
})

.catch((error) => {
    console.error('Error:', error);
    alert('City not found , please try again');
    app.style.opacity = "1";
    });
}
        
fetchWeatherData();
app.style.opacity = "1";
    



