const express = require('express');
const app = express();
const router = express.Router()
const mongo = require('./config/db.mongo');
const fs = require('fs')
const port = 5200;

app.use(express.json())

app.get('/',(req,res)=>{
   res.send("Request raised!")
});

require('./src/Routers/UserRoutes')(app,router);
// fs.readdirSync(__dirname + '/src/Routers').forEach((file)=>{
//     if(file === 'app.js' || file.substr(file.lastIndexOf('.') + 1) != 'js')
//     return;
//     let name = file.substr(0,file.lastIndexOf('.'))
//     let routers= require('./src/Routers/' + name)(app, router);
//   })
app.listen(port,()=>{
    console.log("Your Application is Running on",port);
})

// const userRoutes = require('./src/Routers/UserRoutes')(app,router)