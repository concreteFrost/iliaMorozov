
const map = L.map("map").setView([0, -0.09], 13);
const OpenStreetMap_Mapnik = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 15,
    minZoom: 2,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(map);
var marker;

//Get user position
$(document).ready(() => {
  navigator.geolocation.getCurrentPosition((pos) => {
    //Get CurrentPosition
    $.ajax({
      url: "libs/php/getUserPosition.php",
      dataType: "json",
      data: {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      },
      success: function (res) {
        map.setView([pos.coords.latitude, pos.coords.longitude], 13);
        $("#selectCountry").val(res["data"]["countryCode"]).change();
       
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});

//Fill up country list
$(document).ready(() => {
  $.ajax({
    url: "libs/php/getCountryList.php",
    success: function (res) {
      res["data"].forEach((el) => {
        $("#selectCountry").append(`<option value=${el["iso"]}>
            ${el["name"]}</option>`);
      });

      var sel = $("#selectCountry");
      var selected = sel.val();
      var opts_list = sel.find("option");
      opts_list.sort(function (a, b) {
        return $(a).text() > $(b).text() ? 1 : -1;
      });
      sel.html("").append(opts_list);
      sel.val(selected); // set cached selected value
    },
    error: function () {
      console.log("error");
    },
  });
});
//Get Country Shape
let countryShape;
$("#selectCountry").change(() => {
  //Get Shape

$.ajax({
  url: "libs/php/getCountryBounds.php",
  data:{
    iso: $('#selectCountry').val()
  },
  success: function (res) {
   
        if (map.hasLayer(countryShape)) {
          map.removeLayer(countryShape);
        }
        let currentBound = res['data']['bounds'];
        countryShape = L.geoJSON(currentBound,{style:{color: '#00cc00', weight: 2, dashOffset: '0' } }).addTo(map);
        map.addLayer(countryShape);
        map.fitBounds(countryShape.getBounds()); 
  },
  error: function (err) {
    console.log(err);
  },
});
});

   
window.addEventListener('load',()=>{
  setTimeout(()=>{$('#loader').hide();},1500)
});
//weather location array
var latLon = [];
//cities location iso2 code
let iso2;
//Get Capital/Flag/Currency/Covid/Weather
$("#selectCountry").change(() => {
  $.ajax({
    url: "libs/php/getCountryInfo.php",
    dataType: "json",
    data: {
      iso: $("#selectCountry").val(),
    },
    success: function (res) {
      const result = res["data"];
      latLon = [];
      latLon.push(result["latlng"][1]);
      latLon.push(result["latlng"][0]);

      //Change value to UK if iso2=GB
      if (result["alpha2Code"] == "GB") {
        iso2 = "UK";
      } else {
        iso2 = result["alpha2Code"];
      }
      $("#currentCountry").html(result["name"]);
      $("#currentCapital").html("Capital: " + result["capital"]);
      $("#currentFlag").html(
        `<img src=${result["flag"]} alt='no image' style='width :70px'/>`
      );
      $("#currentCurrency").html(
        "Currency: " + result["currencies"][0]["name"]
      );

      let populationFormatted = numeral(result['population']).format('0,0');
      $("#currentPopulation").html("Population: " + populationFormatted);
    },
    error: function (err) {
      console.log("err");
    },
  });
  //Get Covid
  $.ajax({
    url: "libs/php/getCovid.php",
    data: {
      iso: $("#selectCountry").val(),
    },
    success: function (res) {
      r = res["data"];
      $("#covidCountry").html(r["country"]);
      $("#confirmed").html(r["confirmed"]);
      $("#deaths").html(r["deaths"]);
      $("#recovered").html(r["recovered"]);
      $("#active").html(r["active"]);
    },
    error: function (er) {
      console.log(err);
    },
  });
});
//Get Weather
$("#currentCountry").on("DOMSubtreeModified", () => {
  $.ajax({
    url: "libs/php/getWeather.php",
    dataType: "json",
    data: {
      lat: latLon[1],
      lon: latLon[0],
    },
    success: function (r) {
      var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      var today = new Date(r["data"][0]["date"]);
      let todayDate = today.toLocaleDateString("en-US", options);
      let todayIcon = r["data"][0]["day"]["condition"]["icon"];
      let todayTemp = r["data"][0]["day"]["avgtemp_c"];
      let todayWindSpeed = r["data"][0]["day"]["maxwind_kph"];
      let todayCondition = r["data"][0]["day"]["condition"]["text"];
      let sunrise = r["data"][0]["astro"]["sunrise"];
      let sunset = r["data"][0]["astro"]["sunset"];

      $("#todayDate").html(todayDate);
      $("#todayWeatherIcon").html(`<img src="https://${todayIcon}" />`);
      $("#currentTemperature").html(
        "<b>Temperature: </b>" + todayTemp + "°"
      );
      $("#windSpeed").html("<b>Wind Speed: </b>" + todayWindSpeed + " ms");
      $("#todayCondition").html(`<b>${todayCondition}</b>`);

      $("#sunrise").html("<b>Sunrise: </b>" + sunrise);
      $("#sunset").html("<b>Sunset: </b>" + sunset);

      let tomorrowIcon = r["data"][1]["day"]["condition"]["icon"];
      let tomorrowTemp = r["data"][1]["day"]["avgtemp_c"];
      let date2 = new Date(r["data"][1]["date"]);
      let date2Formatted =date2.toLocaleDateString('en-US',options);
      $("#tomorrowDate").html(date2Formatted);
      $("#tomorrowWeatherIcon").html(
        `<img src="https://${tomorrowIcon}" width=48px />`
      );
      $("#tomorrowWeatherTemperature").html(
        "<b>Temperature: </b>" + tomorrowTemp + "°"
      );

      let dayAfterIcon = r["data"][2]["day"]["condition"]["icon"];
      let dayAfterTemp = r["data"][2]["day"]["avgtemp_c"];
      let date3 = new Date(r["data"][1]["date"]);
      let date3Formatted =date3.toLocaleDateString('en-US',options);

      $("#afterTomorrowDate").html(date3Formatted);
      $("#afterTomorrowWeatherIcon").html(
        `<img src="https://${dayAfterIcon}" width=48px/>`
      );
      $("#afterTomorrowWeatherTemperature").html(
        "<b>Temperature: </b>" + dayAfterTemp + "°"
      );
    },
    error: function (err) {
      console.log(err);
    },
  });
});

/////////////MARKERS/////////////////////////

//Show/Hide Info Pannel
let cityMarkers;
let parksMarkers;
let poiMarkers;
//Get Cities/////////////////


$("#currentCountry").on("DOMSubtreeModified", () => {
  $.ajax({
    url: "libs/php/getCities.php",
    data: {
      iso: iso2,
    },
    success: function (result) {
      if (cityMarkers) {
        map.removeLayer(cityMarkers);
      }
      cityMarkers = L.markerClusterGroup();
      let awsMarker = L.AwesomeMarkers.icon({
        icon: 'fa-regular fa-city',
        shape: 'square',
        markerColor: 'blue',
        prefix: 'fa'
      })
      const r = result["data"]["results"];
      for (let i = 0; i < r.length; i++) {
        const img = r[i]["images"][0]["sizes"]["thumbnail"]["url"];
        const cityName = r[i]["name"];
        const snippet = r[i]["snippet"];

        let city = L.marker(
          [r[i]["coordinates"]["latitude"], r[i]["coordinates"]["longitude"]],
          { icon: awsMarker }
        ).bindPopup(
          `<img src='${img}' class='popupCenter shadow mb-5  rounded'/>` +
            `<h3 style='text-align:center;'>${cityName}</h3>` +
            `<p>${snippet}</p>`
        );
        cityMarkers.addLayer(city);
      }
      map.addLayer(cityMarkers);
    },
    error: function (err) {
      console.log("no iso code found");
    },
  });
  //Get Parks
  $.ajax({
    url: "libs/php/getParks.php",
    data: {
      iso: iso2,
    },
    success: function (result) {
      if (parksMarkers) {
        map.removeLayer(parksMarkers);
      }
      parksMarkers = L.markerClusterGroup();
      let awsMarker = L.AwesomeMarkers.icon({
        icon: 'fa-regular fa-tree',
        shape: 'square',
        markerColor: 'orange',
        prefix: 'fa'
      })
      const r = result["data"]["results"];
      for (let i = 0; i < r.length; i++) {
        const img = r[i]["images"][0]["sizes"]["thumbnail"]["url"];
        const parkName = r[i]["name"];
        const snippet = r[i]["snippet"];

        let park = L.marker(
          [r[i]["coordinates"]["latitude"], r[i]["coordinates"]["longitude"]],
          { icon: awsMarker }
        ).bindPopup(
          `<img src='${img}' class='popupCenter shadow mb-5  rounded'/>` +
            `<h3 style='text-align:center;'>${parkName}</h3>` +
            `<p>${snippet}</p>`
        );
        parksMarkers.addLayer(park);
      }
      map.addLayer(parksMarkers);
    },
    error: function (err) {
      console.log("no iso code found");
    },
  });
//   //Get POI
  $.ajax({
    url: "libs/php/getPOI.php",
    data: {
      iso: iso2.toLowerCase(),
    },
    success: function (result) {
      if (poiMarkers) {
        map.removeLayer(poiMarkers);
      }
      poiMarkers = L.markerClusterGroup();
      let awsMarker = L.AwesomeMarkers.icon({
        icon: 'fa-regular fa-camera',
        shape: 'square',
        markerColor: 'red',
        prefix: 'fa'
      })
      const r = result["data"]["results"];
      for (let i = 0; i < r.length; i++) {
    try{
        const img = r[i]["images"][0]["sizes"]["medium"]["url"];
        const parkName = r[i]["name"];
        const snippet = r[i]["snippet"];
        
        let poi = L.marker(
          [r[i]["coordinates"]["latitude"], r[i]["coordinates"]["longitude"]],
          { icon: awsMarker }
        ).bindPopup(
          `<img src='${img}' class='popupCenter shadow mb-5  rounded'/>` +
            `<h3 style='text-align:center;'>${parkName}</h3>` +
            `<p>${snippet}</p>`
        );
        poiMarkers.addLayer(poi);
    }
    catch(e){
      
    }
      }
      map.addLayer(poiMarkers);
    },
    error: function (err) {
      console.log("no iso code found");
    },
  });

});
//Show Position Button

/////////Buttons!!!/////////////////////
var infoShowHide = L.easyButton({
  id:'esButtonInfo',
  states: [
    {
      stateName: "hideBar",
      icon: 'fa-regular fa-circle-info',
      title: "hide info",
      onClick: function (control) {
        $("#countryInfo").modal("show");
        control.state("showBar");
        weatherShowHide.state("hideBar");
        covidShowHide.state("hideBar");
      },
    },

  ],
});
infoShowHide.addTo(map);

//Show Covid Button
var covidShowHide = L.easyButton({
  id: 'esButtonCovid',
  states: [
    {   
      stateName: "hideBar",
      icon: 'fa-solid fa-virus',
      height: '50px',
      title: "hide info",
      onClick: function (control) {
        $("#covidOverlay").modal("show");
        control.state("showBar");
      },
    }
  ],
});
covidShowHide.addTo(map);

var weatherShowHide = L.easyButton({
  id:'esButtonWeather',
  states: [
    {
      stateName: "hideBar",
      icon: 'fa-solid fa-sun',
      title: "hide info",
      onClick: function (control) {
        $("#weatherOverlay").modal("show");
        control.state("showBar");
      },
    }
  ],
});
weatherShowHide.addTo(map);

//Show Cities Button
var cityMarkerShowHide = L.easyButton({
  id:'esButtonBuilding',
  states: [
    {
      stateName: "hideBar",
      icon: 'fa-regular fa-city',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(cityMarkers);
        control.state("showBar");
      },
      
    },
    {
      stateName: "showBar",
      icon: 'fa-light fa-city',
      title: "show info",
      onClick: function (control) {
        map.addLayer(cityMarkers);
        control.state("hideBar");
      },
    },
  ],
});
cityMarkerShowHide.addTo(map);

var parkMarkersShowHide = L.easyButton({
  id:'esButtonTree',
  states: [
    {
      stateName: "hideBar",
      icon: 'fa-regular fa-tree',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(parksMarkers);
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: 'fa-light fa-tree',
      title: "show info",
      onClick: function (control) {
        map.addLayer(parksMarkers);
        control.state("hideBar");
      },
    },
    
  ],
});
parkMarkersShowHide.addTo(map);

var poiShowHide = L.easyButton({
  id:'esButtonCamera',
  states: [
    {
      stateName: "hideBar",
      icon: 'fa-regular fa-camera',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(poiMarkers);
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: 'fa-light fa-camera',
      title: "show info",
      onClick: function (control) {
        map.addLayer(poiMarkers);
        control.state("hideBar");
      },
    },
  ],
});
poiShowHide.addTo(map);

//Bootstrap
$("#countryInfoButton").on("click", () => {
  $("#countryInfo").modal('hide');
  infoShowHide.state("hideBar");
});
$("#covidInfoButton").on("click", () => {
  $("#covidOverlay").modal('hide');
  covidShowHide.state("hideBar");
});
$("#weatherInfoButton").on("click", () => {
  $("#weatherOverlay").modal('hide');
  weatherShowHide.state("hideBar");
});
