const path=require('path');
const express = require('express');

const app = express();
console.log(path.join(__dirname,"./assets"));
app.use(express.static(path.join(__dirname,"./assets")));
app.get("/",(req,res,next)=>{
    res.redirect('/html/index.html');
});
app.listen(3000,()=>{
    console.log("app started at 3000");
})