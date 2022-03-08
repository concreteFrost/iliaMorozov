//Get All Data
$(document).ready(() => {
  $.ajax({
    url: "libs/php/getAll.php",
    success(res) {
      const r = res["data"];

      for (let i = 0; i < r.length; i++) {
        $("#companyTable").append("<tr>");
        $("#companyTable").append('<td>' + (i+1) + '</td>');
        $("#companyTable").append('<td>' + r[i]['firstName'] + '</td>');
        $("#companyTable").append('<td>' + r[i]['lastName'] + '</td>');
        $("#companyTable").append('<td>' + r[i]['department'] + '</td>');
        $("#companyTable").append('<td>' + r[i]['location'] + '</td>');
        $("#companyTable").append('<td>' + r[i]['email'] + '</td>');
        $("#companyTable").append('<td>' + '<button class="btn btn-success"><i class="fa-solid fa-pen-to-square"></i></button> '+ '</td>');
        $("#companyTable").append("</tr>");
      }
    },
    error(e) {
      console.log(e["responseText"]);
    },
  });
});
