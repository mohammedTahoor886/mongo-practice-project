const express=require('express');
let app=express();
let path=require('path');
const mongoose = require('mongoose');
const Chat=require('./models/chat.js');
const methodOverride=require("method-override");
const expressError= require('./ExpressError.js');
const {measureMemory} = require('vm');

main().then(res =>{
    console.log("connection success");
})
.catch(err=>{
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp") 
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))

app.get("/",(req,res)=>{
    res.send("running successful")
})
//index to show or display users
app.get("/chats", async (req, res) => {
    try{
        let chats= await Chat.find();
        res.render("index.ejs",{chats});
    }catch(err){
        next(err);
    }
})
function ayncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}
//show cahts
app.get("/chats/:id/show",ayncWrap (async(req,res,next)=>{
        let{id}=req.params;
        let chat =await Chat.findById(id);
        if(!chat){
            return next(new expressError(404,"chat not found"));
        }
        res.render("show.ejs",{chat})  
}));
// create new users
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})
//post the msg
app.post("/chats",ayncWrap(async(req,res,next)=>{
  
    let{from,msg,to}=req.body;
    const newChat=new Chat({
        from:from,
        msg:msg,
        to:to,
        created_by:new Date()
    })
    await newChat.save()
    res.redirect("/chats");    
}));

//edit the msg
app.get("/chats/:id/edit",async(req,res)=>{
    try {
        let {id}=req.params;
        let chat=await Chat.findById(id);
        res.render("edit.ejs",{chat})
    } catch (err) {
        next(err);
    }
})

app.put("/chats/:id",ayncWrap(async(req,res)=>{
        let{id}=req.params;
        let {msg:newmsg}=req.body;
        let newChat=await Chat.findByIdAndUpdate(id,{msg:newmsg},{runValidators:true,new:true})
        console.log(newChat)
        res.redirect("/chats");  
}));
//destroy the msg
app.delete("/chats/:id",ayncWrap(async(req,res)=>{
        let{id}=req.params;
        let chat= await Chat.findByIdAndDelete(id);
        console.log(chat);
        res.redirect("/chats");
}));
const handleValidation=(err)=>{
    console.log("This a ValidationError try follow rules");
    console.dir(err.message);
    return err;
}
const handleCast=(err)=>{
    console.log("This a CastError try to follow rule");
    console.dir(err.message);
    return err;
}
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name == "ValidationError"){
        err=handleValidation(err); 
    }
    else if(err.name === "CastError"){
        err=handleCast(err);
    }
    next(err);
})
//Error Handling Middleware
app.use((err,req,res,next)=>{
    let{status=500,message="something error occured"}=err;
    res.status(status).send(message);
})
app.listen("8080",()=>{
    console.log("listening port 8080")
})