
// const QRCode = require("qrcode");
const QRCode = require('easyqrcodejs-nodejs');

exports.GenerateQR = async(req, res)=>{
    var data = "";
    var options = {
        text: data,       
        autoColor:true
    };

    if (req.query.data!==undefined){
        options.text = req.query.data;
        jsonObj = req.query;
    }
    else{
        options.text = req.body.data;
        jsonObj = req.body;
    }   

    if (jsonObj.hasOwnProperty('logo')){
        options.logo = jsonObj.logo;
    }
    if (jsonObj.hasOwnProperty('width')){
        options.width = parseInt(jsonObj.width);
    }
    if (jsonObj.hasOwnProperty('height')){
        options.height = parseInt(jsonObj.height);
    }
    if (jsonObj.hasOwnProperty('backgroundImage')){
        options.backgroundImage = jsonObj.backgroundImage;
    }
    if (jsonObj.hasOwnProperty('colorDark')){
        options.colorDark = jsonObj.colorDark;
        options.autoColor=false;
    }
    if (jsonObj.hasOwnProperty('colorLight')){
        options.colorLight = jsonObj.colorLight;
        options.autoColor=false;
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

