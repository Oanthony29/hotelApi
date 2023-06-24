const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path: "./Config/config.env"});
const cors = require("cors");
const fileUpload = require("express-fileupload")
const router = require("./Routers/admin")

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router)
app.use(fileUpload({ 
    useTempFiles: true
}))



app.get("/", (req,res)=>{
    res.send("Welcome Message ")
});

app.use("/uploaded-image", express.static(process.cwd() + "/uploads"));

module.exports = app