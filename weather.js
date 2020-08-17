require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");

// done requiring module
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

var daysArray = [];
const imgUrl = [];
var imgUrlSingle = "";

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}
app.listen(port, function (res) {
  console.log("Port started successfully at host 4000");
});
app.get("/", function (req, res) {
  res.render("index");
});
app.post("/", function (req, res) {
  const cityName = req.body.cityName;
  //   res.render("forecast");
  const url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    process.env.WEATHER_API +
    "&units=metric&cnt=32";
  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      var options = { timeZone: "Asia/Kolkata", hour12: false };
      var date = new Date().toLocaleString("en-US", options);
      var time = parseInt(date.substring(11, 13));
      weatherData.list.forEach(function (single) {
        var textHour = single.dt_txt.substring(11, 13);
        var numberHour = parseInt(textHour, 10);
        var difference = Math.abs(time - numberHour);
        if (
          difference === 1 ||
          difference === 0 ||
          (time === 23 && numberHour === 21) ||
          (time === 24 && numberHour === 0) ||
          (time === 2 && numberHour === 00)
        ) {
          daysArray.push(single);
          imgUrlSingle =
            "http://openweathermap.org/img/w/" +
            single.weather[0].icon +
            ".png";
          imgUrl.push(imgUrlSingle);
        }
      });
      // res.send(daysArray);
      res.render("forecast", { daysArray: daysArray, imgUrl: imgUrl });
      daysArray = [];
    });
  });
});
