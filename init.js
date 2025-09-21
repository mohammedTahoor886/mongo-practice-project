const mongoose = require('mongoose');
const Chat = require('./models/chats');
main().then(res =>{
    console.log("connection success");
})
.catch(err=>{
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp") 
}

let chats=[
    {from: "dhoni", to: "jaddu", msg: "sir ravindara jadeja", created_by: new Date()},
    {from: "dhoni", to: "jaddu", msg: "come to practice", created_by: new Date()}]

Chat.insertMany(chats).then(res=>
    console.log(res)
)