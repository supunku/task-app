const fetchTasks = async (searchText) => {
    var  url = "/api/tasks";
        if(searchText && searchText !== ""){
            url = "/api/tasks?search="+searchText
        }
    try{
        const response = await fetch(url);
        const tasks = await response.json();

        if (tasks.length===0){
            return document.querySelector(".task-container").innerHTML = "No records to display";
        }

        var tasksHtml = "";

        tasks.forEach((task)=>{
            tasksHtml = tasksHtml + generateTaskCard(task);
        })

        document.querySelector(".task-container").innerHTML = tasksHtml;
    }catch(error){
        console.log(error)
    }
}


const createTask = async () => {
    const url = "/api/tasks";
    
    hideModal("#createTask");
    showLoader("#btn-add", {content:addingLoader});
    

    const taskData = {
        description: document.querySelector("#description").value,
        completed:document.querySelector("#completed").checked
    }
    try{
            const response = await fetch (url,{
                 method: "POST",
                 headers : {
                     "Content-Type" : "application/json"
                 },
                 body:JSON.stringify(taskData)
             });
             const task = await response.json();
             if(task.error){
                return showError({content:task.error})
             };
     
             const taskHtml = generateTaskCard(task);

             const taskCard = document.querySelectorAll(".task-cart");

             if(taskCard.length===0){
                $('.task-container').html("")
             }
     
             $('.task-container').append(taskHtml);
             showSuccess({content:"Successful task creation"})
     
         }catch(error){
             showError({content:"Something went wrong. Please try again"})
         }finally{
             
             hideLoader('#btn-add',{content:`+Add`})
         }
}

const initiateUpdate = async (id) =>{
   
    try{
        const response = await fetch("/api/tasks/"+ id);
        const task = await response.json();

        if(task.error){
         return showError(task.error)
        }
        $("#updateDes").val(task.description)
        document.querySelector("#updateCom").checked = task.completed;
        document.querySelector("#taskId").value = task._id;
        showModal("#update-modal")
    }catch(error){
        showError({content:"Something went wrong. Please try again"})
    }
}


const updateTask = async () =>{
    const id = document.querySelector("#taskId").value;
   
  hideModal("#update-model");
  
  const prevButtonContent = document.querySelector("#task-"+id+" .btn-primary").innerHTML;
  showLoader("#task-"+id+" .btn-primary",{content:generalLoader});

    const taskData ={
        description : document.querySelector("#updateDes").value,
        completed : document.querySelector("#updateCom").checked
    }
   
    try{
       const response = await fetch("/api/tasks/"+ id,{
           method : "PATCH",
           headers :  {
               "Content-Type" : "application/json"
           },
           body: JSON.stringify(taskData)
       });
   
       const task = await response.json();
   
       if (task.error){
           return showError({content:task.error})
       }
           $("#task-"+id).removeClass("bg-green");
           if(task.completed){
            $("#task-"+id).addClass("bg-green");
           }
           
           $("#task-"+id+"h5").text(task.description);
          
   
           showSuccess({content:"Task updated successfuly"});
    }catch(error){
        showError({content:"Something went wrong. Please try again"})
    }finally{
        hideLoader("#task-"+id+" .btn-primary",{content:prevButtonContent});
    }
   }

const initiateDelete = (id) =>{
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
       if(willDelete){
           deleteTask(id);
       }
      });
}

const deleteTask= async (id) =>{
     const prevButtonContent = document.querySelector("#task-"+id+" .btn-danger").innerHTML;
    console.log(document.querySelector("#task-"+id))
    showLoader("#task-"+id+" .btn-danger",{content:generalLoader});
    try{
        const response = await fetch("/api/tasks/"+ id,{
            method: "DELETE",
            headers : {
                "Content-Type" : "application/json"
            },
        });
        const task = await response.json();
        if(task.error){
            return showError({content:task.error})
        }
        $("#task-"+id).remove();
        showSuccess({content:"Task deleted successfuly"})
    }catch(error){
        showError({content:"Something went wrong. Please try again"})
    }finally{
        hideLoader("#task-"+id+" .btn-danger",{content:prevButtonContent})
    }
}



fetchTasks();


const generateTaskCard = (task) =>{
    var status = task.completed ? "bg-green" : "";
   
    return `
    <div class="task-cart ${status}" id="task-${task._id}">
    <h5>${task.description}</h5>
    <div class="crud-buttons">
    <button class="btn btn-primary  edit-btn" onclick="initiateUpdate('${task._id}')"><i class="fas fa-edit"></i></button>
    <button class="btn btn-danger " onclick="initiateDelete('${task._id}')"><i class="fas fa-trash"></i></button>
    </div>
</div>
    `
}

const createForm = $("#create-form");
const updateForm = $('#update-form')
const searchForm = $('#search-form')

createForm.validate({
    rules:{
        description:{
            required:true
        }
    }
})

updateForm.validate({
    rules:{
        updateDes:{
            required:true
        }
    }
})

createForm.on("submit",(event)=>{
    event.preventDefault();
    if(createForm.valid()){
        createTask();
        createForm[0].reset();
    }
   
})

updateForm.on("submit",(event)=>{
    event.preventDefault();
    if(updateForm.valid()){
        updateTask();
    }
   
})


searchForm.on("submit",(event)=>{
    event.preventDefault();
    const searchText = document.querySelector("#search").value;
    
    fetchTasks(searchText);
})