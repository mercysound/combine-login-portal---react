const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const userRouter = require("./routes/user.route");
const cors = require("cors");
// var declara
const MONGOOSE_URI = process.env.MONGOOSE_URI;
const PORT = process.env.PORT;
//middleware
app.use(express.static(__dirname+"/build")) // for linking the static file
app.use(cors()); //this Enable CORS from all routes

mongoose.connect(MONGOOSE_URI) //Mongoose connection
.then(
  (result)=>{
    console.log("Mongoose has connected");
    // console.log(result);
  })
.catch((err)=>{
  console.log("Fail to connect");
  console.log(err);
});

//func for file upload converter
app.use(express.urlencoded({extended:true, limit:"50mb"})); //this meant for the file coming from ejs
app.use(express.json({limit:"50mb"}))//this meant for the seperate frontend

// ROUTERS:
app.get("/*", (req, res)=>{ //wild card route
  res.sendFile(__dirname+"/build/index.html")
});

app.get("/", (req, res)=>{ // sever side landing page (baseurl) 
  res.send([{StudentList:{
    "SS": "more"
  }},
  {TeacherList:{"HOD":"Fola"}} 
])
});

app.use("/user", userRouter);// for users Router

let connection = app.listen(PORT, ()=>{
  console.log("App is listening @ port: " + PORT);
});

//Method to connect socket
let socketServer = require("socket.io");
let io = socketServer(connection, {cors:{origin:"*"}
}); 

io.on("connection", (socket)=>{
  console.log("A user connected successfully" + socket.id)
  socket.on("sendMsg", (message)=>{
    io.emit("broadcastMsg", message) // this return the msg
    console.log(message)
  });
  //socket disconnection
  socket.on("disconnect", (socket)=>{
    console.log(socket.id);
    console.log("user disconnect");
  }) 
});