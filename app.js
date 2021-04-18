const api = {
    key: "480987a33a6e71ea385a492f5caa5f99",
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

const search_button = document.querySelector('#search-button');
search_button.addEventListener('click', setQueryByButton);

const reset_button = document.querySelector('#reset-button');
reset_button.addEventListener('click', getLocation);

const chart_button = document.querySelector('#chart-button');
chart_button.addEventListener('click', openChart);

const top_chart_button = document.querySelector('#top-chart-button');
top_chart_button.addEventListener('click', openChart);

// Bar chart
var ctx = document.getElementById("bar-chart").getContext('2d');
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Feels like", "Minimum temperature", "Maximum temperature"],
        datasets: [{
            label: "Temperature details (°c)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            data: []
        }]
    },
    options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            fontColor: '#fff',
            text: 'Temperature details (°C)'
        }
    }
});

// Get current location when the DOM is ready
function getLocation() {
    $.ajax({
        url: "https://geolocation-db.com/jsonp",
        jsonpCallback: "callback",
        dataType: "jsonp",
        success: function(location) {
            getResults(location.city);
            document.getElementById("dark-lights").style.display = "block";
            searchbox.value = "";
        }
    });
}

// Search with enter
function setQuery(event) {
    if (event.keyCode == 13) {
        getResults(searchbox.value);
        document.getElementById("dark-lights").style.display = "none";
    }
}

// Search with button
function setQueryByButton() {
    getResults(searchbox.value);
    document.getElementById("dark-lights").style.display = "none";

}

// Get the weather details
function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }).then(displayResults);
}

// Display the results
function displayResults(weather) {
    console.log(weather);
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');

    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    let clouds_weather = document.getElementById('clouds-line');
    let clear_weather = document.getElementById('clear-line');
    let storm_weather = document.getElementById('storm-line');
    let rain_weather = document.getElementById('rain-line');
    let snow_weather = document.getElementById('snow-line');
    let current_weather = weather.weather[0].main;
    weather_el.innerText = current_weather;


    switch (current_weather) {
        case "Clouds":
            clouds_weather.style.display = "none";
            clear_weather.style.display = "block";
            storm_weather.style.display = "block";
            rain_weather.style.display = "block";
            snow_weather.style.display = "block";
            break;
        case "Clear":
            clear_weather.style.display = "none";
            clouds_weather.style.display = "block";
            storm_weather.style.display = "block";
            rain_weather.style.display = "block";
            snow_weather.style.display = "block";
            break;
        case "Rain":
            rain_weather.style.display = "none";
            clear_weather.style.display = "block";
            clouds_weather.style.display = "block";
            storm_weather.style.display = "block";
            snow_weather.style.display = "block";
            break;
        case "Drizzle":
            rain_weather.style.display = "none";
            clear_weather.style.display = "block";
            clouds_weather.style.display = "block";
            storm_weather.style.display = "block";
            snow_weather.style.display = "block";
            break;
        case "Thunderstorm":
            storm_weather.style.display = "none";
            rain_weather.style.display = "block";
            clear_weather.style.display = "block";
            clouds_weather.style.display = "block";
            snow_weather.style.display = "block";
            break;
        case "Snow":
            snow_weather.style.display = "none";
            rain_weather.style.display = "block";
            clear_weather.style.display = "block";
            clouds_weather.style.display = "block";
            storm_weather.style.display = "block";
            break;
        default:
            text = "I have never heard of that fruit...";
    }


    let minmax = document.querySelector('.min-max');
    minmax.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

    // Update chart data
    function updateChart() {
        chart.data.datasets[0].data = [weather.main.feels_like, weather.main.temp_min, weather.main.temp_max];
        chart.update();
    }
    updateChart();

}
// Display the current date
function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}


function openChart() {
    let chart = document.getElementById('chart');
    if (chart.style.display == "block") {
        console.log("itt");
        chart.style.display = "none";
    } else {
        chart.style.display = "block";
        console.log("masik");
    }
}