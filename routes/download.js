const router=require('express').Router();
const File=require('../models/file');

router.get('/:uuid',async (req,res)=>{
    const file=await File.findOne({ uuid: req.params.uuid});
    if(!file){
        return res.render('download',{error:'Link has been expired.'});

    }

    //downloading the files from upload folder
    const filePath=`${__dirname}/../${file.path}`;
    //download a file
    res.download(filePath);

});

module.exports=router;