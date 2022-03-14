function refreshData(set_url, set_id) {
  $.ajax({
    url: set_url,
    data: {
      id: set_id,
    },
    success(res) {
      const r = res["data"];
      $("#companyTable").children().remove().end();

      if (r == "") {
        $("#errorMessage").html("No Results Found!");
        $("#onChangesError").modal("show");
      }
      for (let i = 0; i < r.length; i++) {
        const buttonName = r[i]["firstName"] + " " + r[i]["lastName"];

        // $("#companyTable").append("<tr/>");
        var tr = $("<tr>");
        $("#companyTable").append(tr);
        $(tr).append("<td>" + (i + 1) + "</td>");
        $(tr).append("<td>" + r[i]["firstName"] + "</td>");
        $(tr).append("<td>" + r[i]["lastName"] + "</td>");
        $(tr).append("<td>" + r[i]["department"] + "</td>");
        $(tr).append("<td>" + r[i]["location"] + "</td>");
        var container = $("<td>");
        $(tr).append(container);

        var b = $("<button/>").attr({
          "data-target": "#changeJobModal",
          "data-toggle": "modal",
          type: "button",

          class: "btn btn-success fa-solid fa-square-check",
        });
        $(b).on("click", () => {
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
        var deleteButton = $("<button/>").attr({
          "data-target": "#confirmEmployeeDeletion",
          "data-toggle": "modal",
          type: "button",

          class: "btn btn-danger fa-solid fa-square-xmark",
        });

        $(deleteButton).on("click", () => {
          $("#emplpoyeeToDelete").html(
            `${r[i]["firstName"]} ${r[i]["lastName"]}`
          );

          $("#confirmEmployeeDeletionButton").on("click", () => {
            $.ajax({
              url: "libs/php/deleteEmployee.php",
              data: {
                id: r[i]["id"],
              },
              success: function (res) {
                console.log("success");
                refreshData("libs/php/getAll.php");
              },
              error: function (err) {},
            });
          });
        });
        $(container).append(b);
        $(container).append(deleteButton);

        $("#companyTable").append("</tr>");
      }
      $("tr:odd").css("background-color", "#e8e8e8");
    },
    error(e) {
      console.log(e["responseText"]);
    },
  });
}
//HIDE MODAL ON CHANGES SAVED
function onChangesSaved(message) {
  $("#successBodyText").html(message);
  $("#onChangesSaved")
    .modal("show")
    .on("shown.bs.modal", function () {
      window.setTimeout(function () {
        $("#onChangesSaved").modal("hide");
      }, 2400);
    });
}

//CREATE ERROR MESSAGE
function errorMessage(response, insertBefore) {
  if ($("#er").length < 1) {
    $(`<p id='er'></p>`).insertBefore(insertBefore);
  }
  $("#er").text(response);
}
//REMOVE ERROR MESSAGE ON MODAL CLOSE
$(document).on("hidden.bs.modal", function () {
  if ($("#er").length > 0) {
    $("#er").remove();
  }

  $('select').empty()
});

let employeeId;
//GET ALL
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
      onChangesSaved("Changes were saved successfully!");
      refreshData("libs/php/getAll.php");
      $("#changeJobModal").modal("hide");
    },
    error: function (e) {
      const response = e["responseText"];
      errorMessage(response, "#workerName");
    },
  });
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
      onChangesSaved("New employee were added successfully!");
      refreshData("libs/php/getAll.php");
      $("#addEmployee").modal("hide");
    },
    error: function (e) {
      const response = e["responseText"];
      console.log(response);
      errorMessage(response, "#addNewEmployee");
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

      $("#showAll").on("click", () => {
        refreshData("libs/php/getAll.php");
      });
    },
    error: function (err) {
      console.log(err);
    },
  });
});

//Edit department
$("#department-dropdown").on("click", () => {
  $("#edit-department").toggle();
});

//EMPLOYEE SEARCH
$("#searchForm").on("change", function () {
  refreshData("libs/php/getEmployee.php", $("#searchForm").val());
});

function fillDepartmentLocations(res, toFill) {
  $(toFill).children().remove().end();
  res["data"].forEach((e) => {
    $(toFill).append(
      $("<option>", {
        value: e['id'],
        text: e["name"],
      })
    );
  });
}
//ADD DEPARTMENT / FILL SELECT SECTION
$("#addNewDepartmentModal").on("shown.bs.modal", () => {
  $.ajax({
    url: "libs/php/getAllLocations.php",
    success: function (res) {
      fillDepartmentLocations(res, "#DepartmentLocation");
    },
  });
});


//ADD DEPARTMENT/ SUBMIT
$("#submitNewDepartment").on("click", () => {
  $.ajax({
    url: "libs/php/addDepartment.php",
    data: {
      department: $("#DepartmentName").val(),
      location: $("#DepartmentLocation").val(),
    },
    success: function (res) {
      $("#addNewDepartmentModal").modal("hide");
      onChangesSaved("New department was added successfully!");
      refreshData("libs/php/getAll.php");
    },
    error: function (err) {
      const response = err["responseText"];
      console.log(response);
      errorMessage(response, "#DepartmentName");
    },
  });
});


//EDIT DEPARTMENT/ FILL FORM
$("#editDepartmentModal").on("shown.bs.modal", () => {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    success: function (res) {
      fillDepartmentLocations(res, "#editDepartmentName");
      $('#changeDepartmentName').val($('#editDepartmentName option:selected').text())
    },
  });

  $.ajax({
    url: "libs/php/getAllLocations.php",
    success: function (res) {
      fillDepartmentLocations(res, "#editDepartmentLocation");
     
    },
  });
});

$('#editDepartmentName').on('change',()=>{
  $('#changeDepartmentName').val($('#editDepartmentName option:selected').text())
})

//EDIT DEPARTMENT/ CHANGE NAME
$("#submitEditDepartment").on('click',()=>{
  $.ajax({
    url:'libs/php/setDepartmentName.php',
    data:{
      name:  $('#changeDepartmentName').val(),
      id: $('#editDepartmentName').val()
    },
    success:function(res){
      onChangesSaved("Changes were saved successfully!");
      refreshData("libs/php/getAll.php");
      $("#editDepartmentModal").modal("hide");
    },
    error:function(e){
    errorMessage(e['responseText'],'#editDepartmentName')
    }
  })
})

//Delete Department
$("#deleteDepartment").on('click',()=>{
  $.ajax({
    url:'libs/php/deleteDepartmentByID.php',
    data:{
      id: $('#editDepartmentName').val()
    },
    success:function(res){
      refreshData("libs/php/getAll.php");
      $("#editDepartmentModal").modal("hide");
    },
    error:function(e){
    errorMessage(e['responseText'],'#editDepartmentName')
    }
  })
})
