function validation(){
    //warning for username
     if(document.formfill.username.value=""){
        document.getElementById("warning").innerHTML="Enter Username";
        return false;
     }
     //warning for email
     else if(document.formfill.email.value==""){
        document.getElementById("warning").innerHTML="Please Enter the E-mail";
        return false;
     }
     else if(document.formfill.password.value==""){
        document.getElementById("warning").innerHTML="Enter your Password";
        return false;
     }
     else if(document.formfill.password.value.length<6){
        document.getElementById("warning").innerHTML="Combination of at least 6 characters is required";
        return false;
     }
     else if(document.formfill.cpassword.value==""){
        document.getElementById("warning").innerHTML="Confirm  your Password";
        return false;
     }
     else if(document.formfill.password.value!==document.formfill.cpassword.value){
        document.getElementById("warning").innerHTML="Password doesn't match";
        return false;
     }
     else if(document.formfill.password.value==document.formfill.cpassword.value){
        popup.classList.add("open-slide")
        return false;
     }
    
}
var popup=document.getElementById("popup");
function CloseSlide(){
   popup.classList.remove("open-slide")
}