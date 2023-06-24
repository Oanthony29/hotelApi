const express= require("express");
const{newRegister,confirmVerify,adminLogin}= require("../Controllers/regController")
const Router = express.Router()
Router.route("/admin").post(newRegister); 
Router.route("/Verify/:id").post(confirmVerify);
Router.route("/login").post(adminLogin);
module.exports= Router;