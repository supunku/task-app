const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const objectId = require('mongoose').Types.ObjectId;
const path = require('path');
const fs = require('fs')


const userSchema = mongoose.Schema({
    name:{type:String},
    age:{type:Number},
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate:(value)=>{
            if(!validator.isEmail(value)){
                throw new Error("The email is incorrect")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:8,
        validate:(value)=>{
            
            if(value.toLowerCase().includes("password")){
                throw new Error("The password should not contain word password");
            }

           
        }
    },
    profileImage:{
        type:String,
        default:"profile.png"
    },
    confirm:{
        type:Boolean,
        default: false
    }
})

userSchema.pre("save",async function(next){
 const user = this ;

 if(user.isModified("password")){
    user.password = await bcrypt.hash(user.password,8);
 }
 
 next();
})

userSchema.statics.findByCredentials = async(email,password) =>{
    const user = await User.findOne({email:email})

    if(!user){
        return {error:"Invalid Credentials"};
    }

    if(!user.confirm){
        return {error:"Please confirm your email"}
    }


    const isMatch = await bcrypt.compare(password,user.password);

    if(isMatch){
        return user;
    }

    return {error:"Invalid Credentials"};;
}

userSchema.statics.getPublicData = (user) =>{
    return{
        _id : user._id,
        name:user.name,
        age:user.age,
        email:user.email,
        profileImage:user.profileImage
    }
}

userSchema.statics.uploadImage = async (file) =>{
    const allowedFiles = ["jpeg","png","JPEG","gif","jpg"];
    const ext = file.name.split(".").pop();

    if(!allowedFiles.includes(ext)){
        return {error:"Please upload an image file"}
    }

    const fileSizeInMb = 5*1024*1024

    if(file.size>fileSizeInMb){
        return {error:"Please upload an image file less than 5MB"}
    }

    var filename = new objectId().toString()+"."+ext
    
    try{
         await file.mv(path.resolve("./public/images/"+filename));
         return {filename:filename}
    }catch(error){
        return {error:"Something has happen unable to upload the file"}
    }
   
}


userSchema.statics.removeImage =  (filename) =>{
    try{
         fs.unlink("./public/images/"+filename,(error)=>{
             if(error){
                 return {error:"Something went wrong.Unable to remove image"}
             }
             return "File removed successfuly"
         })
        
    }catch(error){
        return {error:"Something went wrong.Unabe to remove file."}
    }
}


const User = mongoose.model("User",userSchema);


module.exports = User;