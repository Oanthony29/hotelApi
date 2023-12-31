const register = require("../Model/hotelModel");
const emailSender = require("../Utils/emil");
// const cloudinary = require("../Utils/cloudinary");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.newRegister = async(req,res)=>{
    try{
        const {firstName,lastName,phoneNumber,email,password,confirmPassword} = req.body;
        const checkAdmin = await register.findOne( { email: email } );
    if (checkAdmin) {
      return res.status(400).json({
        message: "Email already taken."
      })
    }
        if (password !== confirmPassword) {
          return res.status(400).json({ error: 'Password and confirm password do not match.' });
        }

        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        const data = {
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hash,
        }
        const createNew = new register(data);
        // console.log(createNew)
        const userToken = jwt.sign({
            id: createNew._id,
            password: createNew.password,
            isAdmin: createNew.isAdmin
        }, process.env.JWT_TOKEN,{expiresIn: "1d"});

        createNew.token = userToken;
        await createNew.save();

        const VerifyRoute = `${req.protocol}://${req.get("host")}/api/Verify/${createNew._id}`;
        const message = `thanks for signing up as an Admin ${createNew.firstName} Kindly use the link to verify your account  ${VerifyRoute}`;
        emailSender({
            from:process.env.USER,
            email: createNew.email,
            subject: "Verify your Account",
            message,
        });
        function validateEmail(email) {
            const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return re.test(email);
        }
        
        const isValidEmail = validateEmail(email);
        if (isValidEmail) {
         return res.status(200).json({
            message: "User Created",
            data: createNew
         })
        } else {
            return res.status(400).json({
                message: 'Email address is invalid',
                message2: "Could not create User"
            })
        }
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
exports.confirmVerify = async(req,res)=>{
    try{
        const id = req.params.id;
        
        const admin = await register.findById(id)
       
        await register.findByIdAndUpdate(
            admin.id,
            {
                isVerified : true,
                isAdmin:true
            },
            {
                new: true
            }
        )

        res.status(201).json({
            message: "You have been verified and now an Admin"
        });
    }catch(e){
        res.status(400).json({
        message: e.message
       });
    }
}    
//Admin Login
exports.adminLogin = async(req,res) => {
    try{
        const {email} = req.body
        const check = await register.findOne({ email: email}); 
        if(!check) return res.status(404).json({message: "Not Found"});
        const IsPassword = await bcryptjs.compare(req.body.password, check.password)
        if(!IsPassword) return res.status(404).json({message: "Email or Password incorrect"});

        const myToken = jwt.sign({
            id: check._id,
            password: check.password,
            isAdmin: check.isAdmin
        }, process.env.JWT_TOKEN,{ expiresIn: "1d"});

        check.token = myToken
        await check.save();
        
     const{password,...others} = check._doc

        res.status(200).json({
            message: "Successfully Login",
            data: others
        });
    

     }catch(e){
        res.status(404).json({
            message: e.message
        });
    }
};
// Show All Admins
exports.getAllAdmin = async(req,res)=>{
    try{
        const allAdmin = await register.find();
        res.status(201).json({
            message: "All Admin",
            length: allAdmin.length,
            data: allAdmin
        });    
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};
//get A Single Admin

exports.getSingleAdmin = async(req,res)=>{
    try{
        const adminId = req.params.adminId;
        const SingleAdmin = await register.findById(adminId);
        res.status(201).json({
            message: "Single Admin",
            data: SingleAdmin
        });    
    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};

exports.deleteRec = async(req,res)=>{
    try{
        const id = req.params.id
        await register.findByIdAndDelete(id);

        res.status(201).json({ message: " now Successfully  Deleted"})
    }catch(e){
        res.status(404).json({
            message: e.message
        });a
    }
};
exports.changePassword = async(req,res)=>{
    try{
        const {password}= req.body
       const adminId = req.params.adminId
       const adminpassword = await register.findById(adminId)
       const salt = bcryptjs.genSaltSync(10)
       const hash = bcryptjs.hashSync(password, salt)
       await register.findByIdAndUpdate(adminpassword,{password:hash},{new:true})
       res.status(201).json({
        message: "sucessfully changed password"
       })
    }catch(e){
        res.status(400).json({
            message:e.message
        }) 
    }
};



exports.resetpassword = async (req, res) => {
    try{
        const {email} = req.body
        const adminEmail= await register .findOne({email})
        if(!adminEmail) return  res.status(404).json({ message: "No Email" })

        const VerifyLink = `${req.protocol}://${req.get("host")}/api/changepass/${adminEmail._id}`
        const message = `Use this link ${adminEmail.firstName} to reset your password. ${VerifyLink}`;
        emailSender({
          from:process.env.USER,
          email: adminEmail.email,
          subject: "Reset Pasword",
          message,
        })
        
        res.status(201).json({
            message:"email have been sent"
        })
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
};

exports.adminLogOut = async(req,res)=>{
    try{
        const Adminlogout = await register.findById(req.params.adminId);
        const myToken = jwt.sign({
            id: Adminlogout._id,
            password: Adminlogout.password,
            isAdmin: Adminlogout.isAdmin
        }, process.env.JWT_DESTROY,{ expiresIn: "5sec"});
        Adminlogout.token = myToken;
        await Adminlogout.save();
        res.status(200).json({
            message: "Successfully Logged Out"
        });

    }catch(e){
        res.status(400).json({
            message: e.message
        });
    }
};