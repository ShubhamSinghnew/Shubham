const mongoose = require("mongoose");

const cakes = new mongoose.Schema({

    Cake_Name:{
        type:String,
        required:true
    },
    
    Cake_description:{
        type:String,
        required:true
    },

    Price: {
        type:Number,
        required:true
    },
    Flavour:{
       type: String,
       required:true
    },
    Weight:{
        type:Number,
        required:true
     },
     Category:{
         type:String,
         required:true
     },
     Shopkeeper_Name:{
        type:String,
        required:true
     },
     Shop_Name:{
        type:String,
        required:true
     },
     Shop_Mobile:{
        type:Number,
        required:true
     },
     Cake_Image_Link: {
        type:String,
        required:true
     }
     
});

//we need to create collections
const NewCakes = new mongoose.model("NewCakes",cakes);

module.exports = NewCakes;