const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const File=require('../models/file');
const {v4:uuid4}=require('uuid');


//config of multer
let storage=multer.diskStorage({
    destination:(req,file,cb)=>  cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        //unique file name 
        const uniqueName=`${Date.now()}-${Math.round(Math.random()* 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
});

let upload=multer({
storage:storage,
limit:{fileSize: 1000000*100},
}).single('myfile');  //fe form name


router.post('/',(req,res)=>{

   //store file to uploads
//    try{
   upload(req,res, async (err)=>{

    //validate request
    if(!req.file){      //if files are not uploaded
        return res.json({error:'All fields are required.'});
    }

    if(err){
        return res.status(500).send({error:err.message});
    }

//  store into database
    const file=new File({
        filename:req.file.filename,
        uuid:uuid4(),
        path:req.file.path,
        size:req.file.size
    });

    //download link generation
    const response=await file.save();
    //domain name
    return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
    //http://localhost:3000/files/uuid
   });
// }
// catch(e){
//     console.log("catch error",e);
// }

  

   //response link
});

//route to send email

router.post('/send',async (req,res)=>{
    // console.log(req.body);
    // return res.send({});

    const {uuid,emailTo,emailFrom}=req.body;
    //validate the req
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:'All fields are required.'});
    }

    //get data from database for link
    // try{

    const file=await File.findOne({uuid:uuid});

    //only one time email can be sent
    if(file.sender){
        return res.status(422).send({error:'Email already sent.'});
    }

    file.sender=emailFrom;
    file.receiver=emailTo;
    const response=await file.save();

    //send email
    const sendMail=require('../services/emailServices');
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'File sharing App - myShare',
        text:`${emailFrom} shared a file with you.`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+' KB',
            expires:'24 hours'
        })
    });

   return res.send({success:true});
// }
// catch(err){
//     return res.status(500).send({ error: 'Something went wrong.'});
// }
});

module.exports=router;
