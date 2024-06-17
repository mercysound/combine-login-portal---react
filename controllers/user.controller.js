const cloudinary = require('cloudinary').v2;
const userModel = require("../models/user.model")
const jwt =  require("jsonwebtoken");
const nodemailer = require("nodemailer")
const jwtSecret = process.env.JWT_SECRET_KEY
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});
const landingPage = (req, res) =>{
  res.send([
    {name:"Details enter successful", status:200},
    {name:"Details enter successful", status:300},
    {name:"Details enter successful", status:500},
  ]);
  console.log(req.body);
};
const postSignUpPage = (req, res) =>{
  let form = new userModel(req.body);
  form.save()
  .then((result)=>{
    console.log("successful save");
    res.send({message:"User details has saved to db", status: true})
    // console.log(result);
  })
  .catch((err)=>{
    console.log("Can't save");
    res.send({message:"can't save the details", status:false})
    console.log(err);
  })
};
const userLoginAuthentication = (req, res) =>{
  // console.log(req.body);
  let {email, password} = req.body;
  userModel.findOne({email:req.body.email})
  .then((user)=>{
    if(user){
      // res.send({message:"Email is correct", status:true});
      user.validatePassword(password, (err, same)=>{
        if(err){
          res.send({message:"server error", status:false});
        }else{
          if(same){
           let token =  jwt.sign({email}, jwtSecret,{expiresIn:6})
           console.log(token);
            res.send({message:"succesful signin", status:true, token});
          }else{
            res.send({message:"Your password is incorrect", status:false});
          }
        }
      })
      // user.validatePassword(password, (err, same)=>{
      // // console.log(this);
      // if(err){
      //   res.send({message:"Server error", status:false})
      // }else{
      //   if(same){
      //     res.send({message:"User password correct ", status:true})
      //   }{
      //     res.send({message:"User password is not correct", status:false})
      //   }
      // }
      // })
    }else{
      res.send({message:"Email is incorrect", status:false})
    }
    // console.log(user);
  })
  .catch((err)=>{
    res.send({message:"server err", status:false})
    console.log(err);
  })
};
const getDashboard = (req, res) =>{
  let token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, jwtSecret, (err, result)=>{
    if(err){
      res.send({message:"error occured", status:false})
      console.log(err);
    }else{
      let userEmail = result.email
      res.send({message:"You have succeful login", status:true, loginUserMail:userEmail})
      console.log(result);
    }
  })
}
const uploadFile  =  (req, res) =>{
  let file = req.body.myfile
  cloudinary.uploader.upload(file, 
  (error, result)=>{
    if(error){
      console.log("could not be upload");
      console.log(error);
    }else{
      console.log(result);
      let myImgLink = result.secure_url
      res.send({message:"upload successful", status:true, myImgLink})
    }
   });
  // console.log("controller");
};
const sendmail = (req, res)=>{
  // console.log("it work");
  let transporter = nodemailer.createTransport({
    service : process.env.NODE_MAILER_SERVICE,
    auth:{
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASS
    }
  })
  
  let mailOption = {
    from : "adekunleadewolemercy@gmail",
    to : "adewoleadekunlemercy@gmail.com",
    subject:"you are hired",
    text:"You can resume by january and we will be paying you $30k",
    html: "<h5 style='color:red:'>come to resume to your Job</h5>"
  }
  transporter.sendMail(mailOption, (err, info)=>{
    if(err){
      console.log(err);
    }else{
      console.log(info);
    }
  })
}
module.exports = {sendmail, landingPage, postSignUpPage, userLoginAuthentication, getDashboard, uploadFile}