const axios = require('axios');
const context = require('../service/context.service');
const logger = require('../infrastructure/logger');
const Enum = require('../infrastructure/enum.util');

class Shorturi {

    constructor() {
        this.basePath = "https://api.tinyurl.com"
        this.endpoints = this.basePath + "/create"
        this.accessToken = context.TinyToken;
        this.createTinyObj ={
            "url": "",
            "domain": "tiny.one"
          }
    }

    Create = async(longUrl) =>{
        console.log('Shorturi:Get');
        const tinyJson = this.createTinyObj;      
        tinyJson.url = longUrl;

        var headers = {
            'Authorization': 'Bearer ' + this.accessToken
        }
        console.log(headers);

        return axios.post(this.endpoints, tinyJson, {
            headers: headers
        })
        .then(response => { 
            console.log(response.data.data.tiny_url);
            return {status:Enum.Status.Success, url:response.data.data.tiny_url};
        })
        .catch(error => {
            console.log(error);
            logger.log.error('Shorturi:Get :' + error);
            //Notify Admin
            return {status:Enum.Status.Fail, message:error.message};
        });
    }

}

module.exports = new Shorturi();