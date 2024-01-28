const mongoose = require('mongoose');

const url = `mongodb://127.0.0.1:27017/ShoShin_Tech`;

mongoose.connect(url,
/* Below commented code will work in mongoose version <= 6.3.0 as it will take callback*/
//     ,(err)=>{
//     if(err){
//         console.log(err,"=== Error While ConnectingMongoDB!");
//         process.exit();
//     }else{
//         console.log("MongoDB Connected Successfully!");
//         console.log(mongoose.connection.readyState, 'MongoDB Connection Successfully');
//     }
// }
)
/* Below code will work in any version of mongoose*/
.then((res)=>{
    console.log(mongoose.connection.readyState,'MongoDB Connected Successfully!');
}).catch((err)=>{
    console.log(err, "====err");
    process.exit()
})


module.exports = {mongoose}