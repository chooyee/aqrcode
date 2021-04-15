
// const QRCode = require("qrcode");
const QRCode = require('easyqrcodejs-nodejs');

exports.GenerateQR = async(req, res)=>{
    var data = "";

    if (req.query.data!==undefined){
        data = req.query.data;
    }
    else{
        data = req.body.data
    }   

    var options = {
        text: data,       
        autoColor:true
    };

    if (req.body.hasOwnProperty('logo')){
        options.logo = req.body.logo;
    }
    if (req.body.hasOwnProperty('width')){
        options.width = req.body.width;
    }
    if (req.body.hasOwnProperty('height')){
        options.height = req.body.height;
    }
    if (req.body.hasOwnProperty('backgroundImage')){
        options.backgroundImage = req.body.backgroundImage;
    }
    if (req.body.hasOwnProperty('colorDark')){
        options.colorDark = req.body.colorDark;
    }
    if (req.body.hasOwnProperty('colorLight')){
        options.colorLight = req.body.colorLight;
    }
    console.log(options);

    try{
        // const uri = await QRCode.toDataURL(data);
        var qrcode = new QRCode(options);
        const uri = await qrcode.toDataURL();
        res.status(200).send(uri);    
    }
    catch(e){
        res.status(500).send(e);   
    } 
}

exports.GenerateQRRaw = async (data)=>{
    var qrcode = new QRCode(data);
    return qrcode.toDataURL();
}

