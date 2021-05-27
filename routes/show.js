const router=require('express').Router();
const File=require('../models/file');


//download page
router.get('/:uuid',async (req,res)=>{

    //fetch onr row from database
    try {
        const file=await File.findOne({uuid : req.params.uuid });

        //if download file has not found
        if(!file){
            return res.render('download',{error:'Link has been Expired.'});
        }

        return res.render('download',{
            uuid:file.uuid,
            fileName:file.filename,
            //to client
            fileSize:file.size,
            downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            // http://localhost:3000/files/download/uuid
        });
    }
    catch(err){
        return res.render('download',{error:'Something went wrong.'});
    }

});

module.exports=router;
