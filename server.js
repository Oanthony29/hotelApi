const mongoose =require('mongoose');
const dotenv = require("dotenv");
dotenv.config({path: "./Config/config.env"})
const app =require('./app')

const DB = process.env.DATABASE;

mongoose.set("strictQuery", true);
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( ()=>{
    console.log("MongoDB is Connected")
}).then( ()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server is Connected")
    })
});