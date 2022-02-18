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
        console.log(res["data"]);
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
    },
    error: function () {
      console.log("error");
    },
  });
});

//Get Country Shape
let countryShape;
$("#selectCountry").change(() => {
  $.ajax({
    url: "libs/php/getCountryBounds.php",
    success: function (res) {
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
  //Get Capital
  $.ajax({
    url: "libs/php/getCapital.php",
    dataType: "json",
    data: {
      iso: $("#selectCountry").val(),
    },
    success: function (res) {
      const result = res["data"];
      for (let i = 0; i < result.length; i++) {
        if ($("#selectCountry").val() == result[i]["iso2"]) {
          $("#currentCapital").html("Capital: " + result[i]["capital"]);
          console.log(result[i]["capital"]);
          break;
        } else {
          console.log($("#selectCountry").val());
        }
      }
    },
    error: function (err) {
      console.log("err");
    },
  });
  //Get Country And Flag
  $.ajax({
    url: "libs/php/getCountryAndFlag.php",
    dataType: "json",
    data: {
      iso: $("#selectCountry").val(),
    },
    success: function (res) {
      const result = res["data"];
      for (let i = 0; i < result.length; i++) {
        if ($("#selectCountry").val() == result[i]["iso2"]) {
          $("#currentCountry").html(result[i]["name"]);
          $("#currentFlag").html(
            `Country flag: <img src=${result[i]["flag"]} alt='no image'/>`
          );
          break;
        }
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
  //Get Population
  $.ajax({
    url: "libs/php/getCurrency.php",
    dataType: "json",
    data: {
      iso: $("#selectCountry").val(),
    },
    success: function (res) {
      for (let i = 0; i < res["data"].length; i++) {
        if ($("#selectCountry").val() == res["data"][i]["iso2"]) {
          $("#currentCurrency").html("Currency: " + res["data"][i]["currency"]);
          console.log("hher");
          break;
        }
        //console.log(pop[pop.length-1]['value'])
        //console.log(result[0]['populationCounts']['populationCounts']['value'])
      }
    },
    error: function (err) {
      console.log("err");
    },
  });
});

//Show/Hide Info Pannel
var showHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/info_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        $("#overlay").hide();
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/info_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        $("#overlay").show();
        control.state("hideBar");
      },
    },
  ],
});
showHide.addTo(map);

//Show user position
var showHide = L.easyButton({
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
        map.setView(marker.getLatLng(),5);
        control.state("hideBar");
      },
    },
  ],
});
showHide.addTo(map);
