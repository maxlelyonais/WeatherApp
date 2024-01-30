async function sendData(cityName, type) {
  // Construct the data object to send to the server
  console.log(cityName);
  console.log(type);
  const dataToSend = { "city": cityName,"type":type};
  try {
      // Send a POST request to the server
      const response = await fetch('/Historical/Weather', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
      });
      // Parse the JSON response
      const { data, indexIncrease } = await response.json();
      // Return the data extracted from the response
      return { data, indexIncrease };
  } catch (error) {
      // Handle errors gracefully
      console.error('Error:', error);
  }
}



document.addEventListener("DOMContentLoaded",function() {

  const Hour = document.querySelector(".Hour");
  const Week = document.querySelector(".Day");
  const Month = document.querySelector(".Week");
  const button = document.querySelector(".press");
  Hour.addEventListener("click",function(){changeWeatherCondition("Hourly", "Weather");});
  Week.addEventListener("click",function(){changeWeatherCondition("Daily","Weather")});
  Month.addEventListener("click",function(){changeWeatherCondition("Weekly","Weather")});
  button.addEventListener("click",function(){changeWeatherCondition("","City")});

  async function changeWeatherCondition(type,typeOfChange){
    let data = "";
    let indexIncrease = 0;
    let cityName = "";
    try{
      
    if(typeOfChange == "Weather"){
      const nombre = localStorage.getItem("Pais");
      cityName = nombre;
      if(typeof(Storage) != "undefined" ){
        localStorage.setItem("Estado",type);
      }else{
        alert("Storage no es compatible con este formato");
      }
      const weatherData=  await sendData(nombre,type);
      data = weatherData.data;
      indexIncrease = weatherData.indexIncrease;

    }else if(typeOfChange == "City"){

      cityName = document.querySelector(".input").value;
      const type = localStorage.getItem("Estado");      

      if(typeof(Storage) != "undefined" ){
        localStorage.setItem("Pais",cityName);
      }else{
        alert("Storage no es compatible con este formato");
      }
      
      const weatherData= await sendData(cityName,type);
      data = weatherData.data;
      indexIncrease = weatherData.indexIncrease;
    }    

      data = data["list"];

      setTimeout(() =>{
      for(let j = 1; j < 6;j++){
        for(let i = 1; i < 7;i++){
          if(j == 1){
            const Humedad = document.querySelector(`.ContentH-${i}`);
            Humedad.innerHTML = `Humedad : <br> ${data[indexIncrease*i]["main"]["humidity"]} %`;
          }else if(j == 2){
            const Temperatura = document.querySelector(`.ContentT-${i}`)
            Temperatura.innerHTML = `Temp : <br> ${Math.round(data[indexIncrease*i]["main"]["temp"] - 273)} ºC`;
            updateProgressBar(Math.round(data[indexIncrease*i]["main"]["temp"] - 273),i);
          }else if(j == 3){
            const Wind = document.querySelector(`.ContentV-${i}`);
            Wind.innerHTML = `Viento : <br> ${data[indexIncrease*i]["wind"]["speed"]} km/h`;
          }else if(j == 4){ 
            const Tiempo = document.querySelector(`.Tiempo-${i}`);
            Tiempo.innerHTML = `Hora: <br> (${data[indexIncrease*i]["dt_txt"]})`;
          }else if(j == 5){
            const Image = document.querySelector(`.Image-${i}`);
            const weathers = data[indexIncrease*i]["weather"][0]["main"];
            switch(weathers){

              case('Clear'):
                  Image.src = "/Images/clear";
                  break;
              case('Clouds'):
                  Image.src = "/Images/clouds";
                  break;
              case('Drizzle'):
                  Image.src = "/Images/drizzle"
                  break;
              case('Mist'):
                  Image.src = "/Images/mist";
                  break;
              case('Rain'):
                  Image.src = "/Images/rain";
                  break;
              case('Snow'):
                  Image.src = "/Images/snow";
                  break;
            }

          }
      }

    }
      },1000);

    }catch(error){
        console.error(error);
    }

  }

});


function updateProgressBar(temperature, id) {
  const progress = document.querySelector(`.progress-${id}`);
  const MaxTemp = 60;
  const MinTemp = 0;

  if (!progress) {
    console.error('Progress element not found inside container:', id);
    return;
  }

  let height = 0;

  if (temperature < MinTemp) {
    height = 0;
  } else if (temperature > MaxTemp) {
    height = 100; // Assuming 100% as the max height
  } else {
    height = (temperature * 100) / MaxTemp; // Calculate percentage
  }

  // Adjust the progress bar's height
  progress.style.height = height + '%';
  if(temperature < MaxTemp/4){
    progress.style.backgroundColor = "blue";
  }else if(temperature < MaxTemp/2 && temperature >= MaxTemp/4){
    progress.style.backgroundColor = "#85c1e9"
  }else if(temperature < (MaxTemp*3)/4 && temperature >= MaxTemp/2){
    progress.style.backgroundColor = "#eb984e";
  }else{
    progress.style.backgroundColor = "# #e74c3c ";
  }
}
