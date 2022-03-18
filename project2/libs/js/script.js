window.addEventListener('load',()=>{
  setTimeout(()=>{$('#loader').hide();},1500)
});

$(document).ready(() => {
  refreshData("personnel", "libs/php/getAll.php");
});

$(document).on("hidden.bs.modal", function () {
  if ($("#er").length > 0) {
    $("#er").remove();
  }
  $("select").empty();
});



let employeeId;
let departmentID;
let locationID;
let dataToDelete;
//MAIN FUNCTION
function refreshData(table, url, dataVal) {
  $("#tableHead").find("th").remove().end();
  $("#tableBody").find("td").remove().end();
  $("select").find("option").remove().end();
  $.ajax({
    url: url,
    data: {
      id: dataVal,
    },
    success: function (res) {
      if (res["data"].length == 0) {
        noResultsFound();
      }
      const r = res["data"];
      var head;
      var body;

      for (let i = 0; i < r.length; i++) {
        var editButton = $("<button/>").attr({
          "data-toggle": "modal",
          type: "button",
          class: "btn btn-success fa-solid fa-square-pen mr-1 ",
        });
        var deleteButton = $("<button/>").attr({
          "data-toggle": "modal",
          type: "button",
          class: "btn btn-danger fa-solid fa-trash-can ",
        });
        switch (table) {
          case "personnel":
            {
              $('.navbar-nav').children('li').eq(0).attr('class','active')
              $('.navbar-nav').children('li').eq(1).removeClass('active')
              $('.navbar-nav').children('li').eq(2).removeClass('active')
              $('#search-bar').show()
             $('.confirmDeleteButton').attr('id','deletePersonnel')
            
              $("#navButton").attr("data-target", "#addEmployee");
           
              body = `<td>${r[i]["lastName"]}, ${r[i]["firstName"]}</td>
            <td>${r[i]["department"]}</td><td class="d-none d-sm-block">${
                r[i]["location"]
              }
            </td>`;
              $(editButton).attr("data-target", "#editEmployeeModal");
              $(editButton).on("click", () => {
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
                      $("#employeeDepartment").append(
                        $("<option>", {
                          value: e["id"],
                          text: e["name"],
                        })
                      );
                    });

                    $("#employeeDepartment").val(r[i]["departmentID"]);
                  },
                  error: function (err) {
                    console.log(err);
                  },
                });
              });
              $(deleteButton).on('click',()=>{
                employeeId=r[i]['id']
                $('#confirmDeleteModal').modal('show')
              })
            }
            break;
          case "department":
            {
              $('.navbar-nav').children('li').eq(1).attr('class','active')
              $('.navbar-nav').children('li').eq(0).removeClass('active')
              $('.navbar-nav').children('li').eq(2).removeClass('active')
              $('#search-bar').hide()
      
              
              $("#navButton").attr("data-target", "#addNewDepartmentModal");
            
              body = `<td>${r[i]["name"]}</td><td>${
                r[i]["location"]
              }</td>`;

              $(editButton).attr("data-target", "#editDepartmentModal");
              $(editButton).on("click", () => {
                $("#editDepartmentName").val(r[i]["name"]);
                departmentID = r[i]["id"];
                //Get Department
                $.ajax({
                  url: "libs/php/getAllLocations.php",
                  success: function (res2) {
                    const r2 = res2["data"];
                    r2.forEach((e) => {
                      $("#editDepartmentLocation").append(
                        $("<option>", {
                          value: e["id"],
                          text: e["name"],
                        })
                      );
                    });

                    $("#editDepartmentLocation").val(r[i]["lID"]);
                  },
                  error: function (err) {
                    console.log(err);
                  },
                });
              });
              $(deleteButton).on('click',()=>{
                $.ajax({
                  url: "libs/php/checkDepartmentDependencies.php",
                  data: {
                    id: r[i]['id']
                  },
                  success: function (res) {
                    $('.confirmDeleteButton').attr('id','deleteDepartment')
                    $('#confirmDeleteModal').modal('show')
                    departmentID=r[i]['id']
                  },
                  error: function (e) {
                    $('#unableToDelete').modal('show')
                    $("#dataToDelete2").html(r[i]['name'])
                    errorMessage(e["responseText"], "#appendUnable");
                  },
                });
              })
            }
            break;
          case "location":
            {
              $('.navbar-nav').children('li').eq(2).attr('class','active')
              $('.navbar-nav').children('li').eq(0).removeClass('active')
              $('.navbar-nav').children('li').eq(1).removeClass('active')
              $('#search-bar').hide()
              $('.confirmDeleteButton').attr('id','deleteLocation')
         
              $("#navButton").attr("data-target", "#addNewLocationModal");
             
              body = `<td>${r[i]["name"]}</td>`;

              $(editButton).attr("data-target", "#editLocationModal");
              $(editButton).on("click", () => {
                $("#editLocationName").val(r[i]["name"]);
                locationID = r[i]["id"];
                //Get Department
                $.ajax({
                  url: "libs/php/getAllLocations.php",
                  success: function (res2) {
                    const r2 = res2["data"];
                    r2.forEach((e) => {
                      $("#editDepartmentLocation").append(
                        $("<option>", {
                          value: e["id"],
                          text: e["name"],
                        })
                      );
                    });

                    $("#editDepartmentLocation").val(r[i]["lID"]);
                  },
                  error: function (err) {
                    console.log(err);
                  },
                });
              });
              $(deleteButton).on('click',()=>{
                $.ajax({
                  url: "libs/php/checkLocationDependencies.php",
                  data: {
                    id: r[i]['id']
                  },
                  success: function (res) {
                    $('.confirmDeleteButton').attr('id','deleteLocation')
                    $('#confirmDeleteModal').modal('show')
                    locationID=r[i]['id']
                  },
                  error: function (e) {
                    $('#unableToDelete').modal('show')
                    $("#dataToDelete2").html(r[i]['name'])
                    errorMessage(e["responseText"], "#appendUnable");
                  },
                });
              })
            }
            break;
        }

        var tr = $("<tr></tr>");
        var container = $("<td  class='text-nowrap'>");
        $("#tableBody").append(tr);
        $(tr).append(body);
        $(container).append(editButton);
        $(container).append(deleteButton);
        $(tr).append(container);
        $(deleteButton).on("click", () => {
          if (r[i]["firstName"] != null) {
            dataToDelete = r[i]["firstName"] + " " + r[i]["lastName"];
          } else {
            dataToDelete = r[i]["name"];
          }
        });
      }

      $("#tableHead").append(head);
      $("tr:odd").css("background-color", "#e8e8e8");
    },
    error: function (e) {
      errorMessage(response, "#DepartmentName");
    },
  });
}

$("#navPersonnel").on("click", () => {
  refreshData("personnel", "libs/php/getAll.php");
});

$("#navDepartment").on("click", () => {
  refreshData("department", "libs/php/getAllDepartments.php");
});

$("#navLocation").on("click", () => {
  refreshData("location", "libs/php/getAllLocations.php");
});

//ON CHANGES SUCCESS
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

function noResultsFound() {
  $("#errorMessage").html("No results found");
  $("#onChangesError")
    .modal("show")
    .on("shown.bs.modal", function () {
      window.setTimeout(function () {
        $("#onChangesError").modal("hide");
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

$("#confirmDeleteModal").on("shown.bs.modal", () => {
  $("#dataToDelete").html(dataToDelete);

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
      refreshData("personnel", "libs/php/getAll.php");
      $("#addEmployee").modal("hide");
    },
    error: function (e) {
      const response = e["responseText"];
      console.log(response);
      errorMessage(response, "#addNewEmployee");
    },
  });
});

$("#editDetailsButton").on("click", function (e) {
  $.ajax({
    url: "libs/php/setDetails.php",
    data: {
      fName: $("#fName").val(),
      sName: $("#sName").val(),
      email: $("#email").val(),
      jobTitle: $("#job").val(),
      id: employeeId,
      department: $("#employeeDepartment").val(),
    },
    success: function (res) {
      onChangesSaved("Changes were saved successfully!");
      refreshData("personnel", "libs/php/getAll.php");
      $("#editEmployeeModal").modal("hide");
    },
    error: function (e) {
      const response = e["responseText"];
      errorMessage(response, "#fName");
    },
  });
});

//EMPLOYEE SEARCH
$("#searchForm").on("change", function () {
  refreshData("personnel", "libs/php/getEmployee.php", $("#searchForm").val());
});

//EDIT DEPARTMENT/ CHANGE NAME
$("#submitEditDepartment").on("click", () => {
  $.ajax({
    url: "libs/php/setDepartmentName.php",
    data: {
      name: $("#editDepartmentName").val(),
      id: departmentID,
      location: $("#editDepartmentLocation").val(),
    },
    success: function (res) {
      onChangesSaved("Changes were saved successfully!");
      refreshData("department", "libs/php/getAllDepartments.php");
      $("#editDepartmentModal").modal("hide");
    },
    error: function (e) {
      errorMessage(e["responseText"], "#editDepartmentName");
    },
  });
});
//ADD DEPARTMENT / FILL SELECT SECTION
$("#addNewDepartmentModal").on("shown.bs.modal", () => {
  $.ajax({
    url: "libs/php/getAllLocations.php",
    success: function (res) {
      fillDepartmentLocations(res, "#DepartmentLocation");
    },
    error: function (err) {
      console.log(err);
    },
  });
});
//ADD DEPARTMENT/ SUBMIT
function fillDepartmentLocations(res, toFill) {
  $(toFill).children().remove().end();
  res["data"].forEach((e) => {
    $(toFill).append(
      $("<option>", {
        value: e["id"],
        text: e["name"],
      })
    );
  });
}
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
      refreshData("department", "libs/php/getAllDepartments.php");
    },
    error: function (err) {
      const response = err["responseText"];
      console.log(response);
      errorMessage(response, "#DepartmentName");
    },
  });
});

$("#submitNewLocation").on("click", () => {
  $.ajax({
    url: "libs/php/addLocation.php",
    data: {
      name: $("#LocationName").val(),
    },
    success: function (res) {
      $("#addNewLocationModal").modal("hide");
      onChangesSaved("New location was added successfully!");
      refreshData("location", "libs/php/getAllLocations.php");
    },
    error: function (err) {
      const response = err["responseText"];
      console.log(response);
      errorMessage(response, "#LocationName");
    },
  });
});

//EDIT LOCATION
$("#submitEditLocation").on("click", () => {
  $.ajax({
    url: "libs/php/setLocationName.php",
    data: {
      name: $("#editLocationName").val(),
      id: locationID,
    },
    success: function (res) {
      onChangesSaved("Changes were saved successfully!");
      refreshData("location", "libs/php/getAllLocations.php");
      $("#editLocationModal").modal("hide");
    },
    error: function (e) {
      errorMessage(e["responseText"], "#editLocationName");
    },
  });
});

//Delete Data
$('.confirmDeleteButton').on('click',()=>{
  switch($('.confirmDeleteButton').attr('id')){
    case 'deletePersonnel':{
      $.ajax({
        url: "libs/php/deleteEmployee.php",
        data: {
          id: employeeId,
        },
        success: function (res) {
          $('#confirmDeleteModal').modal('hide')
          onChangesSaved("Changes were saved successfully!");
          refreshData('personnel',"libs/php/getAll.php");
        },
        error: function (err) {},
      });
    }
    break;
    case 'deleteDepartment':{
      $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        data: {
          id: departmentID
        },
        success: function (res) {
          $('#confirmDeleteModal').modal('hide')
          onChangesSaved("Changes were saved successfully!");
          refreshData('department',"libs/php/getAllDepartments.php");
         
        },
        error: function (e) {
          console.log(e['responseText'])
          errorMessage(e["responseText"], "#appendDelete");
        },
      });
    }
    break;
    case 'deleteLocation':{
      $.ajax({
        url: "libs/php/deleteLocationByID.php",
        data: {
          id: locationID
        },
        success: function (res) {
          $('#confirmDeleteModal').modal('hide')
          onChangesSaved("Changes were saved successfully!");
          refreshData('location',"libs/php/getAllLocations.php");
         
        },
        error: function (e) {
          console.log(e['responseText'])
          errorMessage(e["responseText"], "#appendDelete");
        },
      });
    }
    break;
  }
})

