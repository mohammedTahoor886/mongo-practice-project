const express=require('express');
let app=express();
let path=require('path');
const mongoose = require('mongoose');
const Chat=require('./models/chat.js');
const methodOverride=require("method-override");

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
    let chats= await Chat.find();
    res.render("index.ejs",{chats});
})
// create new users
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})
//post the msg
app.post("/chats",(req,res)=>{
    let{from,msg,to}=req.body;
    const newChat=new Chat({
        from:from,
        msg:msg,
        to:to,
        created_by:new Date()
    })
    newChat.save()
    .then(res=>{
        console.log("saved")
    }).catch(err=>{
        console.log(err)
    })
    res.redirect("/chats");
})
//edit the msg
app.get("/chats/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit.ejs",{chat})
})

app.patch("/chats/:id",async(req,res)=>{
    let{id}=req.params;
    let {msg:newmsg}=req.body;
    let newChat=await Chat.findByIdAndUpdate(id,{msg:newmsg},{runValidators:true,new:true})
    console.log(newChat)
    res.redirect("/chats")
})
//destroy the msg
app.delete("/chats/:id",async(req,res)=>{
    let{id}=req.params;
    let chat= await Chat.findByIdAndDelete(id);
    console.log(chat);
    res.redirect("/chats");
})
app.listen("8080",()=>{
    console.log("listening port 8080")
})