const mongoose = require("mongoose");

const customer = new mongoose.Schema({

    Name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    
//    confirmpassword:{
//        type:String,
//        required:true

       
//     }
    
    
})

//we need to create collections
const Register = new mongoose.model("Register",customer);

module.exports = Register;

/////////////////////                   collection created             //////////////////////////////////////////////////////////////////////////////
