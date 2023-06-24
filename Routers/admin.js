const express= require("express");
const{newRegister,confirmVerify}= require("../Controllers/regController")
const Router = express.Router()
Router.route("/admin").post(newRegister); 
Router.route("/userVerify/:id").post(confirmVerify);
module.exports= Router;