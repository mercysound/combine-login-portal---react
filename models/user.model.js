const bcrypt = require("bcryptjs")
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  firstname:{type:String, require:true},
  lastname:{type:String, require:true},
  email:{type:String, require:true, unique:true},
  password:{type:String, require:true}
});
let saltRound = 10
userSchema.pre("save", function(next){
  // console.log(this.password);
  bcrypt.hash(this.password, saltRound, (err, hashedPassword)=>{
    if(!err){
      this.password = hashedPassword
      next()
    }else{
      console.log(err);
    }
    // console.log(hashedPassword);
  })
});
// inside schema, its allow to create any func if i want
userSchema.methods.validatePassword = function(password, callback){
  bcrypt.compare(password, this.password, (err, same)=>{
    if(!err){
      callback(err, same)
    }else{
      next()
    }
  })
}

const userModel = mongoose.model("User_authentic", userSchema);


module.exports = userModel;