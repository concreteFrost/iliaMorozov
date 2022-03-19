$('#sendEmail').on('click',()=>{
    $.ajax({
        url:'showcase/dist/php/sendMail.php',
        data:{
            userName: $('#userName').val(),
            userEmail: $('#userEmail').val(),
            userSubject:$('#userSubject').val(),
            userMessage: $('#userMessage').val()
        },
        success:function(res){
          
        $('#emailSent').modal('show');

        $('#userName').val('')
        $('#userEmail').val(''),
        $('#userSubject').val(''),
        $('#userMessage').val('')
          
        $('#errorMessage').html('')
        
        },
        error:function(e){
           
            $('#errorMessage').html(e['responseText'])
        },
    })
})

$("#emailSent").on('show.bs.modal',()=>{
   
    setTimeout(function() { $('#emailSent').modal('hide'); }, 2400);
})

