/**
 * @author: Adrian Bueno <adrianbueno095@gmail.com>
 */
//this only works for the crm
async function getCurrentSystemUser() {
    let formcontext = Xrm.Page;

    if (!formcontext) return;

    let userId = formcontext.context.getUserId().replace(/\{​|\}​/g, "");
    let systemUserFullname = await Xrm.WebApi.retrieveRecord(
        "systemuser",
        userId,
        "?$select=fullname"
    );

    if (!systemUserFullname) return;

    return systemUserFullname;
}

function getCityName() {
    let userCityNameInput = prompt(`Hello Random Person, Type a City Name`);
    if (!userCityNameInput || userCityNameInput.length === 0) return;
    return userCityNameInput;
}

async function displayCurrentWeather() {
    let cityNameInput = getCityName();

    if (cityNameInput === undefined) return;

    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=0002cc42e0f7ee0022f9bfd9aa0d7161`;

    await fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
            let cityName = data.name;
            let celcius = convertsKelvinToCelcius(data.main.temp);
            createDialogMessage(cityName, celcius);
        });
}

function convertsKelvinToCelcius(temperatureInkelvin) {
    if (!temperatureInkelvin) return;

    const KELVIN_CELSIUS_DIFF = 273.15;
    let resultInCelcius = Math.round(temperatureInkelvin - KELVIN_CELSIUS_DIFF);

    return resultInCelcius;
}

function createDialogMessage(cityName, celcius) {
    let dialogTable = document.createElement("div");
    let degreesCelsiusSymbol = "&#8451;";

    dialogTable.style.width = "500px";
    dialogTable.style.height = "500px";
    dialogTable.style.background = "#DCBAE0";
    dialogTable.style.transition = "translate(-50%, -50%)";
    dialogTable.style.display = "flex";
    dialogTable.style.alignItems = "center";
    dialogTable.style.justifyContent = "center";
    dialogTable.style.fontSize = "30px";

    dialogTable.innerHTML = `Current Weather in ${cityName} is : ${celcius} ${degreesCelsiusSymbol}`;
    document.body.appendChild(dialogTable);
}

displayCurrentWeather();
