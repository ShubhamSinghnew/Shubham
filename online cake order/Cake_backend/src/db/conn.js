const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin:admin@cluster0.fit8mu3.mongodb.net/test",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    //useCreateIndex:true,
}).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("no connection");
})