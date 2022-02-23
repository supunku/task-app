const mongoose = require('mongoose');


mongoose.connect(process.env.DB_CONNECTION);



//mongodb+srv://admin:Saawariya1@cluster0.xv2tr.mongodb.net/task-manager-api?retryWrites=true&w=majority




// const task = new Task({description:"Clean house"})

// task.save().then((task)=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error)
// })




// const newUser = new User({name:"Peter Parker",age:34,email:"    sprabasara@gmail.com",password:"Saawariya@1"});

// newUser.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// });