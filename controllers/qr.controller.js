// const QRCode = require("qrcode");
const QRCode = require('easyqrcodejs-nodejs');
const CacheService = require('../service/cache.service');
const ttl = 60 * 60 * 24; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service insta
const crypto = require('crypto');
const ShortUrl = require('../service/tinyurl.service');
const logger = require('../infrastructure/logger');
const Enum = require('../infrastructure/enum.util');
const ClientModel = require('../models/client.model');

exports.GenerateQR = async(req, res)=>{
    console.log('GenerateQR');
    
    let optionStr = JSON.stringify(req.query); 
    console.log(optionStr);
    let qrId = crypto.createHash('md5').update(optionStr).digest("hex");
    const jsonObj = req.query;
    // if (req.query.data!==undefined){
    //     //options.text = req.query.data;
    //     longUrl = req.query.data
    //     jsonObj = req.query;
    // }
    // else{
    //     //options.text = req.body.data;
    //     longUrl = req.body.data;
    //     jsonObj = req.body;
    // }   

    cache.get(qrId, async()=>{return GenerateQRAsync(jsonObj, qrId)}).then((result)=>{    
        const im = result.split(",")[1];
        const img = Buffer.from(im, 'base64');
        res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
        });
        res.end(img);     
        res.flush();
       
    }).catch((e)=>{
        console.log(e);
        res.status(500).json({Error:e.message});   
    });
    
}

async function GenerateQRAsync(jsonObj, qrId){
    console.log('GenerateQRAsync');

    let qr = await ClientModel.Client.Get(qrId);
    if (qr!==null)
        return qr.qrcode;

    var data = "";
    var options = {
        text: data
    };

    var longUrl = jsonObj.data;
   
    //=====================================================================================================
    //Start TinyUrl
    //=====================================================================================================
    if (jsonObj.hasOwnProperty('shorturl'))
    {
        const shortUrlRes = await ShortUrl.Create(longUrl);
        if (shortUrlRes.status==Enum.Status.Success){       
            options.text = shortUrlRes.url;
        }
        else{        
            options.text = longUrl;
        }
    }
    else{options.text = longUrl;}
    //=====================================================================================================
    //End TinyUrl
    //=====================================================================================================

    if (jsonObj.hasOwnProperty('logo')){
        options.logo = jsonObj.logo;
    }
    if (jsonObj.hasOwnProperty('width')){
        options.width = parseInt(jsonObj.width);
    }
    if (jsonObj.hasOwnProperty('height')){
        options.height = parseInt(jsonObj.height);
    }
    if (jsonObj.hasOwnProperty('backgroundimage')){
        options.backgroundImage = jsonObj.backgroundimage;
        options.autoColor=true;
    }
    if (jsonObj.hasOwnProperty('foregroundcolor')){
        console.log(jsonObj.foregroundcolor);
        if (!jsonObj.foregroundcolor.startsWith('#'))
            jsonObj.foregroundcolor ='#' + jsonObj.foregroundcolor;
        
        options.colorDark = jsonObj.foregroundcolor;
    }
    if (jsonObj.hasOwnProperty('backgroundcolor')){
        if (!jsonObj.backgroundcolor.startsWith('#'))
            jsonObj.backgroundcolor ='#' + jsonObj.backgroundcolor;        
        options.colorLight = jsonObj.backgroundcolor;
    }

    //options.text ="https://app.adjust.com/8o76e42?engagement_type=fallback_click&fallback=https://www.alliancebank.com.my/promotions/thebankinyourpocket.aspx&fallback_lp=https://www.alliancebank.com.my/promotions/thebankinyourpocket.aspx&campaign=biyp&adgroup=fb&creative=null&ecid=abcd";
    console.log(options);
   
    // const uri = await QRCode.toDataURL(data);
    var qrcode = new QRCode(options);
    const base64QR = await qrcode.toDataURL();
    
    await ClientModel.Client.Create(qrId, jsonObj, base64QR, longUrl, options.text);
    
    return base64QR;
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

