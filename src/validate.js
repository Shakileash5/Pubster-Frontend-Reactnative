export function validateName(name){
    if(name=="")
    {
        return [false,"Name is required"];
    }
    if(!isNaN(name[0])){
        return [false,"Name should not start with number !"]
    }
    else{
        return [true]
    }
}

export function validateEmail(email){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email=="")
    {
        return [false,"email is required"];
    }
    if(reg.test(email)==0){
        return [false,"Enter a valid email id!"];     
    }
    else{
        return [true];
    }
}

export function validateAge(dob){
    //var dateArrr = dob.split("-");
    var today = new Date();
    var toDate = new Date(dob);
    var age_now = today.getFullYear() - toDate.getFullYear();
    var m = today.getMonth() - toDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < toDate.getDate())) {
        age_now--;
    }
    if(age_now >= 18){
        return [true,age_now];
    }
    else{
        return [false,"Your too young to go enter a pub!"];
    }
}

export function validatePassword(password,confirmPassword){
    if(password==""){
        return [false,"Password can't be empty"];
    }
    else if(password.length<8){
        return [false,"Password can't be too short"];
    }
    else if(password != confirmPassword){
        return [false,"Password and confirm Password should match"];
    }
    else{
        return [true];
    }
}