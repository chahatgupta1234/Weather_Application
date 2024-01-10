//Take all the elements from html
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location");
const searchForm = document.querySelector('[data-searchForm]')
const loadingContainer = document.querySelector(".loading-container");
const userInfo = document.querySelector('.user-info-container');

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

//get data from browser if already stored
getfromSessionStorage();

function switchTab(clickedTab) {
    if(currentTab != clickedTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            userInfo.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{

            searchForm.classList.remove("active");
            userInfo.classList.add("active");

            //now we render the data
            getfromSessionStorage();

        }
    }
}

userTab.addEventListener("click", ()=>{
    // console.log("change kra user se khi or");
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    // console.log("change kra search se khi or");
    switchTab(searchTab);
});


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates)
    {
        //phli bar aya h ya location off h
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeather(coordinates);
    }
}

async function fetchUserWeather(coordinates)
{
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");

    //make loading screen visible
    loadingContainer.classList.add("active");

    //API Call using try
    try{
        //here i use babbars api not my api call
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

        const data = await response.json();

        //close loading
        loadingContainer.classList.remove("active");

        //show information
        userInfo.classList.add("active");

        renderWeatherInfo(data);
    }

    catch (err) {
        loadingContainer.classList.remove("active");
        console.log("error in fetching the api at line 78 by mr chahat ", err);
        alert("api not fetched");
    }
    
}

function renderWeatherInfo(data) {

    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windSpeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    console.log(data);

    cityName.innerText = data?.name;

    //we use url to fetch the image or icon by country name from object and convert it in lower case
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;

    //here also we use url(http://openweathermap.org/img/w/) to fetch the image of weather icon and put .png at end to make the image in png format
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    
    temp.innerText = `${data?.main?.temp} C`;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = `${data?.clouds?.all}%`; 
}

function getLocation(){
    if(navigator.geolocation)
    {
        //her showPosition is a callback function.
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert("Choose kr na ki location show kre")
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
    fetchUserWeather(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
    let cityName = searchInput.value;
    e.preventDefault();

    if(cityName === "")
    return;
    else{
        fetchSearchWeather(cityName);
    }
})

async function fetchSearchWeather(cityName)
{
    loadingContainer.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfo.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
          );

          const data = await response.json();

          loadingContainer.classList.remove("active");
          userInfo.classList.add("active");

          renderWeatherInfo(data);
    }

    catch(e)
    {
        alert("enter valid city", e);
    }
}

