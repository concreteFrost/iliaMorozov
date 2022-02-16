const map = L.map("map").setView([51.505, -0.09], 13);
const OpenStreetMap_Mapnik = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(map);

$(document).ready(() => {
  $.ajax({
    url: "libs/php/getCountryList.php",
    success: function (res) {
        console.log(res['data'][0]['iso'])
        res['data'].forEach(el => {
            $("#selectCountry").append(`<option value=${el['iso']}>
            ${el['name']}</option>`)
        });
    },
    error: function () {
      console.log("error");
    }
  });
});
