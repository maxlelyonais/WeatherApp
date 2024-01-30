const button = document.getElementById("press");
const parentElement = document.querySelector(".animation");
// Change elements from HTML, aspects

fetch('/Css/Forecast')
    .then(response => response.text())
    .then(CssData => {
        const styleElement = document.createElement('style');
        styleElement.textContent = CssData;
        document.head.appendChild(styleElement);
    })
    .then(() => {
        return fetch('/Css/Common');
    })
    .then(response => response.text())
    .then(cssData => {
        const styleElement = document.createElement('style');
        styleElement.textContent = cssData;
        document.head.appendChild(styleElement);
    })
    .catch(error => {
        console.error('Error fetching and injecting content:', error);
    });

function addElements(TypeWeather){

    var commonProperties = {
        width: "600px",
        height: "300px",
        opacity: "0.1",
        position: "absolute"
    };
    switch(TypeWeather){

        case('Clear'):
            const sun = document.createElement('img');
            sun.src = "/Drawings/Soleado/Sol";
            Object.assign(sun.style,commonProperties);
            sun.style.height = "600px"
            sun.style.left = "900px"     
            sun.style.top = `px`;
            sun.classList.add('sun');
            parentElement.appendChild(sun);
            break;
        case('Clouds'):
            for(let i = 0; i < 3; i++){
                const cloud = document.createElement('img');
                cloud.src = "/Drawings/Nublado/cloud";
                Object.assign(cloud.style,commonProperties);
                cloud.style.left = `${Math.random() * i * 10}px`;      
                cloud.style.top = `${i * 200}px`;
                cloud.classList.add('clouds');
                parentElement.appendChild(cloud);
            }
            break;
        case('Drizzle'):
        for(let i = 0; i < 3; i++){
            const cloud = document.createElement('img');
            cloud.src = "/Drawings/Neblina/Neblina";
            Object.assign(cloud.style,commonProperties);
            cloud.style.left = `${Math.random() * i * 10}px`;      
            cloud.style.top = `${i * 200}px`;
            cloud.classList.add('clouds');
            parentElement.appendChild(cloud);
        }
        break;
        case('Mist'):
        for(let i = 0; i < 5; i++){
            const rain = document.createElement('img');
            rain.src = "/Drawings/Lluvia/gotas";
            Object.assign(rain.style,commonProperties); 
            rain.style.left = `${i * 300}px`;
            rain.classList.add('rain');
            parentElement.appendChild(rain);
        }

            break;
        case('Rain'):
        
        for(let i = 0; i < 5; i++){
            const rain = document.createElement('img');
            rain.src = "/Drawings/Lluvia/gotas";
            Object.assign(rain.style,commonProperties); 
            rain.style.left = `${i * 300}px`;
            rain.classList.add('rain');
            parentElement.appendChild(rain);
        }

            break;
        case('Snow'):
        for(let i = 0; i < 5; i++){
            const snow = document.createElement('img');
            snow.src = "/Drawings/Nieve/Particulas";
            commonProperties.opacity = "0.5";
            Object.assign(snow.style,commonProperties);
            snow.style.left = `${i * 300}px`;
            snow.classList.add('snow');
            parentElement.appendChild(snow);
        }
            break;
    }

}

function deleteElements(){
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }

}

// Send data to our server using HTTP protocol
async function sendData(cityName) {
    const dataToSend = { "city": cityName };
    try {
        const response = await fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
        }); 
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const button = document.querySelector(".press");
    button.addEventListener("click", getWeatherLocation);


    async function getWeatherLocation() {

        deleteElements();
        var Body = document.body;
        const cityName = document.querySelector(".ciudad").value;
        const data = await sendData(cityName);
        const  {city,temperature,wind,humidity,weather}= data[0];   
        Body.style.opacity = 0;

        try {

            setTimeout( () => {
            const weathers = weather;
            const City = document.querySelector(".City");
            const Humedad = document.querySelector(".InfoHumedad");
            const Temperatura = document.querySelector(".InfoTemperatura")
            const Wind = document.querySelector(".InfoViento");
            const Image = document.getElementById("imageContainer");
            const background = document.querySelector('.background')
        
            City.innerHTML = `Ciudad : ${ document.querySelector(".ciudad").value.toUpperCase()}`;
            Wind.innerHTML = `Viento : ${wind} km/h`;
            Temperatura.innerHTML = `Temp : ${temperature} ºC`;
            Humedad.innerHTML = `Humedad : ${humidity } %   `;

            switch(weathers){

                case('Clear'):
                    Image.src = "/Images/clear";
                    Body.style.backgroundImage = "url('/Drawings/Soleado/Soleado')";
                    addElements('Clear');
                    break;
                case('Clouds'):
                    Image.src = "/Images/clouds";
                    Body.style.backgroundImage = "url('/Drawings/Nublado/Nublado')";
                    addElements('Clouds');
                    break;
                case('Drizzle'):
                    Image.src = "/Images/drizzle"
                    Body.style.backgroundImage = "url('/Drawings/Neblina/Niebla')";
                    break;
                case('Mist'):
                    Image.src = "/Images/mist";
                    Body.style.backgroundImage = "url('/Drawings/Chispear/chispeo')";
                    addElements('Mist');
                    break;
                case('Rain'):
                    Image.src = "/Images/rain";
                    Body.style.backgroundImage = "url('/Drawings/Lluvia/Lluvia')";
                    addElements('Rain');
                    break;
                case('Snow'):
                    Image.src = "/Images/snow";
                    Body.style.backgroundImage = "url('/Drawings/Nieve/Nieve')";
                    addElements('Snow')
                    break;
            }
            Body.style.opacity = 1; 
            },1000);

        } catch (err) {
            console.error('There is an error happening', err);
        }
    }
});