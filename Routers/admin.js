const express= require("express");
const{newRegister}= require("../Controllers/regController")
const Router = express.Router()
Router.route("/admin").post(newRegister); 
// Route.route("/userVerify/:id").post(confirmVerify);
module.exports= Router;