//Get All Data
let employeeId;
$(document).ready(() => {
  $.ajax({
    url: "libs/php/getAll.php",
    data: {
      id: 1,
    },
    success(res) {
      const r = res["data"];
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
          console.log(r[i])
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
          //Get Location
       
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
});

//Submit Changes
$("#submitForm").submit(function (e) {
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
      console.log("submitted");
    },
    error: function (e) {
      console.log(e);
    },
  });

  

  $("#changeJobModal").modal("hide");
});

//Add Employee

$('#addEmployee').on('shown.bs.modal',()=>{
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
})
$("#newEmployeeForm").submit(function (e) {

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
      console.log("submitted");
    },
    error: function (e) {
      console.log(e);
    },
  });
  $("#addEmployee").modal("hide");
});
