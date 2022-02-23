const express = require('express');
const path = require('path')
const userRouter = require('./router/user-router.js')
const taskRouter = require('./router/task-router.js')
const sessions = require('express-session')
const fileUpload = require('express-fileupload')

require('./db/mongoose.js')


var port = process.env.PORT



const app = express();


app.use(sessions({secret:process.env.SESSION_KEY,resave:true,saveUninitialized:true}))

const publicDirectory = path.join(__dirname,'../public');
app.use(express.static(publicDirectory));

app.use(fileUpload());
app.use(express.urlencoded({extended:true}))
app.use(express.json());


app.set("view engine","hbs"); 

//epress roters
app.use(userRouter);
app.use(taskRouter);




//Update and count 

// const UpdateAndCount = async () =>{
    
//     try{
//         const user = await User.findByIdAndUpdate("620751a4d6f7e9f95b495ce8",{age:15});
//         const count = await User.countDocuments ({age:15});
//         console.log(count);
//     }catch(error){
//         console.log(error)
//     }
// }

// UpdateAndCount();






app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
});