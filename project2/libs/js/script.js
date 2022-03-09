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
      function changeName() {
        console.log("aaaaaaaa");
      }
      for (let i = 0; i < r.length; i++) {
        const buttonName = r[i]["firstName"] +" " + r[i]['lastName'];
        $("#companyTable").append("<tr>");
        $("#companyTable").append("<td>" + r[i]["id"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["firstName"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["lastName"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["jobTitle"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["department"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["location"] + "</td>");
        $("#companyTable").append("<td>" + r[i]["email"] + "</td>");
       
        var b = $('<button/>').attr({
          'data-target':'#changeJobModal',
          'data-toggle':'modal',
          type: 'button',
         
          class: "btn btn-success fa-solid fa-square-check",
        })
        $(b).on('click',()=>{
          $('#workerName').html(buttonName)
          $('#job').val(r[i]["jobTitle"])
          employeeId =r[i]['id']
        })
        $("#companyTable").append(b)
        $(b).wrap('<td>','</td>')
       
      
        $("#companyTable").append("</tr>");
      }
    },
    error(e) {
      console.log(e["responseText"]);
    },
  });
});



//Submit Changes
$('#submitForm').submit(function(e){
 
  $.ajax({
    url:'libs/php/setJob.php',
    data:{
      jobTitle:  $("#job").val(),
      id:employeeId,
    },
    success:function(res){
      console.log('submitted')
    },
    error:function(e){
      console.log(e);
    }
  })

  $('#changeJobModal').modal('hide')
})
