//Get City Fact
$("#btnCityFact").on("click", () => {
  $.ajax({
    url: "libraries/php/getCityFact.php",
    type: "POST",
    dataType: "json",
    data: {
      city: $("#selCity").val(),
    },

    success: function (result) {
      if (result.status.name == "ok") {
        let render = result["data"][0]["summary"];
        let temp = "";

        let finalRender = oneSentence(render, temp);

        $("#cityFact").html(finalRender.concat("."));
      }
    },

    error: function (jqXHR, status, err) {
      console.log(err);
    },
  });
});


$('#postcodeForm').submit(()=>{


  $.ajax({
    url: "libraries/php/getCityNameByPostcode.php",
    type: "GET",
    dataType: "json",
    data: {
      countryCode: $("#postcodeForm").val(),
    },

    success: function (result) {
      if (result.status.name == "ok") {
      
        $("#cityName").html(result[data][0]['countryCode']);
      }
    },

    error: function (jqXHR, status, err) {
      console.log(err);
    },
    
  });

})

//Convert to one sentence
function oneSentence(value, result) {
  for (let i = 0; i < value.length; i++) {
    if (value[i] == ".") {
      break;
    } else {
      result += value[i];
    }
  }

  return result;
}