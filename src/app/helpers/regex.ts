const regexDict={
    email: /^\S+@\S+\.\S+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
}

export default function regex(){
    return Object.freeze({
        isEmailValid:isEmailValid,
        isPasswordValid:isPasswordValid
    })
    
    function isEmailValid(email:string):boolean{
        return !!email.match(regexDict.email)
    }

    function isPasswordValid(password:string):boolean{
        return !!password.match(regexDict.password)
    }
}