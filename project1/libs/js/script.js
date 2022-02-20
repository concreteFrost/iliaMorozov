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

//Get Country Shape and Info
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

  //Get Cities
  $.ajax({
    url: "libs/php/getCities.php",
    data:{
      iso : $("#currentCountry").html()
    },
    success: function (res) {
      res['data'].forEach((e)=>{
        if($("#currentCountry").html()==e['country']){
          e['cities'].forEach(c=>{
            $('#selectCity').append(`<option value=${c}>
            ${c}</option>`);
          })
        }
      })
  
      
     
    },
    error: function () {
      console.log("error");
    
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
          $("#currentCapital").html(result[i]["capital"]);

          break;
        } else {
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
  //Get Currency
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

          break;
        }
      }
    },
    error: function (err) {
      console.log("err");
    },
  });
});

let hotelMarkers;
//Get hotels
$("#selectCity").change(()=>{
  $.ajax({
    url:'libs/php/getHotels.php',
    data:{
      city: $("#selectCity").val()
    },
    success:function(result){
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
        showCoverageOnHover: false,
      });


      const r = result['data']
      for(let i=0;i<r.length;i++){
        let hMarker = L.marker([
          r[i]["lat"],
          r[i]["lon"],
          
        ]);
        let hName = hMarker.bindPopup(r[i]['itemName'])
        hotelMarkers.addLayer(hName);
        if(hotelShow){
          map.addLayer(hotelMarkers)
        }
      }
   
     
      console.log(r)
    },
    error:function(err){
      console.log(err);
    }
  })
})


//Get Airports
let airportMarkers;
$("#selectCountry").change(() => {
  $.ajax({
    url: "libs/php/getAirports.php",
    data: {
      iso: $("#selectCountry").val(),
    },
    success: function (res) {
      const result = res["data"];
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
        showCoverageOnHover: false,
      });
      for (let i = 0; i < result.length; i++) {
        let airportMarker = L.marker([
          result[i]["latitudeAirport"],
          result[i]["longitudeAirport"],
        ]);
        let airName = airportMarker.bindPopup(result[i]["nameAirport"]);
        if (
          result[i]["latitudeAirport"] == null ||
          result[i]["longitudeAirport"] == null ||
          result[i]["nameAirport"].includes("Station")
        ) {
          continue;
        } else {
          airportMarkers.addLayer(airName);
          if(airShow){
            map.addLayer(airportMarker)
          }
        }
      }

     // map.addLayer(airportMarkers);
    },
    error: function (err) {
      console.log("wtf");
    },
  });
});

//Show/Hide Info Pannel
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

//Show user position
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

var airShow;
var airportShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/airport_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.addLayer(airportMarkers);
        airShow = true;
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/airport_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        map.removeLayer(airportMarkers);
        airShow=false;
        control.state("hideBar");
      },
    },
  ],
});
airportShowHide.addTo(map)

let hotelShow;
var hotelShowHide = L.easyButton({
  states: [
    {
      stateName: "hideBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/hotel_on.png " width=18 />',
      title: "hide info",
      onClick: function (control) {
        map.addLayer(hotelMarkers);
        hotelShow=true;
        control.state("showBar");
      },
    },
    {
      stateName: "showBar",
      icon: '<img src="libs/vendors/leaflet/images/icons/hotel_off.png" width=18 />',
      title: "show info",
      onClick: function (control) {
        map.removeLayer(hotelMarkers);
        hotelShow = false;
        control.state("hideBar");
      },
    },
  ],
});
hotelShowHide.addTo(map);
