const express = require('express');
const mysql = require('mysql');
const path = require('path');
const API_KEY = "e6683dfbe7e9d55227eb42dfdf1928dc";

const app = express();
const port = 3000;

app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}'`);
})

app.use(express.static(path.join(__dirname,'public')));

const connection = mysql.createConnection({

    host: 'MaxlelyonaiComputer',
    user: 'root',
    password:  'Diablo890!1',

});
app.use(express.json());

// Conecction with mySQL dataBase, if database doesn't exists, you create it. And you also create a table for that.
connection.connect((err) =>{

    if(err){
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
      }
      console.log('Connected to MySQL');


      connection.query('CREATE DATABASE IF NOT EXISTS weatherdb', (err) => {

        if(err){
            throw err;
        }

        console.log('Database created or already exists');
    
        connection.query('USE weatherdb', (err) => {

            if(err){
                throw err;
            }

          console.log('Using weatherdb database');
    
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS weather (
              id INT AUTO_INCREMENT PRIMARY KEY,
              city VARCHAR(255) NOT NULL,
              temperature FLOAT NOT NULL,
              wind FLOAT NOT NULL,
              humidity FLOAT NOT NULL,
              weather VARCHAR(255) NOT NULL
            )
          `;

          connection.query(createTableQuery, (err) => {
            if(err){
                throw err;
            }

        });

    });
  });

function addInfoToDataBase(data,cityName){
  var {weather,wind,main} = data;
  weather = weather[0]['main'];
  wind = wind['speed'];
  var humidity = main['humidity'];
  var temp = main['temp'] - 273.15;

  connection.query('SELECT * FROM weather WHERE city = ?', [cityName], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return;
    }

  if(results != 0){

    connection.query('UPDATE weather SET temperature = ?, wind = ?, humidity = ?, weather = ? WHERE city = ?', [temp, wind, humidity,weather,cityName],(insertError) =>{
      
      if(insertError){
        console.error('Error changing data');
      }else{
        console.log('Data changed correctly');
      }
    });
  }else{
      connection.query('INSERT INTO weather (city, temperature, wind, humidity,weather) VALUES (?, ?, ?, ?, ?)',[cityName,temp,wind,humidity,weather], (insertError)=>{
        if(insertError){
          console.error('Error introduce data');
          console.error(insertError);
        }else{
          
          console.log('Data inserted correctly');
        }
      });
  }

});

}

function getDataFromDataBase(cityName){

  return new Promise((resolve,reject) =>{
  connection.query('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME = ? AND COLUMN_NAME != ?',['weather','id'], (error,result) =>{

    if(error){
      console.error('Error getting column names:', error);
      return;
    }

    const columnNames = result.map(result => result.COLUMN_NAME);
    connection.query(`SELECT ${columnNames.join(',')} FROM weather WHERE city = ?`, [cityName], (error,results) => {
      if (error) {
        console.error('Error executing SELECT query:', error);
        reject(error);
      } else {
        console.log(results);
        resolve(results);
      }

    });

  });
  });

}

app.get('/',(req,res)=>{

  res.sendFile(path.join(__dirname, 'public','HTML', 'Forecast.html'));

})
  
app.get('/pages/:pagesId', (req, res) => {

  const validPagesIds = ['Forecast', 'Notification', 'Historical', 'Social', 'Common'];
  const PagesId = req.params.pagesId;

  if (!validPagesIds.includes(PagesId)) {
    res.status(404).send('Page not found');
    return;
  }

  const PageFilePath = path.join(__dirname, 'public', 'HTML', `${PagesId}.html`);

  res.sendFile(PageFilePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
});

app.get('/Js/:JsId', (req, res) => {
  const validJsIds = ['Forecast', 'Notification', 'Historical', 'Social', 'Common'];
  const JsId = req.params.CssId;

  if (!validJsIds.includes(JsId)) {
    res.status(404).send('Page not found');
    return;
  }
  const JsFilePath = path.join(__dirname, 'public', 'Js', `${JsId}.js`);

  res.sendFile(JsFilePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/Css/:CssId', (req, res) => {
  const validCssIds = ['Forecast', 'Notification', 'Historical', 'Social', 'Common'];
  const CssId = req.params.CssId;

  if (!validCssIds.includes(CssId)) {
    res.status(404).send('Page not found');
    return;
  }

  const cssFilePath = path.join(__dirname, 'public', 'Css', `${CssId}.css`);

  res.sendFile(cssFilePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/Images/:image',(req,res) =>{
  const image = req.params.image;
  const imageFilePath = path.join(__dirname, 'public', 'images', `${image}.png`);

  res.sendFile(imageFilePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });

})

app.get('/Drawings/:file/:drawing',(req,res) =>{
  const {file,drawing} = req.params;
  const imageFilePath = path.join(__dirname, 'public', 'Drawings',`${file}`, `${drawing}.png`);

  res.sendFile(imageFilePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });

})


app.post('/weather', async (req,res) =>{
  try{
    var cityName = req.body.city;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
    var ubi = await response.json();
    const lat = ubi[0]['lat'];
    const lon = ubi[0]['lon'];
    const information = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const data = await information.json();
    addInfoToDataBase(data,cityName);
    const info = await getDataFromDataBase(cityName);
    res.json(info);

  }catch(error){
    console.error(error);
    res.status(500).send('Server error');
  }
})

});

app.post('/Historical/Weather', async (req,res) =>{
  try{
    var cityName = req.body.city;
    var type = req.body.type;
    const IncrementoHora = 1;
    const IncrementoDias = 6;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
    var ubi = await response.json();
    let indexIncrease = 0;
    const lat = ubi[0]['lat'];
    const lon = ubi[0]['lon'];
    if(type == "Hourly"){
       indexIncrease = IncrementoHora;
    }else{
       indexIncrease = IncrementoDias;
    }
    const information = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY} `);
    const data = await information.json();
    res.json({data,indexIncrease});

  }catch(error){
    console.error(error);
    res.status(500).send('Server error');
  }
})