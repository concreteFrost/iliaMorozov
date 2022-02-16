const map = L.map("map").setView([51.505, -0.09], 2);
const OpenStreetMap_Mapnik = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(map);

// var markers = L.markerClusterGroup();
// markers.addLayer(L.marker([0,200]));
// map.addLayer(markers);

//L.marker([0,200]).addTo(map).bindPopup("You Are Here").openPopup();
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
let countryShape;
$("#selectCountry").change(() => {
  $.ajax({
    url: "libs/php/getCountryBounds.php",
    success: function (res) {
      for (let i = 0; i < res["data"].length; i++) {
        if ($("#selectCountry").val() == res["data"][i]["iso"]) {
          if(map.hasLayer(countryShape)){
            map.removeLayer(countryShape);
          }
           let currentBound = res["data"][i]['bounds'];
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
