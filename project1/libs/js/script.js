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

var latLon = [];
//Get Capital/Flag/Currency
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

      $("#currentCountry").html(result["nativeName"]);
      $("#currentCapital").html("Capital: " + result["capital"]);
      $("#currentFlag").html(
        `Country flag: <img src=${result["flag"]} alt='no image' style='width : 30px'/>`
      );
      $("#currentCurrency").html(
        "Currency: " + result["currencies"][0]["name"]
      );
      $("#currentPopulation").html("Population: " + result["population"]);
    },
    error: function (err) {
      console.log("err");
    },
  });
});

//Get Covid
$("#selectCountry").change(() => {
  $.ajax({
    url: "libs/php/getCovid.php",
    data: {
      iso: $("#selectCountry").val(),
    },
    success: function (res) {
      r = res["data"];
      $("#confirmed").html("Confirmed: " + r["confirmed"]);
      $("#deaths").html("Deaths: " + r["deaths"]);
      $("#recovered").html("Recovered: " + r["recovered"]);
      $("#active").html("Active: " + r["active"]);
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

let museumMarkers;
//Get Museums
$("#currentCountry").on("DOMSubtreeModified", () => {
  $.ajax({
    url: "libs/php/getCafes.php",
    data: {
      lon: latLon[0],
      lat: latLon[1],
    },
    success: function (result) {
      if (museumMarkers) {
        map.removeLayer(museumMarkers);
      }
      museumMarkers = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
          return L.divIcon({
            html:
              "<b>" +
              '<img src="libs/vendors/leaflet/images/icons/hotel_on.png" width=32/>' +
              cluster.getChildCount() +
              "</b>",
            className: "my-div-icons",
          });
        },
      });
      console.log(latLon);
      const r = result["data"];
      console.log(result);
      for (let i = 0; i < r.length; i++) {
      
        let mMarker = L.marker([
          r[i]["location"]["lat"],
          r[i]["location"]["lng"],
        ]);
        let web = r[i]["website"];
        let name = "<p> Name: " + r[i]["name"] + "</p>"+
        "<p> Address: " + r[i]["address"] + "</p>"+
        "<p> Phone number: " + r[i]["phone_number"] + "</p>"+
        `<a href="https://${web}">${web}</a>`
        ;
       
        let mName = mMarker.bindPopup(name);
       
        museumMarkers.addLayer(mName);
      }
      map.addLayer(museumMarkers);
    },
    error: function (err) {
      console.log(err);
    },
  });
});

//Get Airports
let airportMarkers;
$("#selectCountry").change(() => {
  $.ajax({
    url: "libs/php/getAirports.php",
    data: {
      iso: $("#selectCountry").val(),
    },
    success: function (res) {
      if (airportMarkers) {
        map.removeLayer(airportMarkers);
      }

      airportMarkers = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
          return L.divIcon({
            html:
              "<b>" +
              '<img src="libs/vendors/leaflet/images/icons/airportOnMap.png" width=32/>' +
              cluster.getChildCount() +
              "</b>",
            className: "my-div-icons",
          });
        },
      });
      const result = res["data"];
      for (let i = 0; i < result.length; i++) {
        let airportMarker = L.marker([
          result[i]["latitudeAirport"],
          result[i]["longitudeAirport"],
        ]).bindPopup(result[i]["nameAirport"]);

        if (
          result[i]["latitudeAirport"] == null ||
          result[i]["longitudeAirport"] == null ||
          result[i]["nameAirport"].includes("Station")
        ) {
          continue;
        } else {
          airportMarkers.addLayer(airportMarker);
        }
        map.addLayer(airportMarkers);
      }
    },
    error: function (err) {
      console.log("wtf");
    },
  });
});

/////////Buttons!!!/////////////////////
var infoShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/info_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        $("#overlay").show();
     
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/info_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        $("#overlay").hide();
        control.state("hideBar");
      },
    },
  ],
});
infoShowHide.addTo(map);

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

//Show Airports Button
var airportShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/airport_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(airportMarkers);
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/airport_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        map.addLayer(airportMarkers);
        control.state("hideBar");
      },
    },
  ],
});
airportShowHide.addTo(map);

//Show Hotels Button
var hotelShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/hotel_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.removeLayer(museumMarkers);

        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/hotel_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
       
        map.addLayer(museumMarkers);
        control.state("hideBar");
      },
    },
  ],
});
hotelShowHide.addTo(map);

//Show Covid Button
var covidShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/covid_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        
        $("#covidOverlay").show();
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
