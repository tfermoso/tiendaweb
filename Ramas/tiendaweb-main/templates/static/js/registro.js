window.onload=()=>{

    document.getElementById("repassword").onkeyup=validar
    document.getElementById("password").onkeyup=validar 
}


function validar(){
    let repassword=document.getElementById("repassword").value;
    let password=document.getElementById("password").value;
    if(password==repassword){
        document.getElementById("btnEnviar").disabled=false;
    }else{
        document.getElementById("btnEnviar").disabled=true;
    }
}
