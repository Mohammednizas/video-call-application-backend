const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const user =[{}]
const io = require("socket.io")(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:["GET","POST"]
    }
})

app.get('*',(req,res)=>{
    res.send("this is res");
})
io.on("connection",(socket)=>{
    socket.on("call",(data)=>{
        console.log(data.userTo)
        io.to(user[data.userTo]).emit("call",{signal: data.signalData,from: data.from,name: data.name,phno:data.number,vido:data.vido})
    })
    socket.on('fixMyId',(id)=>{
    user[id]=socket.id;
        socket.emit('me',socket.id)
    })
    socket.on("call-ended",(to)=>{
        console.log(user[to])
        io.to(user[to]).emit("call-ended")
    })
    socket.on("disconnect",()=>{
    
        socket.broadcast.emit("callEnded")

    })
    socket.on("busy",(data)=>{
        io.to(data.from).emit("busy")
    })
        
    socket.on("answerCall",(data)=> {
        
        io.to(data.to).emit("callAccepted",data.signal)
        
    
})
})
const PORT = process.env.PORT || 5000;
server.listen(5000,()=> console.log(`server listening at port ${PORT}`));
