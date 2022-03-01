window.addEventListener('load',()=>{
  setTimeout(()=>{$('#loader').hide();},1500)

});

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
        marker = L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(
          map
        );
        marker.bindPopup("You are here");
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
    success: function (res) {
      $("#selectCity").find("option").remove().end();
      for (let i = 0; i < res["data"].length; i++) {
        if ($("#selectCountry").val() == res["data"][i]["iso"]) {
          if (map.hasLayer(countryShape)) {
            map.removeLayer(countryShape);
          }
          let currentBound = res["data"][i]["bounds"];
          countryShape = L.geoJSON(currentBound).addTo(map);
          map.addLayer(countryShape);
          map.fitBounds(countryShape.getBounds());
          break;
        }
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
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
      $("#currentCountry").html(result["nativeName"]);
      $("#currentCapital").html("Capital: " + result["capital"]);
      $("#currentFlag").html(
        `<img src=${result["flag"]} alt='no image' style='width :70px'/>`
      );
      $("#currentCurrency").html(
        "Currency: " + result["currencies"][0]["name"]
      );
      $("#currentPopulation").html("Population: " + result["population"]);
      // Get Weather
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

          $("#tomorrowDate").html(r["data"][1]["date"]);
          $("#tomorrowWeatherIcon").html(
            `<img src="https://${tomorrowIcon}" width=48px />`
          );
          $("#tomorrowWeatherTemperature").html(
            "<b>Temperature: </b>" + tomorrowTemp + "°"
          );

          let dayAfterIcon = r["data"][2]["day"]["condition"]["icon"];
          let dayAfterTemp = r["data"][2]["day"]["avgtemp_c"];

          $("#afterTomorrowDate").html(r["data"][2]["date"]);
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
//Get Wiki
$("#currentCountry").on("DOMSubtreeModified", () => {
  $.ajax({
    url: "libs/php/getWiki.php",
    data: {
      country: $("#currentCountry").html().replace(" ", "_").toLowerCase(),
    },
    success(res) {
      let wiki = res["data"]["geonames"][0]["wikipediaUrl"];
      $("#wikiPage").html(
        `<a href="https://${wiki}" target='_blank'>Wikipedia</a>`
      );
    },
    error(err) {
      console.log("error");
    },
  });
});

/////////////MARKERS/////////////////////////

//Show/Hide Info Pannel
let cityMarkers;
let parksMarkers;
let poiMarkers;
//Get Cities/////////////////
// $("#currentCountry").on("DOMSubtreeModified", () => {
//   $.ajax({
//     url: "libs/php/getCities.php",
//     data: {
//       iso: iso2,
//     },
//     success: function (result) {
//       if (cityMarkers) {
//         map.removeLayer(cityMarkers);
//       }
//       cityMarkers = L.markerClusterGroup();
//       const cityIcon = L.icon({
//         iconUrl: "libs/vendors/leaflet/images/icons/hotel_on.png",
//         iconSize: [30, 30],
//       });
//       const r = result["data"]["results"];
//       for (let i = 0; i < r.length; i++) {
//         const img = r[i]["images"][0]["sizes"]["thumbnail"]["url"];
//         const cityName = r[i]["name"];
//         const snippet = r[i]["snippet"];

//         let city = L.marker(
//           [r[i]["coordinates"]["latitude"], r[i]["coordinates"]["longitude"]],
//           { icon: cityIcon }
//         ).bindPopup(
//           `<img src='${img}' class='popupCenter'/>` +
//             `<h3 style='text-align:center;'>${cityName}</h3>` +
//             `<p>${snippet}</p>`
//         );
//         cityMarkers.addLayer(city);
//       }
//       map.addLayer(cityMarkers);
//     },
//     error: function (err) {
//       console.log("no iso code found");
//     },
//   });
//   //Get Parks
//   $.ajax({
//     url: "libs/php/getParks.php",
//     data: {
//       iso: iso2,
//     },
//     success: function (result) {
//       if (parksMarkers) {
//         map.removeLayer(parksMarkers);
//       }
//       parksMarkers = L.markerClusterGroup();
//       const cityIcon = L.icon({
//         iconUrl: "libs/vendors/leaflet/images/icons/park_on.png",
//         iconSize: [30, 30],
//       });
//       const r = result["data"]["results"];
//       for (let i = 0; i < r.length; i++) {
//         const img = r[i]["images"][0]["sizes"]["thumbnail"]["url"];
//         const parkName = r[i]["name"];
//         const snippet = r[i]["snippet"];

//         let park = L.marker(
//           [r[i]["coordinates"]["latitude"], r[i]["coordinates"]["longitude"]],
//           { icon: cityIcon }
//         ).bindPopup(
//           `<img src='${img}' class='popupCenter'/>` +
//             `<h3 style='text-align:center;'>${parkName}</h3>` +
//             `<p>${snippet}</p>`
//         );
//         parksMarkers.addLayer(park);
//       }
//       map.addLayer(parksMarkers);
//     },
//     error: function (err) {
//       console.log("no iso code found");
//     },
//   });
//   //Get POI
//   $.ajax({
//     url: "libs/php/getPOI.php",
//     data: {
//       iso: iso2.toLowerCase(),
//     },
//     success: function (result) {
//       if (poiMarkers) {
//         map.removeLayer(poiMarkers);
//       }
//       poiMarkers = L.markerClusterGroup();
//       const poiIcon = L.icon({
//         iconUrl: "libs/vendors/leaflet/images/icons/poi_on.png",
//         iconSize: [30, 30],
//       });
//       console.log(iso2);
//       console.log(result);
//       const r = result["data"]["results"];
//       for (let i = 0; i < r.length; i++) {
//         const img = r[i]["images"][0]["sizes"]["thumbnail"]["url"];
//         const parkName = r[i]["name"];
//         const snippet = r[i]["snippet"];

//         let poi = L.marker(
//           [r[i]["coordinates"]["latitude"], r[i]["coordinates"]["longitude"]],
//           { icon: poiIcon }
//         ).bindPopup(
//           `<img src='${img}' class='popupCenter'/>` +
//             `<h3 style='text-align:center;'>${parkName}</h3>` +
//             `<p>${snippet}</p>`
//         );
//         poiMarkers.addLayer(poi);
//       }
//       map.addLayer(poiMarkers);
//     },
//     error: function (err) {
//       console.log("no iso code found");
//     },
//   });

// });
//Show Position Button
var positionShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/position_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(marker);
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/position_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        map.addLayer(marker);
        map.setView(marker.getLatLng(), 5);
        control.state("hideBar");
      },
    },
  ],
});
positionShowHide.addTo(map);

/////////Buttons!!!/////////////////////
var infoShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/info_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        $("#countryInfo").modal("show");

        control.state("showBar");
        weatherShowHide.state("hideBar");
        covidShowHide.state("hideBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/info_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        $("#countryInfo").hide();
        control.state("hideBar");
      },
    },
  ],
});
infoShowHide.addTo(map);

//Show Covid Button
var covidShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/covid_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        $("#covidOverlay").modal("show");
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/covid_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        $("#covidOverlay").hide();
        control.state("hideBar");
      },
    },
  ],
});
covidShowHide.addTo(map);

var weatherShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/weather-on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        $("#weatherOverlay").modal("show");
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/weather-off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        $("#weatherOverlay").hide();
        control.state("hideBar");
      },
    },
  ],
});
weatherShowHide.addTo(map);

//Show Cities Button
var cityMarkerShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/hotel_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(cityMarkers);

        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/hotel_off.png" width=18 />',
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
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/park_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(parksMarkers);
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/park_off.png" width=18 />',
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
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/poi_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(poiMarkers);
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/poi_off.png" width=18 />',
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
