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

        const userVerify = `${req.protocol}://${req.get("host")}/api/userVerify/${createNew._id}`;
        // const pageUrl = `${req.protocol}:/#/verify/${createNew._id}`
        const message = "Thank you for registering with our app. Please click this link  to verify your account"
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
        
        const user = await register.findById(id)
       
        await register.findByIdAndUpdate(
            user.id,
            {
                isVerified : true
            },
            {
                new: true
            }
        )

        res.status(201).json({
            message: "You have been verified"
        });
    }catch(e){
        res.status(400).json({
        message: e.message
       });
    }
}    