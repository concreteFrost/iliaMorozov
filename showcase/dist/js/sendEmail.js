$('#sendEmail').on('click',()=>{
    $.ajax({
        url:'php/sendMail.php',
        data:{
            userName: $('#userName').val(),
            userEmail: $('#userEmail').val(),
            userSubject:$('#userSubject').val(),
            userMessage: $('#userMessage').val()
        },
        success:function(res){
            console.log(res)
        },
        error:function(e){
            console.log('eee');
        }
    })
})