const map = L.map('map').setView([51.505, -0.09], 13);
const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$(document).ready(()=>{
    $.ajax(
        'libs/php/getCountryList.php',{
            success:function(res){
                let arr = res.split('!');
                arr.forEach(el => {
                    console.log(el)
                    $("#selectCountry").append(`<option value=${el}>${el}</option>`);

                });
            
            },
            error:function(){
                console.log('error');
            }
        }
    )
})