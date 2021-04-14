const express = require("express");
const cors = require("cors");

const app = express();
var QRCode = require('qrcode')

const qrHelper = require("./controllers/qr.controller");

require('dotenv').config();

app.use(cors());
app.set('trust proxy', 1) // trust first proxy
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
    QRCode.toDataURL('https://www.google.com', function (err, url) {
        res.status(200).send('<img src="' + url+ '">');    
    })
});
// simple route
app.get("/ping", (req, res) => {
    res.status(200).send('pong');    
});


app.get("/qr", (req, res)=>{
    console.log(req.query.data);
    QRCode.toDataURL(req.query.data, function (err, url) {
        if (!err)
            res.status(200).send(url);    
        else
            res.status(500).send(err);   
    })
});

app.post("/qr", (req, res)=>{    
    const data = req.body.data;
    QRCode.toDataURL(data, function (err, url) {
        if (!err)
            res.status(200).send(url);    
        else
            res.status(500).send(err);   
    })
});


// app.post("/qr/logo", qrHelper.QrWithLogo);


// set port, listen for requests
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});