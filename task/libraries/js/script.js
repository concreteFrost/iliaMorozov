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
        $("#result").html("Fact: ");
        $("#result").append(finalRender.concat("."));
      }
    },

    error: function (jqXHR, status, err) {
      console.log(err);
    },
  });
});

//Get Temperature by City
$("#btnICAO").on("click", () => {
  $.ajax({
    url: "libraries/php/getTemperature.php",
    type: "POST",
    dataType: "json",
    data: {
      ICAO: $("#selICAO").val(),
    },

    success: function (result) {
      if (result.status.name == "ok") {
        var currTemp =
          "Current temperature in " +
          result["data"]["stationName"] +
          " is: " +
          result["data"]["temperature"] +
          "°C";
        $("#result").html(currTemp);
      }
    },

    error: function (jqXHR, status, err) {
      console.log(err);
    },
  });
});

//Postcode button
$("#btnPostcode").on("click", () => {
  $.ajax({
    url: "libraries/php/getCityNameByPostcode.php",
    type: "POST",
    dataType: "json",
    data: {
      postcode: $("#postcode").val(),
    },

    success: function (result) {
      if (result.status.name == "ok") {
        $("#result").html("City name:");
        $("#result").append(result["data"][0]["placeName"]);
      }
    },

    error: function (jqXHR, status, err) {
      console.log(err);
    },
  });
});


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
