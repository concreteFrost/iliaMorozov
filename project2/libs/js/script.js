//Get All Data


function refreshData(set_url, set_id) {
  $.ajax({
    url: set_url,
    data: {
      id: set_id,
    },
    success(res) {
      const r = res["data"];
      $("#companyTable").children().remove().end();
      for (let i = 0; i < r.length; i++) {
        const buttonName = r[i]["firstName"] + " " + r[i]["lastName"];
        $("#companyTable").append("<tr>");
        $("#companyTable").append("<td>" + r[i]["id"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["firstName"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["lastName"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["jobTitle"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["department"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["location"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["email"] + "</td>");

        var b = $("<button/>").attr({
          "data-target": "#changeJobModal",
          "data-toggle": "modal",
          type: "button",

          class: "btn btn-success fa-solid fa-square-check",
        });
        $(b).on("click", () => {
          console.log(r[i]);
          $("#workerName").html(buttonName);
          $("#job").val(r[i]["jobTitle"]);
          $("#fName").val(r[i]["firstName"]);
          $("#sName").val(r[i]["lastName"]);
          $("#email").val(r[i]["email"]);
          employeeId = r[i]["id"];
          //Get Department
          $.ajax({
            url: "libs/php/getAllDepartments.php",
            success: function (res2) {
              const r2 = res2["data"];
              r2.forEach((e) => {
                $("#department").append(
                  $("<option>", {
                    value: e["id"],
                    text: e["name"],
                  })
                );
              });
              $("#department").val(r[i]["departmentID"]);
            },
            error: function (err) {
              console.log(err);
            },
          });
        });
        $("#companyTable").append(b);
        $(b).wrap("<td>", "</td>");

        $("#companyTable").append("</tr>");
      }
    },
    error(e) {
      console.log(e["responseText"]);
    },
  });
}

function onChangesSaved(message){
  $('#successBodyText').html(message)
  $("#onChangesSaved").modal("show").on("shown.bs.modal", function () {
    window.setTimeout(function () {
        $("#onChangesSaved").modal("hide");
    }, 2400);
});
}
let employeeId;
$(document).ready(() => {
  refreshData("libs/php/getAll.php");
});

//Submit Changes
$("#editDetailsButton").on("click", function (e) {
  $.ajax({
    url: "libs/php/setDetails.php",
    data: {
      fName: $("#fName").val(),
      sName: $("#sName").val(),
      email: $("#email").val(),
      jobTitle: $("#job").val(),
      id: employeeId,
      department: $("#department").val(),
    },
    success: function (res) {
      onChangesSaved('Changes were saved successfully!');
      refreshData("libs/php/getAll.php");
    },
    error: function (e) {
      $("#onChangesError").modal("show")
    },
  });

  $("#changeJobModal").modal("hide");
});

//Add Employee
$("#addEmployee").on("shown.bs.modal", () => {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    success: function (res2) {
      const r2 = res2["data"];
      r2.forEach((e) => {
        $("#department2").append(
          $("<option>", {
            value: e["id"],
            text: e["name"],
          })
        );
      });
    },
    error: function (err) {
      console.log(err);
    },
  });
});
$("#addEmployeeButton").on("click", function (e) {
  $.ajax({
    url: "libs/php/addEmployee.php",
    data: {
      fName: $("#fName2").val(),
      sName: $("#sName2").val(),
      email: $("#email2").val(),
      jobTitle: $("#job2").val(),
      department: $("#department2").val(),
    },
    success: function (res) {
      
      onChangesSaved('New employee were added successfully!')
      refreshData("libs/php/getAll.php");
      $("#addEmployee").modal("hide");
    },
    error: function (e) {
      const response = e['responseText'];
      console.log(response)
     if($('#er').length<1){
      $(`<p id='er'></p>`).insertBefore('#addNewEmployee')
    
     }
     $('#er').text(response)
    },
  });
  
});

//Filtering
$("#dropdown").on("click", function (e) {
  $(".dropdown-menu").children().remove().end();
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    success: function (res2) {
      const r2 = res2["data"];
      $(".dropdown-menu").append(
        '<div class="dropdown-item" id="showAll">Show All</div>'
      );
      r2.forEach((e) => {
        $(".dropdown-menu").append(
          '<div class="dropdown-item" id="dropdown' +
            e["id"] +
            '">' +
            e["name"] +
            "</div>"
        );
        $("#dropdown" + e["id"]).on("click", () => {
          refreshData("libs/php/getDepartmentByID.php", e["id"]);
        });
      });

      $("#showAll").on('click',()=>{
        refreshData('libs/php/getAll.php')
      })
    },
    error: function (err) {
      console.log(err);
    },
  });
});
