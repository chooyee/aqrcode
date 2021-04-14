const e = require("express");
const QRCode = require("qrcode");


exports.GenerateQR = async(req, res)=>{
    var data = "";
    if (req.query.data!==undefined){
        data = req.query.data;
    }
    else{
        data = req.body.data
    }   
    console.log(req.body);

    try{
        const uri = await QRCode.toDataURL(data);
        res.status(200).send(uri);    
    }
    catch(e){
        res.status(500).send(e);   
    } 
};

