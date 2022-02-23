const express = require('express');
const auth = require("../middleware/auth.js");
const apiAuth = require("../middleware/api-auth.js")


const router = express.Router();

const Task = require('../db/models/task.js');

router.get("/tasks",auth,(req,res)=>{
   res.render("tasks",{user:req.session.user});
})

//--------------------------------API end points --------------------------------------------

//Create Task

router.post("/api/tasks",apiAuth,async(req,res)=>{
    req.body.owner = req.session.user._id;
    const task = new Task(req.body);


    try{
        await task.save();
        res.send(task)
    }catch(error){
        res.send({error:error.message})
    }
    // task.save().then((task)=>{
    //     console.log(task)
    // }).catch((error)=>{
    //     res.send(error.message)
    // });
    
});

//Read all task

router.get("/api/tasks",apiAuth,async(req,res)=>{
    
    

    try{
        var task = []
        if(req.query.search){
            task = await Task.find({owner:req.session.user._id,description:{$regex:req.query.search,$options:"i"} })
        }else{
            task = await Task.find({owner:req.session.user._id})
        }
        
        res.send(task)
        

    }catch(error){
        res.send({error:error.message})
    }
    
    
});


//Read a task

router.get("/api/tasks/:id",apiAuth,async(req,res)=>{
    const id = req.params.id;

    try{
        const task = await Task.findOne({_id:id,owner:req.session.user._id});

        if(task){
            return res.send(task)
        }
        res.send({error:"Tasks not found !!"});
    }catch(error){
        res.send(error.message)
    }
        
})

//Update a task

router.patch("/api/tasks/:id",apiAuth,async(req,res)=>{
    const id = req.params.id;
    

    const allowedUpdates = ["description","completed"];
    const updates = Object.keys(req.body);
    const owner = req.session.user._id;

    const isValid = updates.every((key)=>{
        return allowedUpdates.includes(key)
    });

    if(!isValid){
        return res.send({error:"Invaild Updates"})
    }

    try{
        const tasks = await Task.findOneAndUpdate({_id:id,owner:owner},req.body,{new:true});
        if(tasks){
            return res.send(tasks)
        }
        res.send({error:"Unable to update.The user is not found"})
    }catch(error){
        res.send({error:error.message})
    }
});


//Delete a task

router.delete("/api/tasks/:id",apiAuth, async(req,res)=>{
    const id = req.params.id;


    try{

        const task = await Task.findOneAndDelete({_id:id,owner:req.session.user._id});
        
        if(task){
            return res.send(task)
        }
        res.send({error:"Unable to remove the task.task does not exsist"})

    }catch(error){
        res.send({error:error.message})
    }
})



module.exports = router;