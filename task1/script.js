document.addEventListener("DOMContentLoaded",()=>{

const cityNameInput=document.getElementById("city-input");
const submitBtn=document.getElementById("btn");
const noResultDisplay=document.getElementById("no-result");
const resultDisplay=document.getElementById("result-container");
const resCityNameDisplay=document.getElementById("city-name");
const resTemperatureDisplay=document.getElementById("temperature");
const resHumidityDisplay=document.getElementById("humidity");
const resFeelsLikeDisplay=document.getElementById("feels-like");
const resDescriptionDisplay=document.getElementById("description");
const resWindSpeedDisplay=document.getElementById("wind-speed");

API_KEY="dc8fc2482bfc46d8cc2d20756579937c";

submitBtn.addEventListener("click",()=>{
    const cityName=cityNameInput.value.trim();
    if(!cityName) return;
    fetchWeatherData(cityName);
    cityNameInput.value="";
});

async function fetchWeatherData(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
 const response=await fetch(url);
    if(!response.ok) {
        noResultDisplay.classList.remove("hidden");
        resultDisplay.classList.add("hidden");
        throw new Error("City is not found");
        }

    const data=await response.json();
    showResult(data);
    }



function showResult(data){
    resCityNameDisplay.textContent=`${data.name}`;
    resTemperatureDisplay.textContent=`Temperature : ${data.main.temp}\u00b0C`;
    resHumidityDisplay.textContent=`Humidity: ${data.main.humidity}%`;
    resFeelsLikeDisplay.textContent=`Feels like : ${data.main.feels_like}\u00b0C`;
    resDescriptionDisplay.textContent=`Description: ${data.weather[0].description}`;
    resWindSpeedDisplay.textContent=`Avg. Wind Speed: ${data.wind.speed} kph`;
    noResultDisplay.classList.add("hidden");
    resultDisplay.classList.remove("hidden");
}


});