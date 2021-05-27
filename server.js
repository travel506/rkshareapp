const express=require('express');
const app=express();
const path=require('path');
const cors=require('cors');


const port=process.env.PORT || 3000;

//after refreshing the page to use static files like css
app.use(express.static('public'));

//middleware of express to enable or can parse json data
app.use(express.json());

const connectDB=require('./config/db');
connectDB();

//enable cors
const corsOptions={
  origin:process.env.ALLOWED_CLIENTS.split(',') //string to array
}

app.use(cors(corsOptions));

//template engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');


//Initialization of routes for uploading files
app.use('/api/files',require('./routes/files'));

//download page route by taking uuid
app.use('/files',require('./routes/show'));


//download link
app.use('/files/download',require('./routes/download'));


app.listen(port,()=>{
   console.log("server running at port no - ",port); 
});
