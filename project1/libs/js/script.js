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

     
      console.log(result["nativeName"]);

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

$('#currentCountry').on('DOMSubtreeModified',()=>{
  $.ajax({
    url:'libs/php/getWiki.php',
    data:{
      country: $('#currentCountry').html().replace(' ','_').toLowerCase()
    },
    success(res){
      console.log(res['data']);
      console.log(res['data']['geonames'][0]['wikipediaUrl']);
      $("#wikiPage").html(`<a href="https://${res['data']['geonames'][0]['wikipediaUrl']}" target='_blank'>Wikipedia</a>`)
    },
    error(err){
      console.log('error')
    }
  })
})

/////////////MARKERS/////////////////////////

//Show/Hide Info Pannel

let hotelMarkers;
//Get hotels
$("#selectCity").change(() => {
  $.ajax({
    url: "libs/php/getHotels.php",
    data: {
      city: $("#selectCity").val(),
    },
    success: function (result) {
      if (hotelMarkers) {
        map.removeLayer(hotelMarkers);
      }
      hotelMarkers = L.markerClusterGroup({
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
      const r = result["data"];
      for (let i = 0; i < r.length; i++) {
        let hMarker = L.marker([r[i]["lat"], r[i]["lon"]]);
        let rank = Math.ceil(r[i]["rank"]);
        let hName = hMarker.bindPopup(
          r[i]["itemName"] + "<br>" + "hotel rank :" + rank
        );
        hotelMarkers.addLayer(hName);
      }
      map.addLayer(hotelMarkers);
    },
    error: function (err) {
      console.log(err);
    },
  });
});

$("#selectCountry").change(() => {
  if (hotelMarkers) {
    map.removeLayer(hotelMarkers);
  }

  hotelShowHide.state("hideBar");
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

/////////ButtonS!!!/////////////////////
var infoShowHide = L.easyButton({
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
infoShowHide.addTo(map);

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

var airportShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/airport_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.addLayer(airportMarkers);
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/airport_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        map.removeLayer(airportMarkers);
        control.state("hideBar");
      },
    },
  ],
});
airportShowHide.addTo(map);

var hotelShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/hotel_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.addLayer(hotelMarkers);

        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/hotel_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        map.removeLayer(hotelMarkers);

        control.state("hideBar");
      },
    },
  ],
});
hotelShowHide.addTo(map);
