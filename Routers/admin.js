const express= require("express");
const{newRegister,confirmVerify,adminLogin, getAllAdmin,getSingleAdmin,changePassword,adminLogOut,resetpassword}= require("../Controllers/regController")
const Router = express.Router()
Router.route("/admin").post(newRegister); 
Router.route("/Verify/:id").post(confirmVerify);
Router.route("/login").post(adminLogin);
Router.route("/logout/:adminId").post(adminLogOut);
Router.route("/changepass/:adminId").post(changePassword);
Router.route("/reset").post(resetpassword);
Router.route("/viewAll").get(getAllAdmin);
Router.route("/view/:adminId").get(getSingleAdmin);
module.exports= Router;