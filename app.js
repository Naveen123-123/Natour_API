const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.status(200).json({message:"Hellow from server side",app:"Natours"});
});
app.post('/',(req,res)=>{
    res.send("You can post to this endpoint...")
})
app.listen(port,()=>{
    console.log(`App is running on port ${port}...`);
})
