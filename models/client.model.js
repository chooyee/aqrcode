const db = require("../models");
const logger = require('../infrastructure/logger');

class ClientModel{

    constructor () {     
        this.ClientDB = db.Client;  
    }

    Create = async (qrId, jsonObj, base64QR, longUrl, tinyurl)=>{
        console.log('ClientModel:Create');
        
        this.ClientDB.create({
            md5: qrId,          
            request: JSON.stringify(jsonObj),
            qrcode: base64QR,
            longurl: longUrl,
            tinyurl: tinyurl,
            
        }).then((result)=>{
            return result;
        }).catch((err)=>{
            console.log(err.message);
            const incomingRequest = {
                md5: qrId,          
                request: JSON.stringify(jsonObj),
                qrcode: base64QR,
                longurl: longUrl,
                tinyurl: tinyurl,
                
            }
            logger.log.error("Incoming Request: " + JSON.stringify(incomingRequest));
            logger.log.error(err.message);
            return err;
        })
        
    }

    Get = async (qrId) =>{
        console.log('ClientModel:Get');

        const qr = await this.ClientDB.findOne({where:{md5:qrId}});
        if (qr === null) {
            return null;
        } else {
            return qr;
        }
    }

    CreateIndex = async()=>{
        var query = 'CREATE INDEX IF NOT EXISTS "md5" ON "clients" ("md5")';
        await ndb.sequelize.query(query);
        return "ok";
    }
}

exports.Client = new ClientModel();
