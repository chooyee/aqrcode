
// const QRCode = require("qrcode");
const QRCode = require('easyqrcodejs-nodejs');
const CacheService = require('../service/cache.service');
const ttl = 60 * 60 * 24; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service insta
const crypto = require('crypto');

exports.GenerateQR = async(req, res)=>{

    let optionStr = JSON.stringify(req.query); 
    let qrId = crypto.createHash('md5').update(optionStr).digest("hex");

    cache.get(qrId, async function(){return GenerateQRAsync(req,qrId)}).then((result)=>{    
        const im = result.split(",")[1];
        const img = Buffer.from(im, 'base64');
        res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
        });
        res.end(img);     
       
    }).catch((e)=>{
        console.log(e);
        res.status(500).json({Error:e.message});   
    });
    
}


async function GenerateQRAsync(req, qrId){
    var data = "";
    var options = {
        text: data
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
        options.autoColor=true;
    }
    if (jsonObj.hasOwnProperty('colorDark')){
        console.log(jsonObj.colorDark);
        if (!jsonObj.colorDark.startsWith('#'))
            jsonObj.colorDark ='#' + jsonObj.colorDark;
        
        options.colorDark = jsonObj.colorDark;
    }
    if (jsonObj.hasOwnProperty('colorLight')){
        if (!jsonObj.colorLight.startsWith('#'))
            jsonObj.colorLight ='#' + jsonObj.colorLight;        
        options.colorLight = jsonObj.colorLight;
    }

    
    console.log(options);
   
    // const uri = await QRCode.toDataURL(data);
    var qrcode = new QRCode(options);
    return qrcode.toDataURL();
    // let path = './public/assets/img/qrcode/' + qrId + '.png';
    // qrcode.saveImage({
    //     path: path
    // });

    // const proxyHost = req.headers["x-forwarded-host"];
    // const host = proxyHost ? proxyHost : req.headers.host;

    // return host + '/assets/img/qrcode/' + qrId + '.png';
}

exports.GenerateQRRaw = async (data)=>{
    var qrcode = new QRCode(data);
    return qrcode.toDataURL();
}

