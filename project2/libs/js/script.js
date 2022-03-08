//Get All Data
$(document).ready(()=>{
    $.ajax({
        url:'libs/php/getAll.php',
        success(res){
            console.log('yes');
        },
        error(e){
            console.log(e);
        }
        
    })
})