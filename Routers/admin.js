const express= require("express");
const{newRegister,confirmVerify,adminLogin, getAllAdmin,getSingleAdmin,changePassword}= require("../Controllers/regController")
const Router = express.Router()
Router.route("/admin").post(newRegister); 
Router.route("/Verify/:id").post(confirmVerify);
Router.route("/login").post(adminLogin);
Router.route("/changepass/:adminId").post(changePassword);
Router.route("/viewAll").get(getAllAdmin);
Router.route("/view/:adminId").get(getSingleAdmin);
module.exports= Router;