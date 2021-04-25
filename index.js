const compression = require('compression')
const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const qr = require("./controllers/qr.controller");
const context = require('./service/context.service');
const db = require("./models");
db.sequelize.sync();
app.use(compression())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.use(cors());
app.set('trust proxy', 1) // trust first proxy
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", async (req, res) => {
    // QRCode.toDataURL('https://www.google.com', function (err, url) {
    //     res.status(200).send('<img src="' + url+ '">');    
    // })
    var data = 'https://app.adjust.com/8o76e42?engagement_type=fallback_click%26fallback=https%3A%2F%2Fwww.alliancebank.com.my%2Fpromotions%2Fthebankinyourpocket.aspx%26fallback_lp=https%3A%2F%2Fwww.alliancebank.com.my%2Fpromotions%2Fthebankinyourpocket.aspx%26campaign=biyp%26adgroup=fb%26creative=null%26ecid=abcd';
    data = decodeURIComponent(data);
    console.log(data);
    var options = {
        text: data,
        colorDark : "#9c23ba"
    };
    var keys = Object.keys(options);
    for( var i = 0,length = keys.length; i < length; i++ ) {
        console.log(keys[i] + ":" +options[keys[i]]);

    }
    try{
        const datauri = await qr.GenerateQRRaw(options);
        //console.log(datauri);
        res.status(200).send('<img src="' + datauri+ '">');    
    }
    catch(e){
        res.status(500).send(e.message);    
    }
});
// simple route
app.get("/ping", (req, res) => {
    res.status(200).send('pong');    
});

app.get("/redirect/:id", (req, res) => {
    var data = 'https://app.adjust.com/8o76e42?engagement_type=fallback_click%26fallback=https%3A%2F%2Fwww.alliancebank.com.my%2Fpromotions%2Fthebankinyourpocket.aspx%26fallback_lp=https%3A%2F%2Fwww.alliancebank.com.my%2Fpromotions%2Fthebankinyourpocket.aspx%26campaign=biyp%26adgroup=fb%26creative=null%26ecid=abcd';
    data = decodeURIComponent(data);
    res.redirect(data);
});

app.get("/", (req, res) => {
    var hostname = req.protocol + '://' + req.hostname;
    if (context.Environment ==='development')
        hostname = req.protocol + '://' + req.header('host');
    res.render('pages/home',{hostname:req.protocol + '://' + req.header('host')});
});
app.get("/qr", qr.GenerateQR);

app.post("/qr", qr.GenerateQR);



// set port, listen for requests
const PORT = context.ExpressPort || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});