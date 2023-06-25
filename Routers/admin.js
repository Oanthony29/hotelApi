const express= require("express");
const{newRegister,confirmVerify,adminLogin, getAllAdmin,getSingleAdmin}= require("../Controllers/regController")
const Router = express.Router()
Router.route("/admin").post(newRegister); 
Router.route("/Verify/:id").post(confirmVerify);
Router.route("/login").post(adminLogin);
Router.route("/viewAll").get(getAllAdmin);
Router.route("/view/:adminId").get(getSingleAdmin);
module.exports= Router;